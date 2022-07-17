<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../store";
  import "../../styles/Games/Tic-tac-toe.css";
  import Connection_Box from "./ConnectionBox.svelte";

  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let game;
  let connection_dialog_box = true;
  if (socketValue === null) push("/dashboard");
  else {
    socketValue.emit("join", { id: game_id, username: usernameValue });
    socketValue.on("update", (arg) => {});
  }
</script>

<div class="Tic-Tac-Toe">
  {#if connection_dialog_box}
    <Connection_Box setOpenDialogBox={(e) => (connection_dialog_box = e)} />
  {/if}
  Waiting for other players ... You are : Current player :
  <div class="Board">
    <div>
      <table>
        <tr>
          <td><a href="" /></td>
          <td><a href="" /></td>
          <td><a href="" /></td>
        </tr>
        <tr>
          <td><a href="" /></td>
          <td><a href="" /></td>
          <td><a href="" /></td>
        </tr>
        <tr>
          <td><a href="" /></td>
          <td><a href="" /></td>
          <td><a href="" /></td>
        </tr>
      </table>
    </div>
  </div>
</div>
