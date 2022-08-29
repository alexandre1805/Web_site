<script>
  import Room from "./Rooms/Room.svelte";
  import Messages from "./Messages/Messages.svelte";
  import "../../styles/Dashboard/Dashboard.css";
  let current_room = { name: "" };
  function setCurrentRoom(room) {
    current_room = room;
  }
</script>

<div class="Dashboard">
  <Room {setCurrentRoom} {current_room} />
  <Messages {current_room} />
</div>
