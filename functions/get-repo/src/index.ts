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

import yaml from 'js-yaml';

interface IVersion {
	version: string;
	created: Date;
}

interface IRecord {
	chart: string;
	home?: string;
	description?: string;
	icon?: string;
	sources: string[];
	versions: IVersion[];
}

interface IHelmRecord {
	entries: Record<string, IHelmEntry[]>;
}

interface IHelmEntry {
	home: string;
	description: string;
	icon: string;
	sources: string[];
	version: string;
	created: string;
}

function getQueryStrings(request: Request): Record<string, string> {
	const params: Record<string, string> = {};
	const url = new URL(request.url);
	const queryString = url.search.slice(1).split('&');

	queryString.forEach((item) => {
		const [key, value] = item.split('=');
		if (key) {
			params[key] = value;
		}
	});

	return params;
}

/**
 * Lookup
 *
 * Gets the first non-falsy value
 *
 * @param {*} data
 * @param {*} key
 * @returns
 */
function lookup<T = unknown>(
	data: IHelmEntry[],
	key: keyof IHelmEntry,
): T | undefined {
	const val = data.find((item) => item[key]);
	if (!val) {
		return;
	}

	return val[key] as T;
}

async function getHttpsChart(url: string) {
	const res = await fetch(url);

	if (res.ok) {
		const text = await res.text();

		const { entries } = yaml.load(text) as IHelmRecord;

		const data: IRecord[] = [];
		for (const chart in entries) {
			console.log({
				chart,
				home: lookup(entries[chart], 'home'),
				description: '',
				icon: '',
				sources: [],
				versions: [],
				// home : entries[chart]
			} as IRecord);
			data.push({
				chart,
				home: lookup(entries[chart], 'home'),
				description: lookup(entries[chart], 'description'),
				icon: lookup(entries[chart], 'icon'),
				sources: lookup<string[]>(entries[chart], 'sources') ?? [],
				versions: entries[chart].map((entry) => ({
					version: entry.version,
					created: new Date(Date.parse(entry.created)),
				})),
			});
		}

		return data;
	}
}

export default {
	async fetch(request): Promise<Response> {
		const { repo } = getQueryStrings(request);

		if (!repo) {
			return Response.json({ message: 'Invalid repo URL' }, { status: 400 });
		}

		let repoUrl: URL;
		try {
			repoUrl = new URL(repo);
		} catch (err) {
			return Response.json({ message: err.message }, { status: 400 });
		}

		let data: IRecord | undefined;

		switch (repoUrl.protocol) {
			case 'http:':
			case 'https:':
				repoUrl.pathname = '/index.yaml';

				data = await getHttpsChart(repoUrl.toString());
				break;

			case 'oci:':
				break;

			default:
				break;
		}

		return Response.json(data);
	},
} satisfies ExportedHandler<Env>;
