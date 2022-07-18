<script>
  export let handler;
  export let value;
</script>

{#if value === "X"}
  <td on:click={handler}><img src="X.png" alt="X" /></td>
{:else if value === "O"}
  <td on:click={handler}><img src="O.png" alt="O" /></td>
{:else}
  <td on:click={handler} />
{/if}
