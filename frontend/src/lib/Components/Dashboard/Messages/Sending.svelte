<script>
  import "emoji-picker-element/svelte";
  import gamesLogo from "../../../../assets/icons-pack/game-controller-outline.svg";
  import emojiLogo from "../../../../assets/icons-pack/happy-outline.svg";
  import sendLogo from "../../../../assets/icons-pack/send.svg";
  import axios from "axios";
  import { socket, username } from "../../../store";
  import { onMount } from "svelte";

  export let current_room;
  let gamesOpen = false;
  let games = [];
  let current_message = "";

  $: if (current_room.name !== "") {
    axios
      .get("http://" + window.location.host + "/api/getGames", {
        withCredentials: true,
      })
      .then((res) => {
        games = res.data.games;
      });
  }
  onMount(() => {
    document.querySelector("#emoji-container").addEventListener(
      "emoji-click",
      // @ts-ignore
      (event) => (current_message += event.detail.unicode)
    );

    document.querySelector("#sending_input").addEventListener("keyup", (e) => {
      // @ts-ignore
      if (e.key === "Enter") {
        handleSubmitMessage();
      }
    });
  });
  function openEmoji() {
    const emoji_container = document.querySelector("#emoji-container");
    emoji_container.classList.toggle("hidden");
  }
  function handleSubmitMessage() {
    if (current_message === "" || current_room.name === "") return;
    $socket.emit("message", {
      type: "regular",
      user: $username,
      message: current_message,
      room: current_room.id,
    });
    current_message = "";

    const emoji_container = document.querySelector("#emoji-container");
    emoji_container.classList.add("hidden");
    gamesOpen = false;
  }
  function handleCreateGame(game_name) {
    if (current_room.name === "") return;
    $socket.emit("message", {
      type: "game",
      user: $username,
      message: $username + " want to start a game : ",
      room: current_room.id,
      game: game_name,
      state: "Not started",
    });
    gamesOpen = false;
  }
</script>

<div class="relative w-[95%] h-16 m-3 flex p-1 rounded-md bg-white">
  {#if gamesOpen}
    <div
      class="absolute w-[200px] h-[400px] rounded-lg bottom-16 bg-white border-2 border-black"
    >
      {#each games as game}
        <div
          class="flex justify-center p-5 border-b-2 hover:bg-slate-400"
          on:click={() => {
            handleCreateGame(game.name);
          }}
          aria-hidden="true"
        >
          {game.name}
        </div>
      {/each}
    </div>
  {/if}
  <button
    class="flex justify-center items-center mx-2"
    on:click={() => {
      gamesOpen = !gamesOpen;
    }}
    ><img src={gamesLogo} alt="games" class="h-12" />
  </button>

  <input
    type="text"
    id="sending_input"
    class="w-full focus:outline-none"
    placeholder="New message..."
    bind:value={current_message}
  />
  <button on:click={openEmoji} class="flex justify-center items-center"
    ><img src={emojiLogo} alt="emojis" class="h-12" /></button
  >

  <div id="emoji-container" class="hidden right-5 bottom-16 absolute">
    <emoji-picker class="light" />
  </div>
  <button
    class="border-l-2 pl-2 border-gray-400 flex justify-center items-center"
    on:click={(e) => {
      e.preventDefault();
      handleSubmitMessage();
    }}><img src={sendLogo} alt="send_button" class="h-12" /></button
  >
</div>
