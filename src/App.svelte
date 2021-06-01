<script>
	import { loaded } from './app/store';
	import Header from './components/Header.svelte';
	import Loader from './components/Loader.svelte';

</script>

<main class="app">
	<div class="app-content">
		<Header />
		{#if !$loaded}
			<Loader />
		{:else}
			<div class="app-stats">
				<h2>Here is your data</h2>
			</div>
		{/if}
	</div>
	<footer>
		<p>Made with ❤️ by <a href="https://twitter.com/Androz2091">Androz2091</a>. Instaddict is <a href="https://github.com/instaddict/instaddict.me">open source</a>!</p>
	</footer>
</main>

<style lang="scss">
	.app {
		min-height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}
</style>