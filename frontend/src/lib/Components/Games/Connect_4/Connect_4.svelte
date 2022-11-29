<script lang="ts">
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../../store";
  import Connection_Box from "../ConnectionBox.svelte";
  import winning_array from "./winning_array.json";

  let game_id;
  currentGame.subscribe((val) => (game_id = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let game = {};

  if ($socket === null) push("/dashboard");
  else {
    $socket.emit("GameConnection:join", { id: game_id, username: usernameValue });
    $socket.on("Connect-4:Update", (data) => {
      game = data;
      if (game.last_move !== undefined && game.last_move.p !== usernameValue) {
        if (game[game.last_move.p] === "R")
          document
            .getElementById(game.last_move.x + "-" + game.last_move.y)
            .classList.replace("bg-blue-900", "bg-red-500");
        else
          document
            .getElementById(game.last_move.x + "-" + game.last_move.y)
            .classList.replace("bg-blue-900", "bg-yellow-500");
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
    while (x < 5 && game.board[x + 1][y] === "") x++;
    if (game[game.current_player] === "R")
      document.getElementById(x + "-" + y).classList.replace("bg-blue-900", "bg-red-500");
    else document.getElementById(x + "-" + y).classList.replace("bg-blue-900", "bg-yellow-500");
    game.board[x][y] = game[game.current_player];
    game.last_move = { p: game.current_player, x: x, y: y };

    for (const [key, value] of Object.entries(game)) {
      if (game[usernameValue] === "Y" && value === "R")
        game.current_player = key;
      else if (game[usernameValue] === "R" && value === "Y")
        game.current_player = key;
    }

    checkWinning();
    $socket.emit("Connect-4:UpdateClient", { id: game_id, game: game });
  }
</script>

<div
  class="bg-cyan-800 flex flex-col justify-center items-center h-full w-full md:flex-row"
>
  <Connection_Box />
  <table
    class="h-[70vw] w-[calc(70vw_+_(70vw_/_6))] bg-blue-700 border-separate border-spacing-1 md:h-[40vw] md:w-[calc(40vw_+_(40vw_/_6))]"
  >
    {#each { length: 6 } as _, x}
      <tr>
        {#each { length: 7 } as _, y}
          <td
            id={x + "-" + y}
            class=" bg-blue-900 rounded-full m-2"
            on:click={() => handleClickCase(x, y)}
            aria-hidden="true"
          />
        {/each}
      </tr>
    {/each}
  </table>
  <div
    class="text-black text-lg font-bold flex p-3 md:border-l-2 md:border-b-2 md:border-t-2 md:border-black md:bg-white rounded-md flex-col w-64"
  >
    <div class="youAre">
      You are :
      {#if game[usernameValue] === "R"}
        <span class="h-8 w-8 bg-red-500 rounded-full inline-block" />
      {:else}
        <span class="h-8 w-8 bg-yellow-500 rounded-full inline-block" />
      {/if}
    </div>
    Current player : {game.current_player === undefined
      ? ""
      : game.current_player}
  </div>
</div>
