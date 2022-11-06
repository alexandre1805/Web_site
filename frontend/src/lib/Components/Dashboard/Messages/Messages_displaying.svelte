<script>
  import axios from "axios";
  import { socket, username, currentGame } from "../../../store";
  import { push } from "svelte-spa-router";
  import { afterUpdate } from "svelte";

  let messages = [];
  export let current_room;

  //get all the messages on the first load
  $: if (current_room.name !== "") {
    axios
      .get("http://" + window.location.host + "/api/getMsg", {
        params: { room: current_room.id },
        withCredentials: true,
      })
      .then((res) => {
        messages = res.data.messages;
      });
  }

  //check for update
  if ($socket !== null) {
    $socket.on("Message:New", (elt) => {
      if (elt.room === current_room.id) messages = [...messages, elt];
    });

    $socket.on("Message:Update", (elt) => {
      messages = messages.map((elm) => {
        if (elm !== undefined && elm._id === elt._id) elm = elt;
      });
    });
  }

  afterUpdate(() => {
    let obj = document.getElementById("chat");
    obj.scrollTo(0, obj.scrollHeight);
    if (messages.length !== 0 && !messages.at(-1).read.includes($username))
      $socket.emit("Message:read", {
        username: $username,
        room: current_room.id,
      });
  });

  function handleStartGame(name, id) {
    currentGame.set(id);
    if (name === "Tic-tac-toe") push("/tic-tac-toe");
    else if (name === "Connect 4") push("/connect-4");
    else if (name === "Le président") push("/president");
  }
</script>

<ul id="chat" class="h-full overflow-scroll">
  {#each messages as msg}
    <li
      class={`${msg.user === $username ? "text-right" : "text-left"} px-3 py-3`}
    >
      <div class="header">{msg.user}</div>
      {#if msg.type === "regular"}
        <div
          class={`${
            msg.user === $username ? "text-right bg-blue-500" : "bg-gray-400"
          } p-4 text-white leading-5 inline-block text-left over break-words rounded-lg relative text-lg`}
        >
          {msg.message}
        </div>
      {:else}
        <div
          class={`${
            msg.user === $username ? "text-right bg-blue-500" : "bg-gray-400"
          } p-4 text-white leading-5 inline-block over text-left break-words rounded-lg relative text-lg`}
        >
          <div class="text-lg font-bold uppercase text-left">
            {msg.game}
          </div>
          <div class="text-left">{msg.message}</div>
          {#if msg.state === "Not started"}
            <button
              class="flex text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500 border-2"
              on:click={() => handleStartGame(msg.game, msg.game_id)}
              >Start</button
            >
          {/if}
        </div>
      {/if}
    </li>
  {/each}
</ul>
