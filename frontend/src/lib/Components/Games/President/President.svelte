<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { flip } from 'svelte/animate'
  import { socket, currentGame, username } from '../../../store'
  import type { PresidentType } from '../../../types'
  import Connection_Box from '../ConnectionBox.svelte'
  import Card from './Card.svelte'
  import PlayZone from './PlayZone.svelte'
  let game: PresidentType = {
    [$username]: { cards: [] },
    current_player: '',
  }

  if ($socket === null) push('/dashboard')
  else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Update', (data: PresidentType) => {
      game = data
    })
  }
</script>

<Connection_Box />
<div
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker flex-col"
>
  <PlayZone />
  <ul
    id="hand"
    class="flex max-w-5xl p-3 mb-2 absolute bottom-2"
    on:dragstart={(e) => {
      e.dataTransfer.dropEffect = 'move'
    }}
  >
    {#each game[$username].cards as card (card)}
      <li
        class="overflow-visible flex-grow w-8 last:w-24 last:grow-0 hover:-translate-y-7"
      >
        <Card {card} />
      </li>
    {/each}
  </ul>
</div>
