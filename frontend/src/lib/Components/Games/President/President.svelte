<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../../store'
  import type { CardType, PresidentType } from '../../../types'
  import Connection_Box from '../ConnectionBox.svelte'
  import Hand from './Hand.svelte'
  import PlayZone from './PlayZone.svelte'
  import { cards_sort, validateTurn } from './helper'
  import Stack from './Stack.svelte'

  let game: PresidentType
  let userMsg: String

  if ($socket === null) {
    push('/dashboard')
  } else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Create', (data: PresidentType) => {
      data.playZoneCards = []
      data.stack = []
      game = data
    })

    $socket.on('President:Update', (data) => {})
  }

  function toggleCard(card: CardType) {
    let isTheCard = (e: CardType) =>
      e.suite === card.suite && e.value === card.value

    if (game.playZoneCards.find(isTheCard)) {
      game.playZoneCards = game.playZoneCards.filter((e) => !isTheCard(e))
      game.cards.push(card)
      game.cards = cards_sort(game.cards)
    } else {
      game.cards = game.cards.filter((e: CardType) => !isTheCard(e))
      game.playZoneCards.push(card)
    }
  }

  function play(type: string) {
    if (type === 'pass') return
    userMsg = validateTurn(game.stack, game.playZoneCards)
    if (userMsg) return

    $socket.emit('President:UpdateClient', game.playZoneCards)
    game.playZoneCards = []
  }
</script>

<Connection_Box />
<div
  id="board"
  class="w-full h-full flex items-center justify-center bg-poker flex-col"
>
  {#if game}
    <Stack cards={game.stack} />
    <PlayZone cards={game.playZoneCards} {toggleCard} />
    {#if game.currrentPlayer === $username}
      <div>
        <button
          class="text-white bg-blue-500 rounded-full p-2 my-3 hover:bg-slate-500"
          on:click={() => play('play')}>Play</button
        >
        <button
          class="text-white bg-blue-500 rounded-full p-2 my-3 hover:bg-slate-500"
          on:click={() => play('pass')}>Play</button
        >
      </div>
      {userMsg}
    {/if}
    <Hand cards={game.cards} {toggleCard} />
  {/if}
</div>
