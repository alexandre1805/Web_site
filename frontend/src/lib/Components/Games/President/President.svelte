<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../../store'
  import type { CardType, PresidentType } from '../../../types'
  import Connection_Box from '../ConnectionBox.svelte'
  import Hand from './Hand.svelte'
  import PlayZone from './PlayZone.svelte'
  import { cards_sort } from './helper'

  let game: PresidentType = {
    cards: [],
    current_player: '',
    playZoneCards: [],
  }

  if ($socket === null) {
    push('/dashboard')
  } else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Create', (data: PresidentType) => {
      game = data
    })
  }

  function toggleCard(card: CardType) {
    let isTheCard = (e: CardType) =>
      e.suite === card.suite && e.value === card.value

    if (game.playZoneCards.find(isTheCard)) {
      game.playZoneCards = game.playZoneCards.filter((e) => !isTheCard(e))
      game.cards.push(card)
      game.cards = cards_sort(game.cards)
    } else {
      game.cards = game.cards.filter(
        (e: CardType) => !isTheCard(e)
      )
      game.playZoneCards.push(card)
    }
  }
</script>

<Connection_Box />
<div
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker flex-col"
>
  <PlayZone cards={game.playZoneCards} {toggleCard} />
  <Hand cards={game.cards} {toggleCard} />
</div>
