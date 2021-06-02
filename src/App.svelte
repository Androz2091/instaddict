<script>
	import { loaded } from './app/store';
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import Loader from './components/Loader.svelte';
	import Visualizer from './components/Visualizer.svelte';

</script>

<main class="app">
	<div class="app-content">
		<Header />
		{#if !$loaded}
			<Loader />
		{:else}
			<Visualizer />
		{/if}
	</div>
	<Footer />
</main>

<style lang="scss">
	.app {
		min-height: 100vh;
		display: grid;
		grid-template-rows: 1fr auto;
	}
</style>