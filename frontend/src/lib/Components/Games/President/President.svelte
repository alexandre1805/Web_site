<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../../store'
  import type {
    CardType,
    PresidentType,
    PresidentUpdateType,
  } from '../../../types'
  import Connection_Box from '../ConnectionBox.svelte'
  import Hand from './Hand.svelte'
  import PlayZone from './PlayZone.svelte'
  import { cards_sort, validateTurn } from './helper'
  import Stack from './Stack.svelte'

  let game: PresidentType
  let userMsg: String = ''
  let numberOrPassMsg: String = ''
  let stack = []

  if ($socket === null) {
    push('/dashboard')
  } else {
    $socket.emit('GameConnection:join', {
      id: $currentGame,
      username: $username,
    })

    $socket.on('President:Create', (data: PresidentType) => {
      data.playZoneCards = []
      data.emptyStack = false
      data.nbCards = 0
      game = data
    })

    $socket.on('President:Update', (data: PresidentUpdateType) => {
      game.handLength = data.handLength
      game.currrentPlayer = data.currrentPlayer
      game.emptyStack = data.emptyStack
      game.nbCards = data.nbCards
      game.numberOrPass = data.numberOrPass
      if (data.cardsPlayed.length !== 0) stack = data.cardsPlayed

      if (game.numberOrPass && game.currrentPlayer === $username)
        numberOrPassMsg = `You can only play a ${stack[stack.length - 1].value}`
      else
        numberOrPassMsg = ''
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
      game.cards = game.cards.filter((e: CardType) => !isTheCard(e))
      game.playZoneCards.push(card)
    }
  }

  function play(type: string) {
    userMsg = ''
    if (type === 'pass') {
      $socket.emit('President:UpdateClient', { id: $currentGame, cards: [] })
      return
    }
    if (!game.emptyStack) {
      userMsg = validateTurn(
        stack,
        game.playZoneCards,
        game.nbCards,
        game.numberOrPass
      )
      if (userMsg) return
    }

    $socket.emit('President:UpdateClient', {
      id: $currentGame,
      cards: game.playZoneCards,
    })
    game.playZoneCards = []
  }
</script>

<Connection_Box />
<div id="board" class="w-full h-full flex items-center bg-poker flex-col">
  {#if game}
    <div class="w-full h-fit flex items-center justify-center flex-col">
      <Stack cards={stack} emptyStack={game.emptyStack} />
      <PlayZone cards={game.playZoneCards} {toggleCard} />
      {#if game.currrentPlayer === $username}
        {numberOrPassMsg}
        <div>
          <button
            class="text-white bg-blue-500 rounded-full p-2 my-3 hover:bg-slate-500"
            on:click={() => play('play')}>Play</button
          >
          <button
            class="text-white bg-blue-500 rounded-full p-2 my-3 hover:bg-slate-500"
            on:click={() => play('pass')}>Pass</button
          >
        </div>
        {userMsg}
      {/if}
    </div>
    <Hand cards={game.cards} {toggleCard} />
  {/if}
</div>
