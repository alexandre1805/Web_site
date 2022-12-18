<script lang="ts">
  import Arrow from '../../../../assets/icons-pack/chevron-forward-outline.svg'
  export let userInformation: [string, number][]
  export let currrentPlayer: string
</script>

<div
  class="absolute top-4 left-8 flex flex-col border-4 rounded p-4 text-white text-xl"
>
  {#each userInformation as [user, length]}
    {#if user === currrentPlayer}
      <div class="flex items-center">
        <img src={Arrow} alt="arrow" class="h-5" /><span>{user} : {length}</span>
      </div>
    {:else}
      <span>{user} : {length}</span>
    {/if}
  {/each}
</div>
