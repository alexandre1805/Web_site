<script lang="ts">
  export let message: String;
  export let open : Function;
</script>

<div class="Dialog_box">
  <div class="Container">
    {message}
    <button
      class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
      on:click={() => {
        open(false);
      }}>Close</button
    >
  </div>
</div>
