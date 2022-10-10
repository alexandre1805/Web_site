<script>
  import "../../../styles/Dashboard/Messages/Messages.css";
  import Header from "./Header.svelte";
  import MessagesDisplaying from "./Messages_displaying.svelte";
  import Sending from "./Sending.svelte";
  import Log_Box from "../Log_Box.svelte";
  import { socket } from "../../../store";

  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  export let current_room;
  export let return_room;
  let errorBox = false;
  let errorMsg = "";

  socketValue.on("error message", (elt) => {
    errorBox = true;
    errorMsg = elt;
  });

  function setOpenErrorBox(val) {
    errorBox = val;
  }
</script>

<div class="Message">
  {#if errorBox}
    <Log_Box message={errorMsg} open={setOpenErrorBox} />
  {/if}
  {#if current_room.name !== ""}
    <Header {current_room} {return_room} />
  {/if}
  <MessagesDisplaying {current_room} />
  {#if current_room.name !== ""}
    <Sending {current_room} />
  {/if}
</div>
