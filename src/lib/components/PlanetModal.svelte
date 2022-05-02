<script type="ts">
    import { fade } from 'svelte/transition';
    import { planetModal } from '$lib/stores';

    const handleClick = (event: Event) => {
        if (!$planetModal.visible)
            return;

        if ((event.target as HTMLElement).id === 'planetModal' || document.getElementById('planetModal')?.contains(event.target as HTMLElement))
            return;
        
        planetModal.hide();
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        if (!$planetModal.visible)
            return;

        if (event.code !== 'Escape' && event.code !== 'Enter')
            return;
        
        planetModal.hide();
    }
</script>

<svelte:window on:click={handleClick} on:keydown={handleKeyUp}/>

{#if $planetModal.visible}
<div class="fixed inset-0 bg-black/60 z-10" transition:fade={{duration: 200}}></div>
<div id="planetModal" class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
         shadow-xl w-[calc(100%-3rem)] py-8 lg:w-fit lg:px-32 lg:py-24 bg-[#EEDB00] text-gray-900 
         rounded-xl z-20 flex-centered flex-col lg:flex-row gap-4 lg:gap-8 text-center"
         transition:fade={{duration: 200}}
>
    <svg on:click={planetModal.hide} class="absolute top-6 right-6 h-9 w-9 hover:scale-[1.2] transition-all" 
        xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <h2 class="text-6xl text-bold pt-10 px-8 lg:p-0">Planet {$planetModal.data?.name}</h2>
    <div class="text-2xl text-left">
        Climate: <b>{$planetModal.data?.climate}</b>
        <br>
        Diameter: <b>{$planetModal.data?.diameter}</b>
        <br>
        Population: <b>{$planetModal.data?.population}</b>
    </div>
</div>
{/if}