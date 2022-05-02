<script context="module">
	export const prerender = true;
</script>
<script lang="ts">
	import PeopleTable from '$lib/components/PeopleTable.svelte';

	let div: HTMLDivElement;
	$: if (div) {
		fitCurrentScreenHeight();
	}

	function fitCurrentScreenHeight() {
		let toRemove: number;
		if (window.innerWidth < 404) {
			toRemove = 284;
		} else {
			toRemove = 264;
		}

		div.style.minHeight = `${window.innerHeight - toRemove}px`;
	}
</script>

<svelte:head>
	<title>Star Wars Characters</title>
	<meta name="description" content="Explore Star Wars Characters and their planets!">
</svelte:head>

<div
	class="container container-big flex-centered flex-col min-h-[calc(100vh-17.75rem)]
		   lg:min-h-[calc(100vh-16.5rem)] transition-all"
	bind:this={div}
>
	<PeopleTable />
</div>
