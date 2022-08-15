<script>
  export let message;
  export let open;
</script>

<div class="Dialog_box">
  <div class="Container">
    {message}
    <button
      on:click={() => {
        open(false);
      }}>Close</button
    >
  </div>
</div>
