<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../../store";
  import "../../../styles/Games/Tic-tac-toe.css";
  import Connection_Box from "../ConnectionBox.svelte";
  import Square from "./Square.svelte";

  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let game = { board: ["", "", "", "", "", "", "", "", ""] };
  game[usernameValue] = "";
  game.current_player = "";
  let connection_dialog_box = true;

  if (socketValue === null) push("/dashboard");
  else {
    socketValue.emit("join", { id: game_id, username: usernameValue });

    socketValue.on("Tic-tac-toe update", (data) => {
      game = data;
    });
  }

  function handleClickCase(id) {
    if (game.current_player != usernameValue) return;
    if (game.board[id] !== "") return;
    game.board[id] = game[usernameValue];

    for (const [key, value] of Object.entries(game)) {
      if (game[usernameValue] === "O" && value === "X")
        game.current_player = key;
      else if (game[usernameValue] === "X" && value === "O")
        game.current_player = key;
    }

    socketValue.emit("Tic-tac-toe update-client", { id: game_id, game: game });
  }
</script>

<div class="Tic-Tac-Toe">
  {#if connection_dialog_box}
    <Connection_Box setOpenDialogBox={(e) => (connection_dialog_box = e)} />
  {/if}
  <div class="Information">
    <div class="youAre">You are : {game[usernameValue]}</div>
    Current player : {game.current_player}
  </div>
  <div class="Board">
    <div>
      <table>
        <tr>
          <Square handler={() => handleClickCase(0)} value={game.board[0]} />
          <Square handler={() => handleClickCase(1)} value={game.board[1]} />
          <Square handler={() => handleClickCase(2)} value={game.board[2]} />
        </tr>
        <tr>
          <Square handler={() => handleClickCase(3)} value={game.board[3]} />
          <Square handler={() => handleClickCase(4)} value={game.board[4]} />
          <Square handler={() => handleClickCase(5)} value={game.board[5]} />
        </tr>
        <tr>
          <Square handler={() => handleClickCase(6)} value={game.board[6]} />
          <Square handler={() => handleClickCase(7)} value={game.board[7]} />
          <Square handler={() => handleClickCase(8)} value={game.board[8]} />
        </tr>
      </table>
    </div>
  </div>
</div>
