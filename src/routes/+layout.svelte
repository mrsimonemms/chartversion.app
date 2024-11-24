<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
</script>

<MetaTags
	title="Finder"
	titleTemplate="%s | ChartVersion.app"
	description="Find the versions of published Helm charts"
	canonical="https://chartversion.app"
/>

<nav class="navbar" aria-label="main navigation">
	<div class="navbar-end">
		<div class="navbar-item">
			<a
				href="https://github.com/mrsimonemms/chartversion.app"
				class="has-text-dark"
				target="_blank"
				aria-label="Open source code"
			>
				<span class="icon is-medium">
					<i class="mdi mdi-36px mdi-github"></i>
				</span>
			</a>
		</div>
	</div>
</nav>

<div class="container is-fluid">
	<div class="columns is-mobile">
		<div class="column is-6-desktop is-offset-3-desktop">
			<div class="has-text-centered">
				<h1 class="title">Chart Version</h1>

				<div class="mx-4">
					<p class="subtitle">
						Finding all the available apps and versions of a Helm chart is a
						pain in the arse. So I built a tool that would list them for you.
					</p>

					<p class="subtitle">
						Enter the chart's URL (<code>https://</code> or <code>oci://</code>)
						and it'll list what's in there.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="is-flex-grow-1">
		<slot />
	</div>
</div>

<div class="footer mt-6 has-text-centered">
	<p>
		&copy; 2024 Made with
		<span class="icon has-text-danger"><i class="mdi mdi-heart"></i></span>
		by
		<a href="https://simonemms.com" target="_blank">Simon Emms</a>
	</p>
</div>
