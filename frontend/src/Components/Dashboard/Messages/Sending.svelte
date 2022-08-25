<script>
  import "emoji-picker-element/svelte";
  import axios from "axios";
  import { socket, username } from "../../../store";
  import "../../../styles/Dashboard/Messages/Sending.css";
  import { afterUpdate } from "svelte";

  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  export let current_room;
  let gamesOpen = false;
  let emojisOpen = false;
  let emojievent = false;
  let games = [];
  let current_message = "";

  $: if (current_room !== "") {
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getGames",
        { withCredentials: true }
      )
      .then((res) => {
        games = res.data.games;
      });
  }
  afterUpdate(() => {
    if (!emojievent && emojisOpen) {
      document
        .querySelector("emoji-picker")
        .addEventListener(
          "emoji-click",
          (event) => (current_message += event.detail.unicode)
        );
      emojievent = true;
    }
  });

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
</script>

<div class="sending">
  {#if gamesOpen}
    <div class="Games">
      {#each games as game}
        <div class="Game" on:click={handleCreateGame}>{game.name}</div>
      {/each}
    </div>
  {/if}
  <img
    src="/games.svg"
    alt="games"
    style="margin-right: 20px;"
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
    src="/emojis.svg"
    alt="emojis"
    on:click={() => {
      emojisOpen = !emojisOpen;
    }}
  />
  {#if emojisOpen}
    <div class="emoji-container">
      <emoji-picker class="light" />
    </div>
  {/if}
  <div class="border">
    <img
      src="/send_button.svg"
      on:click={handleSubmitMessage}
      alt="send_button"
      style="margin: 15px;"
    />
  </div>
</div>
