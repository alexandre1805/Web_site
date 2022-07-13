<script>
  import Room from "./Dashboard/Room.svelte";
  import Messages from "./Dashboard/Messages.svelte";
  import "../styles/Dashboard/Dashboard.css";
  let current_room = { name: "" };
  function setCurrentRoom(room) {
    current_room = room;
  }
</script>

<div class="Dashboard">
  <Room {setCurrentRoom} />
  <Messages {current_room} />
</div>
