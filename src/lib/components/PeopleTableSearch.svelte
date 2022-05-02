<script lang="ts">
import { people } from "$lib/stores";

let inputValue: string;
$: if (inputValue !== undefined) {
    people.findPeopleByName(inputValue);
}
</script>

<div class="flex flex-col gap-2 items-center">
    <label for="name" class="w-fit font-semibold text-3xl flex-centered gap-2 pl-4">
        Search by name
    </label>
    <div class="relative w-full sm:w-fit">
        <input 
            id="name" 
            type="text"
            class="pl-12 pr-4 py-2 border-2 rounded-2xl w-full sm:w-[500px] bg-transparent font-semibold
                   focus:outline-none focus:ring-[3px] focus:ring-[#EEDB00] focus:border-transparent"
                   autocomplete="off"
            bind:value={inputValue}>
        <img src="/search-icon.svg" alt="Search icon" class="absolute left-4 top-0 bottom-0 m-auto h-6 w-6">
    </div>
</div>