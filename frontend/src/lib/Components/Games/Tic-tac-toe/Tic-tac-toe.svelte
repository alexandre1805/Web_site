<script>
  import { push } from "svelte-spa-router";
  import { socket, currentGame, username } from "../../../store";
  import Connection_Box from "../ConnectionBox.svelte";
  import Square from "./Square.svelte";
  import X from "../../../../assets/Tic-Tac-Toe/X.png";
  import O from "../../../../assets/Tic-Tac-Toe/O.png";

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  let game = { board: ['', '', '', '', '', '', '', '', ''] }
  game[$username] = ''
  game.current_player = ''
  game.winner = null

  if ($socket === null) push('/dashboard')
  else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('Tic-tac-toe:Update', (data) => {
      game = data
    })
  }

  function handleClickCase(id) {
    if (game.current_player != $username) return
    if (game.board[id] !== '') return
    game.board[id] = game[$username]

    if (game[game.current_player] === 'X') game.current_player = game['Y']
    else game.current_player = game['X']

    //check win conditions
    for (let i in winningConditions) {
      let a = game.board[winningConditions[i][0]]
      let b = game.board[winningConditions[i][1]]
      let c = game.board[winningConditions[i][2]]
      if (a === '' || b === '' || c === '') {
        continue
      }
      if (a === b && b === c) {
        game.winner = a
        break
      }
    }

    let draw = true
    for (let index in game.board) {
      if (game.board[index] === '') draw = false
    }
    if (draw) game.winner = undefined

    $socket.emit('Tic-tac-toe:Update-client', { id: $currentGame, game: game })
  }
</script>

<div
  class="w-full h-full flex items-center justify-center bg-cyan-800 flex-col md:flex-row"
>
  <Connection_Box />
  <div class="p-5 flex justify-center items-center m-auto">
    <table class="border-collapse w-[70vw] h-[70vw] max-h-[448px] max-w-md">
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

  <div
    class="text-black text-lg font-bold flex p-3 md:border-l-2 md:border-b-2 md:border-t-2 md:border-black md:bg-white rounded-md flex-col w-64"
  >
    <div class="flex items-center">
      You are :
      {#if game[$username] === 'X'}
        <img src={X} alt="X" class="h-5 w-5 m-2" />
      {:else}
        <img src={O} alt="O" class="h-5 w-5 m-2" />
      {/if}
    </div>
    Current player : {game.current_player}
  </div>
</div>
