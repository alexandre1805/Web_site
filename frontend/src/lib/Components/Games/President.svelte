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
        let li = document.createElement('li')
        let img = document.createElement('img')
        img.src = '/cards/' + card.file
        img.classList.add('w-24')
        document.getElementById('board').appendChild(li).appendChild(img)
      })
    })
  }
</script>

<Connection_Box />
<ul
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker md:flex-row"
/>
