<script>
  import Room from "./Rooms/Room.svelte";
  import Messages from "./Messages/Messages.svelte";
  import "../../styles/Dashboard/Dashboard.css";
  let current_room = { name: "" };
  function setCurrentRoom(room) {
    current_room = room;
    document.getElementById("room_container").classList.add("hide");
    document.getElementById("message_container").classList.remove("hide");
  }

  function return_room() {
    document.getElementById("room_container").classList.remove("hide");
    document.getElementById("message_container").classList.add("hide");
  }
</script>

<div class="Dashboard">
  <div id="room_container"><Room {setCurrentRoom} {current_room} /></div>
  <div id="message_container" class="hide">
    <Messages {current_room} {return_room} />
  </div>
</div>
