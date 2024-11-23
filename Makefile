# Copyright 2024 Simon Emms <simon@simonemms.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FNS_DIR = functions

all: deploy-env deploy-all-functions

cruft-update:
ifeq (,$(wildcard .cruft.json))
	@echo "Cruft not configured"
else
	@cruft check || cruft update --skip-apply-ask --refresh-private-variables
endif
.PHONY: cruft-update

deploy-env:
	@fission env create \
		--name node \
		--image ghcr.io/fission/node-env \
		--poolsize 1 2>&1 1> /dev/null || true
.PHONY: deploy-env

deploy-function:
	@fission fn update --name ${FN_NAME} --code ${FNS_DIR}/${FN_NAME}/index.js 2>&1 1> /dev/null || fission fn create --name ${FN_NAME} --code ${FNS_DIR}/${FN_NAME}/index.js --env node
.PHONY: deploy-function

delete-function:
	@echo "Deleting ${FN_NAME}"
	@-fission fn delete --name ${FN_NAME} 2>&1 1> /dev/null
.PHONY: delete-function

deploy-all-functions:
	@for fn_path in $(shell ls -d ${FNS_DIR}/*); do \
		name=$$(echo $${fn_path} | sed "s/${FNS_DIR}\///"); \
		\
		$(MAKE) deploy-function FN_NAME=$${name}; \
	done
.PHONY: deploy-all-functions

delete-all-functions:
	@for fn_path in $(shell ls -d ${FNS_DIR}/*); do \
		name=$$(echo $${fn_path} | sed "s/${FNS_DIR}\///"); \
		\
		$(MAKE) delete-function FN_NAME=$${name}; \
	done
.PHONY: delete-all-function
