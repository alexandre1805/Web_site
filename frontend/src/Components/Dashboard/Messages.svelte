<script>
  import axios from "axios";
  import { socket, username } from "../../store";
  import "../../styles/Dashboard/Messages.css";

  let messages = [];
  let current_message = "";
  export let current_room;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let gamesOpen = false;
  let games = [];

  $: if (current_room !== "") {
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getMsg",
        { params: { room: current_room._id } },
        { withCredentials: true }
      )
      .then((res) => {
        messages = res.data.messages;
      });
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getGames",
        { withCredentials: true }
      )
      .then((res) => {
        games = res.data.games;
      });
  }

  if (socketValue !== null)
    socketValue.on("new message", (elt) => {
      if (elt.room === current_room._id) messages = [...messages, elt];
    });

  function handleSubmitMessage(e) {
    e.preventDefault();
    if (current_message === "" || current_room.name === "") return;
    socketValue.emit("message", {
      client: usernameValue,
      msg: current_message,
      room: current_room._id,
    });
    current_message = "";
  }
</script>

<div class="Message">
  <div class="Header">
    <img src="/room_image.png" alt="user_image" />
    <div class="Container">{current_room.name}</div>
  </div>
  <ul class="chat">
    {#each messages as msg}
      <li
        class={`msg ${msg.user === usernameValue ? "me" : "other"}`}
        key={msg._id}
      >
        <div class="header">{msg.user}</div>
        <div class="content">{msg.message}</div>
      </li>
    {/each}
  </ul>
  <div class="sending">
    {#if gamesOpen}
      <div class="Games">
        {#each games as game}
          <div class="Game">{game.name}</div>
        {/each}
      </div>
    {/if}
    <img
      src="/games.png"
      alt="games"
      on:click={() => {
        gamesOpen = !gamesOpen;
      }}
    />
    <input
      type="text"
      placeholder="New message..."
      value={current_message}
      on:change={(e) => {
        current_message = e.target.value;
      }}
    />
    <img
      src="/send_button.png"
      on:click={handleSubmitMessage}
      alt="send_button"
    />
  </div>
</div>
