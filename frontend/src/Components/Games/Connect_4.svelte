<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../store";
  import Connection_Box from "./ConnectionBox.svelte";
  import "../../styles/Games/Connect_4.css";

  let winning_array = [
    [(0, 0), (0, 1), (0, 2), (0, 3)],
    [(0, 1), (0, 2), (0, 3), (0, 4)],
    [(0, 2), (0, 3), (0, 4), (0, 5)],
    [(0, 3), (0, 4), (0, 5), (0, 6)],
    [(1, 0), (1, 1), (1, 2), (1, 3)],
    [(1, 1), (1, 2), (1, 3), (1, 4)],
    [(1, 2), (1, 3), (1, 4), (1, 5)],
    [(1, 3), (1, 4), (1, 5), (1, 6)],
    [(2, 0), (2, 1), (2, 2), (2, 3)],
    [(2, 1), (2, 2), (2, 3), (2, 4)],
    [(2, 2), (2, 3), (2, 4), (2, 5)],
    [(2, 3), (2, 4), (2, 5), (2, 6)],
    [(3, 0), (3, 1), (3, 2), (3, 3)],
    [(3, 1), (3, 2), (3, 3), (3, 4)],
    [(3, 2), (3, 3), (3, 4), (3, 5)],
    [(3, 3), (3, 4), (3, 5), (3, 6)],
    [(4, 0), (4, 1), (4, 2), (4, 3)],
    [(4, 1), (4, 2), (4, 3), (4, 4)],
    [(4, 2), (4, 3), (4, 4), (4, 5)],
    [(4, 3), (4, 4), (4, 5), (4, 6)],
    [(5, 0), (5, 1), (5, 2), (5, 3)],
    [(5, 1), (5, 2), (5, 3), (5, 4)],
    [(5, 2), (5, 3), (5, 4), (5, 5)],
    [(5, 3), (5, 4), (5, 5), (5, 6)],
    [(0, 0), (1, 0), (2, 0), (3, 0)],
    [(1, 0), (2, 0), (3, 0), (4, 0)],
    [(2, 0), (3, 0), (4, 0), (5, 0)],
    [(0, 1), (1, 1), (2, 1), (3, 1)],
    [(1, 1), (2, 1), (3, 1), (4, 1)],
    [(2, 1), (3, 1), (4, 1), (5, 1)],
    [(0, 2), (1, 2), (2, 2), (3, 2)],
    [(1, 2), (2, 2), (3, 2), (4, 2)],
    [(2, 2), (3, 2), (4, 2), (5, 2)],
    [(0, 3), (1, 3), (2, 3), (3, 3)],
    [(1, 3), (2, 3), (3, 3), (4, 3)],
    [(2, 3), (3, 3), (4, 3), (5, 3)],
    [(0, 4), (1, 4), (2, 4), (3, 4)],
    [(1, 4), (2, 4), (3, 4), (4, 4)],
    [(2, 4), (3, 4), (4, 4), (5, 4)],
    [(0, 5), (1, 5), (2, 5), (3, 5)],
    [(1, 5), (2, 5), (3, 5), (4, 5)],
    [(2, 5), (3, 5), (4, 5), (5, 5)],
    [(0, 6), (1, 6), (2, 6), (3, 6)],
    [(1, 6), (2, 6), (3, 6), (4, 6)],
    [(2, 6), (3, 6), (4, 6), (5, 6)],
    [(2, 0), (3, 1), (4, 2), (5, 3)],
    [(1, 0), (2, 1), (3, 2), (4, 3)],
    [(2, 1), (3, 2), (4, 3), (5, 4)],
    [(0, 0), (1, 1), (2, 2), (3, 3)],
    [(1, 1), (2, 2), (3, 3), (4, 4)],
    [(2, 2), (3, 3), (4, 4), (5, 5)],
    [(0, 1), (1, 2), (2, 3), (3, 4)],
    [(1, 2), (2, 3), (3, 4), (4, 5)],
    [(2, 3), (3, 4), (4, 5), (5, 6)],
    [(0, 2), (1, 3), (2, 4), (3, 5)],
    [(1, 3), (2, 4), (3, 5), (4, 6)],
    [(0, 3), (1, 4), (2, 5), (3, 6)],
    [(0, 3), (1, 2), (2, 1), (3, 0)],
    [(0, 4), (1, 3), (2, 2), (3, 1)],
    [(1, 3), (2, 2), (3, 1), (4, 0)],
    [(0, 5), (1, 4), (2, 3), (3, 2)],
    [(1, 4), (2, 3), (3, 2), (4, 1)],
    [(2, 3), (3, 2), (4, 1), (5, 0)],
    [(0, 6), (1, 5), (2, 4), (3, 3)],
    [(1, 5), (2, 4), (3, 3), (4, 2)],
    [(2, 4), (3, 3), (4, 2), (5, 1)],
    [(1, 6), (2, 5), (3, 4), (4, 3)],
    [(2, 5), (3, 4), (4, 3), (5, 2)],
    [(2, 6), (3, 5), (4, 4), (5, 3)],
  ];
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let game = {};

  if (socketValue === null) push("/dashboard");
  else {
    socketValue.emit("join", { id: game_id, username: usernameValue });
    socketValue.on("Connect-4 update", (data) => {
      game = data;
      if (game.last_move !== undefined && game.last_move.p !== usernameValue) {
        //update the grid on the front
        let token = document.createElement("div");
        token.classList.add(game[game.last_move.p]);
        document
          .getElementById(game.last_move.x + "-" + game.last_move.y)
          .appendChild(token);
      }
    });
  }

  function checkWinning() {
    for (let i in winning_array) {
      let a = game.board[winning_array[i][0]];
      let b = game.board[winning_array[i][1]];
      let c = game.board[winning_array[i][2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        game.winner = a;
        break;
      }
    }

    let draw = true;
    for (let x = 0; x < 6; x++)
      for (let y = 0; y < 7; y++) if (game.board[x][y] === "") draw = false;
    if (draw) game.winner = undefined;
  }

  function handleClickCase(x, y) {
    if (game.current_player !== usernameValue) return;
    if (game.board[x][y] !== "") return;

    let token = document.createElement("div");
    token.classList.add(game[game.current_player]);
    while (x < 5 && game.board[x + 1][y] === "") x++;
    document.getElementById(x + "-" + y).appendChild(token);
    game.board[x][y] = game[game.current_player];
    game.last_move = { p: game.current_player, x: x, y: y };
    console.log(game.last_move);

    for (const [key, value] of Object.entries(game)) {
      if (game[usernameValue] === "Y" && value === "R")
        game.current_player = key;
      else if (game[usernameValue] === "R" && value === "Y")
        game.current_player = key;
    }

    //checkWinning();
    socketValue.emit("Connect-4 update-client", { id: game_id, game: game });
  }
</script>

<div class="Connect4">
  <Connection_Box />
  <div class="Board">
    {#each { length: 6 } as _, x}
      {#each { length: 7 } as _, y}
        <div
          id={x + "-" + y}
          class="tile"
          on:click={() => handleClickCase(x, y)}
        />
      {/each}
    {/each}
  </div>
  <div class="Information">
    <div class="youAre">
      You are :
      {#if game[usernameValue] === "R"}
        R
      {:else}
        Y
      {/if}
    </div>
    Current player : {game.current_player}
  </div>
</div>
