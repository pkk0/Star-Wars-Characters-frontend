<script lang='ts'>
    import { fade } from 'svelte/transition';
    import { people, planetModal } from '$lib/stores';
    import PeopleTableSearch from './PeopleTableSearch.svelte';

    const openPlanetModal = (planetURL: string, button: EventTarget | null) => {
        if(button)
            (button as HTMLButtonElement).blur();
        
        planetModal.show(planetURL); 
    }
</script>

{#await people.load?.()}
<img src="/loading-spinner.svg" alt="" class="w-10 h-10 animate-spin" />
<span class="py-4 text-xl font-medium">
    Loading, plase wait...
</span>
{:then}
<div class="flex-1 w-full" transition:fade={{duration: 1200}}>
    <PeopleTableSearch />
    {#if $people.length == 0}
    <span class="block text-xl font-medium text-center mt-4 p-4 w-full h-full my-auto">No search results found.</span>
    {:else}
    <table class="w-full block table-fixed lg:table mt-4 text-center text-lg 
                  font-medium overflow-x-auto"
    >
        <thead>
            <tr class="divide-gray-400">
                <th on:click={() => people.sort('name')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Name
                    </button>
                </th>
                <th on:click={() => people.sort('height')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Height
                    </button>
                </th> 
                <th on:click={() => people.sort('mass')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Mass
                    </button>
                </th>
                <th on:click={() => people.sort('created')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Created
                    </button>
                </th>
                <th on:click={() => people.sort('edited')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Edited
                    </button>
                </th>
                <th on:click={() => people.sort('planetName')}>
                    <button class="button-flex font-extrabold hover:text-gray-300 transition-colors">
                        <img src="/sort-icon.svg" alt="Sort icon" class="h-6 w-6">
                        Planet name
                    </button>
                </th>
            </tr>
        </thead>
        <tbody>
            {#each $people as person}
            <tr class="border-b border-black last:border-b-0 group" in:fade={{duration: 500}}>
                <td class="font-semibold">{person.name}</td>
                <td>{person.height || '?'}</td> 
                <td>{person.mass || '?'}</td>
                <td>{person.created.toLocaleString()}</td>
                <td>{person.edited.toLocaleString()}</td>
                <td>
                    {#if person.planetName === '?'}
                    {person.planetName}
                    {:else}
                    <button 
                        class="button-flex font-medium "
                        title="Click to explore more information about planet {person.planetName}!"
                        on:click|stopPropagation={(self) => openPlanetModal(person.homeworld, self.target)}
                    >
                        <img src="/click-icon-black.svg" alt="Clickable element icon" 
                            class="h-6 w-6 hidden group-hover:inline">
                        <img src="/click-icon-white.svg" alt="Clickable element icon" 
                            class="h-6 w-6 group-hover:hidden">
                        {person.planetName}
                    </button>
                    {/if}
                </td>
            </tr>
            {/each} 
        </tbody>
    </table>
    {/if}
</div>
{:catch}
    <h2 class="text-5xl text-bold">Oops...</h2>
    <span class="py-4 text-xl text-center">
        The data could not be retrieved from the server.
        <br class="hidden sm:block">
        Try refreshing the page in a moment.
    </span>
{/await}