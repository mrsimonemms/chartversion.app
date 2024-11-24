<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import date from '$lib/components/date';

	const defaultChart = 'https://charts.jetstack.io';

	interface IRepo {
		chart: string;
		home: string;
		description: string;
		icon: string;
		sources: string[];
		versions: {
			version: string;
			created: string;
		}[];
	}

	let value: string | undefined = $state();
	let repos: IRepo[] = $state([]);
	let error: string | undefined = $state();

	async function triggerSearch() {
		if (!value) {
			error = 'Required field';
			return;
		}

		try {
			const res = await fetch('/api/v1/repo');

			if (res.ok) {
				const data = await res.json();

				if (data?.error?.message) {
					error = data.error.message;
					return;
				}

				if (data.length === 0) {
					error = 'No charts found';
					return;
				}

				repos = data;
			} else {
				error = res.statusText;
			}
		} catch (err) {
			error = err.message;
		}
	}
</script>

<div class="columns is-mobile">
	<div class="column is-4-desktop is-offset-4-desktop">
		<form>
			<label class="label" for="search">Enter the Helm repository URL</label>
			<div class="field has-addons has-addons-centered">
				<div class="control is-expanded">
					<input
						id="search"
						class="input"
						type="text"
						placeholder={defaultChart}
						bind:value
					/>
					{#if error}
						<p class="help has-text-danger">{error}</p>
					{/if}
				</div>
				<div class="control">
					<button class="button is-primary" onclick={triggerSearch}>
						Search
					</button>
				</div>
			</div>
		</form>
	</div>
</div>

<div class="columns is-multiline is-mobile">
	{#each repos as repo}
		<div class="column is-3-desktop">
			<Card title={repo.chart} subtitle={repo.description} img={repo.icon}>
				<div class="select is-fullwidth">
					<select>
						{#each repo.versions as item, key}
							<option value={key}>
								{item.version} - {date(item.created, 'DATETIME_MED')}
							</option>
						{/each}
					</select>
				</div>
			</Card>
		</div>
	{/each}
</div>
