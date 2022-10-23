<script>
  import { push } from "svelte-spa-router";
  import "../../../styles/Games/Connection_Box.css";
  import { socket, currentGame, username } from "../../store";
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let message = "Waiting for informations...";
  let open = true;

  socketValue.on("Status update", (msg) => {
    if (msg !== "") {
      open = true;
      message = msg;
    } else {
      open = false;
      message = "Waiting for informations...";
    }
  });

  function handleLeaveGame() {
    socketValue.emit("leave", {
      id: game_id,
      username: usernameValue,
    });
    push("/dashboard");
  }
</script>

<div class="Connection_Box">
  {#if open}
    <div class="Dialog_box">
      <div class="Container">
        {message}
        <button on:click={handleLeaveGame}>Leave</button>
      </div>
    </div>
  {/if}
</div>
