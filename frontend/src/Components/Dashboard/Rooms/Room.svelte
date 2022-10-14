<script>
  import axios from "axios";
  import "../../../styles/Dashboard/Room.css";
  import NewRoom from "./New_room.svelte";
  import { socket } from "../../../store";
  import { onMount } from "svelte";

  export let setCurrentRoom;
  export let current_room;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let search = "";
  let rooms = [];
  let openDialogBoxRoom = false;

  onMount(async () => {
    await axios
      .get("http://" + window.location.host + "/api/getRooms", {
        withCredentials: true,
      })
      .then((res) => {
        rooms = res.data.rooms;
      });
  });

  if (socketValue !== null) {
    socketValue.on("new room", (elt) => {
      rooms = [...rooms, elt];
    });
    socketValue.on("new message", (elt) => {
      rooms = rooms.map((room) => {
        if (room.id === elt.room) {
          room.lastMessage = elt.message;
          if (current_room.id !== elt.room) room.unread++;
        }
        return room;
      });
    });
  }

  function handleChangeRoom(room) {
    document.querySelectorAll(".Room li").forEach((element) => {
      element.classList.remove("selected");
    });
    setCurrentRoom(room);
    rooms = rooms.map((elm) => {
      if (room.id === elm.id) elm.unread = 0;
      return elm;
    });
    document.getElementById(room.id).classList.add("selected");
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
      src="/icons-pack/chatbox-ellipses-outline.svg"
      alt="new_room"
      on:click={() => {
        openDialogBoxRoom = true;
      }}
    />
    {#if openDialogBoxRoom}
      <NewRoom setOpenDialogBox={setOpenDialogBoxRoom} />
    {/if}
  </div>
  <ul>
    {#each rooms as room}
      <li
        class="room"
        id={room.id}
        on:click={() => {
          handleChangeRoom(room);
        }}
      >
        <img src="/room_image.png" alt="user_image" />
        <div class="Room_Info">
          <span>{room.name}</span>
          {#if room.lastMessage !== undefined}
            {#if room.lastMessage.length > 20}
              {room.lastMessage.slice(0, 20) + "..."}
            {:else}
              {room.lastMessage}
            {/if}
          {/if}
        </div>
        {#if room.unread !== 0}
          <div class="unread">{room.unread}</div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
