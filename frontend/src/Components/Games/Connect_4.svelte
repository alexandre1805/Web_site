<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../store";
  import Connection_Box from "./ConnectionBox.svelte";
  import "../../styles/Games/Connect_4.css";

  let winning_array = [
    [0, 1, 2, 3],
    [41, 40, 39, 38],
    [7, 8, 9, 10],
    [34, 33, 32, 31],
    [14, 15, 16, 17],
    [27, 26, 25, 24],
    [21, 22, 23, 24],
    [20, 19, 18, 17],
    [28, 29, 30, 31],
    [13, 12, 11, 10],
    [35, 36, 37, 38],
    [6, 5, 4, 3],
    [0, 7, 14, 21],
    [41, 34, 27, 20],
    [1, 8, 15, 22],
    [40, 33, 26, 19],
    [2, 9, 16, 23],
    [39, 32, 25, 18],
    [3, 10, 17, 24],
    [38, 31, 24, 17],
    [4, 11, 18, 25],
    [37, 30, 23, 16],
    [5, 12, 19, 26],
    [36, 29, 22, 15],
    [6, 13, 20, 27],
    [35, 28, 21, 14],
    [0, 8, 16, 24],
    [41, 33, 25, 17],
    [7, 15, 23, 31],
    [34, 26, 18, 10],
    [14, 22, 30, 38],
    [27, 19, 11, 3],
    [35, 29, 23, 17],
    [6, 12, 18, 24],
    [28, 22, 16, 10],
    [13, 19, 25, 31],
    [21, 15, 9, 3],
    [20, 26, 32, 38],
    [36, 30, 24, 18],
    [5, 11, 17, 23],
    [37, 31, 25, 19],
    [4, 10, 16, 22],
    [2, 10, 18, 26],
    [39, 31, 23, 15],
    [1, 9, 17, 25],
    [40, 32, 24, 16],
    [9, 7, 25, 33],
    [8, 16, 24, 32],
    [11, 7, 23, 29],
    [12, 18, 24, 30],
    [1, 2, 3, 4],
    [5, 4, 3, 2],
    [8, 9, 10, 11],
    [12, 11, 10, 9],
    [15, 16, 17, 18],
    [19, 18, 17, 16],
    [22, 23, 24, 25],
    [26, 25, 24, 23],
    [29, 30, 31, 32],
    [33, 32, 31, 30],
    [36, 37, 38, 39],
    [40, 39, 38, 37],
    [7, 14, 21, 28],
    [8, 15, 22, 29],
    [9, 16, 23, 30],
    [10, 17, 24, 31],
    [11, 18, 25, 32],
    [12, 19, 26, 33],
    [13, 20, 27, 34],
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
      console.log(game);
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
