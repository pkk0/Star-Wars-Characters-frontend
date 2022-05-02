<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import PlanetModal from '$lib/components/PlanetModal.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Header />
<PlanetModal />
<slot />
<Footer />