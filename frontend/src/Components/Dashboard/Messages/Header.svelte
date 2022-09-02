<script>
  import "../../../styles/Dashboard/Messages/Header.css";
  export let current_room;
  export let return_room;
</script>

<div class="Header">
  <img
    id="arrow"
    src="/left-arrow.svg"
    alt="left arrow"
    on:click={return_room}
  />
  <img id="room_image" src="/room_image.png" alt="user_image" />
  <div class="Container">{current_room.name}</div>
</div>
