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
import yaml from 'js-yaml';
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from 'vitest';
import worker, { IHelmEntry } from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Get Repo worker', () => {
	let fetchMock: MockInstance;
	beforeEach(() => {
		fetchMock = vi.fn();

		vi.stubGlobal('fetch', fetchMock);
	});

	it('should make a successful http request', async () => {
		const entries: Record<string, IHelmEntry[]> = {
			chart1: [
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2'],
					version: 'v1.2.3',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2'],
					version: 'v1.2.4',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
			],
			chart2: [
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2'],
					version: 'v1.2.3',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
			],
		};

		fetchMock.mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue(
				yaml.dump({
					entries,
				}),
			),
		});

		const request = new IncomingRequest(
			'https://chartversion.app/api/v1/repo/?repo=http://charts.jetstack.io',
		);
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request);

		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual([
			{
				chart: 'chart1',
				description: 'some description',
				home: 'some home url',
				icon: 'some icon',
				sources: ['source 1', 'source 2'],
				versions: [
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.3',
					},
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.4',
					},
				],
			},
			{
				chart: 'chart2',
				description: 'some description',
				home: 'some home url',
				icon: 'some icon',
				sources: ['source 1', 'source 2'],
				versions: [
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.3',
					},
				],
			},
		]);
	});

	it('should make a successful https request', async () => {
		const entries: Record<string, IHelmEntry[]> = {
			chart1: [
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2', 'source 3'],
					version: 'v1.2.3',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2'],
					version: 'v1.2.4',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
			],
			chart2: [
				{
					home: 'some home url',
					description: 'some description',
					icon: 'some icon',
					sources: ['source 1', 'source 2'],
					version: 'v1.2.3',
					created: new Date(2024, 1, 7, 12, 34, 22).toISOString(),
				},
			],
		};

		fetchMock.mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue(
				yaml.dump({
					entries,
				}),
			),
		});

		const request = new IncomingRequest(
			'https://chartversion.app/api/v1/repo/?repo=https://charts.jetstack.io',
		);
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request);

		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual([
			{
				chart: 'chart1',
				description: 'some description',
				home: 'some home url',
				icon: 'some icon',
				sources: ['source 1', 'source 2', 'source 3'],
				versions: [
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.3',
					},
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.4',
					},
				],
			},
			{
				chart: 'chart2',
				description: 'some description',
				home: 'some home url',
				icon: 'some icon',
				sources: ['source 1', 'source 2'],
				versions: [
					{
						created: '2024-02-07T12:34:22.000Z',
						version: 'v1.2.3',
					},
				],
			},
		]);
	});

	it.skip('should make a successful oci request');

	it('should error when no data received', async () => {
		const request = new IncomingRequest(
			'https://chartversion.app/api/v1/repo/',
		);
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request);

		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual({
			message: 'Repo URL required',
		});
	});
});
