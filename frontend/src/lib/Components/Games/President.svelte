<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../store'
  import type { CardType, PresidentType } from '../../types'
  import Connection_Box from './ConnectionBox.svelte'
  let game: PresidentType

  if ($socket === null) push('/dashboard')
  else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Update', (data: PresidentType) => {
      console.log(data)
      game = data
      game[$username].cards.forEach((card: CardType) => {
        let img = document.createElement('img')
        img.classList.add(
          'w-24',
          'max-w-none',
          'transition-shadow',
          'hover:shadow-xl'
        )
        img.src = '/cards/' + card.file
        let li = document.createElement('li')
        li.classList.add(
          'overflow-visible',
          'flex-grow',
          'w-6',
          'last:w-24',
          'last:grow-0',
          'hover:-translate-y-7'
        )
        li.appendChild(img)
        document.getElementById('hand').appendChild(li)
      })
    })
  }
</script>

<Connection_Box />
<div
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker md:flex-row"
>
  <ul id="hand" class="flex max-w-5xl p-3 mb-2" />
</div>
