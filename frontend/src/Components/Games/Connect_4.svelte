<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../store";
  import Connection_Box from "./ConnectionBox.svelte";
  import "../../styles/Games/Connect_4.css";

  let winning_array = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    [
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ],
    [
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
    [
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
    ],
    [
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
    ],
    [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    [
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ],
    [
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
    ],
    [
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
    [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ],
    [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    [
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ],
    [
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 6],
    ],
    [
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
    ],
    [
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
    ],
    [
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
    [
      [5, 3],
      [5, 4],
      [5, 5],
      [5, 6],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    [
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
    [
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
    ],
    [
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
    ],
    [
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ],
    [
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
    ],
    [
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
    ],
    [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
    [
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
    ],
    [
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
    ],
    [
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
    ],
    [
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
    ],
    [
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
    ],
    [
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
    ],
    [
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
    ],
    [
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 6],
    ],
    [
      [2, 0],
      [3, 1],
      [4, 2],
      [5, 3],
    ],
    [
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 3],
    ],
    [
      [2, 1],
      [3, 2],
      [4, 3],
      [5, 4],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ],
    [
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    [
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
    [
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ],
    [
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 6],
    ],
    [
      [0, 3],
      [1, 4],
      [2, 5],
      [3, 6],
    ],
    [
      [0, 3],
      [1, 2],
      [2, 1],
      [3, 0],
    ],
    [
      [0, 4],
      [1, 3],
      [2, 2],
      [3, 1],
    ],
    [
      [1, 3],
      [2, 2],
      [3, 1],
      [4, 0],
    ],
    [
      [0, 5],
      [1, 4],
      [2, 3],
      [3, 2],
    ],
    [
      [1, 4],
      [2, 3],
      [3, 2],
      [4, 1],
    ],
    [
      [2, 3],
      [3, 2],
      [4, 1],
      [5, 0],
    ],
    [
      [0, 6],
      [1, 5],
      [2, 4],
      [3, 3],
    ],
    [
      [1, 5],
      [2, 4],
      [3, 3],
      [4, 2],
    ],
    [
      [2, 4],
      [3, 3],
      [4, 2],
      [5, 1],
    ],
    [
      [1, 6],
      [2, 5],
      [3, 4],
      [4, 3],
    ],
    [
      [2, 5],
      [3, 4],
      [4, 3],
      [5, 2],
    ],
    [
      [2, 6],
      [3, 5],
      [4, 4],
      [5, 3],
    ],
  ];

  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let game = {};

  if ($socket === null) push("/dashboard");
  else {
    $socket.emit("join", { id: game_id, username: usernameValue });
    $socket.on("Connect-4 update", (data) => {
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
      let [x1, y1] = winning_array[i][0];
      let [x2, y2] = winning_array[i][1];
      let [x3, y3] = winning_array[i][2];
      let [x4, y4] = winning_array[i][3];
      let a = game.board[x1][y1];
      let b = game.board[x2][y2];
      let c = game.board[x3][y3];
      let d = game.board[x4][y4];

      if (a === "" || b === "" || c === "" || d === "") {
        continue;
      }
      if (a === b && b === c && c === d) {
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

    checkWinning();
    $socket.emit("Connect-4 update-client", { id: game_id, game: game });
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
          aria-hidden="true"
        />
      {/each}
    {/each}
  </div>
  <div class="Information">
    <div class="youAre">
      You are :
      {#if game[usernameValue] === "R"}
        <span class="red_dot" />
      {:else}
        <span class="yellow_dot" />
      {/if}
    </div>
    Current player : {game.current_player === undefined
      ? ""
      : game.current_player}
  </div>
</div>
