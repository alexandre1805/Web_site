<script>
  import "emoji-picker-element/svelte";
  import axios from "axios";
  import { socket, username } from "../../../store";
  import "../../../styles/Dashboard/Messages/Sending.css";
  import { onMount } from "svelte";

  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  export let current_room;
  let gamesOpen = false;
  let games = [];
  let current_message = "";

  $: if (current_room !== "") {
    axios
      .get("http://" + window.location.host + "/api/getGames", {
        withCredentials: true,
      })
      .then((res) => {
        games = res.data.games;
      });
  }
  onMount(() => {
    document
      .querySelector("emoji-picker")
      .addEventListener(
        "emoji-click",
        (event) => (current_message += event.detail.unicode)
      );

    let input = document.querySelector(".sending input");
    input.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        handleSubmitMessage();
      }
    });
  });
  function openEmoji() {
    const emoji_container = document.querySelector(".emoji-container");
    emoji_container.classList.toggle("shown");
  }
  function handleSubmitMessage() {
    if (current_message === "" || current_room.name === "") return;
    socketValue.emit("message", {
      type: "regular",
      user: usernameValue,
      message: current_message,
      room: current_room.id,
    });
    current_message = "";

    const emoji_container = document.querySelector(".emoji-container");
    if (emoji_container.classList.contains("shown"))
      emoji_container.classList.remove("shown");
    gamesOpen = false;
  }
  function handleCreateGame(game_name) {
    if (current_room.name === "") return;
    socketValue.emit("message", {
      type: "game",
      user: usernameValue,
      message: usernameValue + " want to start a game : ",
      room: current_room.id,
      game: game_name,
      state: "Not started",
    });
    gamesOpen = false;
  }
</script>

<div class="sending">
  {#if gamesOpen}
    <div class="Games">
      {#each games as game}
        <div
          class="Game"
          on:click={() => {
            handleCreateGame(game.name);
          }}
        >
          {game.name}
        </div>
      {/each}
    </div>
  {/if}
  <img
    src="/games.svg"
    alt="games"
    style="margin-right: 20px;"
    class="hide"
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
    style="margin-right: 6px;"
    on:click={openEmoji}
  />
  <div class="emoji-container">
    <emoji-picker class="light" />
  </div>
  <div class="border">
    <img
      src="/send_button.svg"
      on:click={(e) => {
        e.preventDefault();
        handleSubmitMessage();
      }}
      alt="send_button"
      style="margin-left: 6px;"
    />
  </div>
</div>
