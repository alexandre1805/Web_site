<script>
  import axios from "axios";
  import "../../styles/Dashboard/Room.css";
  import NewFriend from "./New_friend.svelte";
  import NewRoom from "./New_room.svelte";
  import { socket } from "../../store";

  export let setCurrentRoom;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let search = "";
  let rooms = [];
  let openDialogBoxFriend = false;
  let openDialogBoxRoom = false;

  axios
    .get(
      "http://" + process.env.URI + ":" + process.env.API_PORT + "/getRooms",
      { withCredentials: true }
    )
    .then((res) => {
      const Rooms = res.data.rooms;
      rooms = Rooms;
      if (rooms.length !== 0) setCurrentRoom(rooms[0]);
    });

  if (socketValue !== null)
    socketValue.on("new room", (elt) => {
      console.log("socket recevied");
      rooms = [...rooms, elt];
    });

  function handleChangeRoom(e) {
    let name = e.target.innerText;
    let tab = rooms.filter((elt) => elt.name === name);
    console.log(tab);
    setCurrentRoom(tab[0]);
  }

  function setOpenDialogBoxFriend(val) {
    openDialogBoxFriend = val;
  }

  function setOpenDialogBoxRoom(val) {
    openDialogBoxRoom = val;
  }
</script>

<div class="Room">
  <div class="Search">
    <input
      value={search}
      on:change={(e) => {
        search = e.target.value;
      }}
      class="SearchBar"
      placeholder="Search..."
    />
    <img
      src="/message.png"
      alt="plus"
      on:click={() => {
        if (!openDialogBoxRoom) openDialogBoxRoom = true;
      }}
    />
    <img
      src="/plus.png"
      alt="plus"
      on:click={() => {
        if (!openDialogBoxFriend) openDialogBoxFriend = true;
      }}
    />
    {#if openDialogBoxFriend}
      <NewFriend setOpenDialogBox={setOpenDialogBoxFriend} />
    {/if}

    {#if openDialogBoxRoom}
      <NewRoom setOpenDialogBox={setOpenDialogBoxRoom} />
    {/if}
  </div>
  <ul>
    {#each rooms as room}
      <li class="room" key={room._id} on:click={handleChangeRoom}>
        <img src="/room_image.png" alt="user_image" />
        <span>{room.name}</span>
      </li>
    {/each}
  </ul>
</div>
