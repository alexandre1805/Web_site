<script>
  import axios from "axios";
  import { socket, username, currentGame } from "../../store";
  import "../../styles/Dashboard/Messages.css";
  import { push } from "svelte-spa-router";
  import Log_Box from "./Log_Box.svelte";
  let messages = [];
  let current_message = "";
  export let current_room;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let gamesOpen = false;
  let games = [];
  let errorBox = false;
  let errorMsg = "";

  function setOpenErrorBox(val) {
    errorBox = val;
  }

  $: if (current_room !== "") {
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getMsg",
        { params: { room: current_room._id }, withCredentials: true }
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

  if (socketValue !== null) {
    socketValue.on("new message", (elt) => {
      if (elt.room === current_room._id) messages = [...messages, elt];
    });

    socketValue.on("update message", (elt) => {
      messages = messages.map((elm) => {
        if (elm !== undefined && elm.id === elt.id) elm = elt;
      });
    });
    socketValue.on("error message", (elt) => {
      errorBox = true;
      errorMsg = elt;
    });
  }

  function handleSubmitMessage(e) {
    e.preventDefault();
    if (current_message === "" || current_room.name === "") return;
    socketValue.emit("message", {
      type: "regular",
      user: usernameValue,
      message: current_message,
      room: current_room._id,
    });
    current_message = "";
  }
  function handleCreateGame(e) {
    socketValue.emit("message", {
      type: "game",
      user: usernameValue,
      message: usernameValue + " want to start a game : ",
      room: current_room._id,
      game: e.target.innerText,
      state: "Not started",
    });
    gamesOpen = false;
  }

  function handleStartGame(name, id) {
    currentGame.set(id);
    if (name === "Tic-tac-toe") push("/tic-tac-toe");
    else if (name === "Connect 4") push("/connect-4");
  }
</script>

<div class="Message">
  {#if errorBox}
    <Log_Box message={errorMsg} open={setOpenErrorBox} />
  {/if}
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
        {#if msg.type === "regular"}
          <div class="content">{msg.message}</div>
        {:else}
          <div class="content">
            <div class="name">
              {msg.game}
            </div>
            <div class="intro">{msg.message}</div>
            {#if msg.state === "Not started"}
              <button on:click={() => handleStartGame(msg.game, msg.game_id)}
                >Start</button
              >
            {/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
  <div class="sending">
    {#if gamesOpen}
      <div class="Games">
        {#each games as game}
          <div class="Game" on:click={handleCreateGame}>{game.name}</div>
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
