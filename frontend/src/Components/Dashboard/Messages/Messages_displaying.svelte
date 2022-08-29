<script>
  import axios from "axios";
  import "../../../styles/Dashboard/Messages/Messages_displaying.css";
  import { socket, username, currentGame } from "../../../store";
  import { push } from "svelte-spa-router";
  import { afterUpdate } from "svelte";

  let messages = [];
  export let current_room;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));

  //get all the messages on the first load
  $: if (current_room !== "") {
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getMsg",
        { params: { room: current_room.id }, withCredentials: true }
      )
      .then((res) => {
        messages = res.data.messages;
      });
  }

  //check for update
  if (socketValue !== null) {
    socketValue.on("new message", (elt) => {
      if (elt.room === current_room.id) messages = [...messages, elt];
    });

    socketValue.on("update message", (elt) => {
      messages = messages.map((elm) => {
        if (elm !== undefined && elm.id === elt.id) elm = elt;
      });
    });
  }

  afterUpdate(() => {
    let obj = document.getElementById("chat");
    obj.scrollTo(0, obj.scrollHeight);
    if (messages.length !== 0 && !messages.at(-1).read.includes(usernameValue))
      socketValue.emit("read", {
        username: usernameValue,
        room: current_room.id,
      });
  });

  function handleStartGame(name, id) {
    currentGame.set(id);
    if (name === "Tic-tac-toe") push("/tic-tac-toe");
    else if (name === "Connect 4") push("/connect-4");
  }
</script>

<ul id="chat" class="chat">
  {#each messages as msg}
    <li
      class={`msg ${msg.user === usernameValue ? "me" : "other"}`}
      key={msg.id}
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
