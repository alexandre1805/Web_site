<script>
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../store'
  import Connection_Box from './ConnectionBox.svelte'

  let game

  if ($socket === null) push('/dashboard')
  else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Update', (data) => {
      game = data
      game[$username].cards.forEach((card) => {
        let img = document.createElement('img')
        img.src = card.file
        document.getElementById('board').appendChild(img)
      })
    })
  }
</script>

<Connection_Box />
<div
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker flex-col md:flex-row"
/>
