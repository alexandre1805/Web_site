<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../store";
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let message = "Waiting for informations...";
  let open = true;

  $socket.on("GameConnection:update", (obj) => {
    if (obj.state !== 'Running') {
      open = true;
      message = obj.message;
    } else {
      open = false;
      message = "Waiting for informations...";
    }
  });

  function handleLeaveGame() {
    $socket.emit("GameConnection:leave", {
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
