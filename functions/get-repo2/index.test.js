/*
 * Copyright 2024 Simon Emms <simon@simonemms.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, expect, it } from 'vitest';
import fn from './index';

describe('#GetRepo', () => {
	it.only('should make a successful http request', async () => {
		const req = {
			url: 'https://chartversion.app/api/v1/repo/?repo=http://charts.jetstack.io',
		};

		const res = await fn.fetch(req, {}, {});

		console.log(await res.json());

		expect(res.ok).toBe(true);
	});

	it.skip('should make a successful https request');

	it.skip('should make a successful oci request');

	it.skip('should error when no data received');

	it.skip('should error when bad data received');
});
