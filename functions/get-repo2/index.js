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

function getQueryStrings(request) {
	const params = {};
	const url = new URL(request.url);
	const queryString = url.search.slice(1).split('&');

	queryString.forEach((item) => {
		const kv = item.split('=');
		if (kv[0]) {
			params[kv[0]] = kv[1] || true;
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
function lookup(data, key) {
	const val = data.find((item) => item[key]);

	if (!val) {
		return;
	}

	return val[key];
}

async function getHttpsChart(url) {
	const res = await fetch(url);

	if (res.ok) {
		const text = await res.text();

		const { entries } = yaml.load(text);

		const data = [];
		for (const chart in entries) {
			data.push({
				chart,
				home: lookup(entries[chart], 'home'),
				description: lookup(entries[chart], 'description'),
				icon: lookup(entries[chart], 'icon'),
				sources: lookup(entries[chart], 'sources'),
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
	async fetch(request) {
		const { repo } = getQueryStrings(request);

		const repoUrl = new URL(repo);

		let data = {};

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
};
