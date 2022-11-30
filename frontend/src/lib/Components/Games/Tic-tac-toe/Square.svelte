<script lang="ts">
  export let handler: Function;
  export let value: string;
  import X from "../../../../assets/Tic-Tac-Toe/X.png";
  import O from "../../../../assets/Tic-Tac-Toe/O.png";
</script>

{#if value === "X"}
  <td
    on:click={(e) => handler(e)}
    class="border-8 border-white w-1/3 h-1/3"
    aria-hidden="true"><img src={X} alt="X" class="h-full w-full" /></td
  >
{:else if value === "O"}
  <td
    on:click={(e) => handler(e)}
    class="border-8 border-white w-1/3 h-1/3"
    aria-hidden="true"><img src={O} alt="O" class="h-full w-full" /></td
  >
{:else}
  <td
    on:click={(e) => handler(e)}
    class="border-8 border-white w-1/3 h-1/3"
    aria-hidden="true"
  />
{/if}
