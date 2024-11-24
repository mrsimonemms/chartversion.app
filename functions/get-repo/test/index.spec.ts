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
// test/index.spec.ts
import {
	createExecutionContext,
	waitOnExecutionContext,
} from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Get Repo worker', () => {
	it.only('should make a successful http request', async () => {
		const request = new IncomingRequest(
			'https://chartversion.app/api/v1/repo/?repo=http://charts.jetstack.io',
		);
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request);

		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"[]"`);

		// const res = await fn.fetch(req, {}, {});

		// console.log(await res.json());

		// expect(res.ok).toBe(true);
	});

	it.skip('should make a successful https request');

	it.skip('should make a successful oci request');

	it.skip('should error when no data received');

	it.skip('should error when bad data received');
});
