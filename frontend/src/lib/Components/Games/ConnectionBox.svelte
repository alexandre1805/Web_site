<script>
  import { push } from "svelte-spa-router";
  import "../../../styles/Games/Connection_Box.css";
  import { socket, currentGame, username } from "../../store";
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let message = "Waiting for informations...";
  let open = true;

  $socket.on("Status update", (msg) => {
    if (msg !== "") {
      open = true;
      message = msg;
    } else {
      open = false;
      message = "Waiting for informations...";
    }
  });

  function handleLeaveGame() {
    $socket.emit("leave", {
      id: game_id,
      username: usernameValue,
    });
    currentGame.set("");
    push("/dashboard");
  }
</script>

<div class="Connection_Box">
  {#if open}
    <div class="Dialog_box">
      <div class="Container">
        {message}
        <button
          on:click={handleLeaveGame}
          class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
          >Leave</button
        >
      </div>
    </div>
  {/if}
</div>
