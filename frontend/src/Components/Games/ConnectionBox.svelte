<script>
  import { push } from "svelte-spa-router";
  import "../../styles/Games/Connection_Box.css";
  import { socket, currentGame, username } from "../../store";
  export let setOpenDialogBox;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let message = "Waiting for informations...";

  socketValue.on("Satus update", (msg) => {
    if (msg !== "") {
      setOpenDialogBox(true);
      message = msg;
    } else setOpenDialogBox(false);
  });

  function handleLeaveGame() {
    socketValue.emit("leave", {
      id: game_id,
      username: usernameValue,
    });
    push("/dashboard");
  }
</script>

<div class="Dialog_box">
  <div class="Container">
    {message}
    <button on:click={handleLeaveGame}>Leave</button>
  </div>
</div>
