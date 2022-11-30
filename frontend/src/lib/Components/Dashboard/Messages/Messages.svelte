<script lang="ts">
  import Header from "./Header.svelte";
  import MessagesDisplaying from "./Messages_displaying.svelte";
  import Sending from "./Sending.svelte";
  import Log_Box from "../Log_Box.svelte";
  import { socket } from "../../../store";
  import type { RoomType } from "../../../types"

  export let current_room: RoomType;
  export let return_room: Function;
  let errorBox = false;
  let errorMsg = "";

  $socket.on("Message:Error", (elt: string) => {
    errorBox = true;
    errorMsg = elt;
  });

  function setOpenErrorBox(val: boolean) {
    errorBox = val;
  }
</script>

<div class="h-full float-right w-full flex flex-col bg-slate-200">
  {#if errorBox}
    <Log_Box message={errorMsg} open={setOpenErrorBox} />
  {/if}
  {#if current_room.name !== ""}
    <Header {current_room} {return_room} />
    <MessagesDisplaying {current_room} />
    <Sending {current_room} />
  {/if}
</div>
