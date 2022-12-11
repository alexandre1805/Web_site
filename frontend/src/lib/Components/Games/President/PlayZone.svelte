<script lang="ts">
  import { prevent_default } from 'svelte/internal'
  import type { CardType } from '../../../types'
  import Card from './Card.svelte'

  let cards: CardType[] = []
  function drop(e: any) {
    e.preventDefault()
    const card = JSON.parse(e.dataTransfer.getData('text/plain'))
    cards = [...cards, card]
  }
</script>

<ul
  id="playZone"
  class="w-1/3 h-48 border-2 border-black"
  on:drop={drop}
  on:dragover={(e) => {
    e.preventDefault()
    return false
  }}
>
  {#each cards as card}
    <li class="w-8">
      <Card {card} />
    </li>
  {/each}
</ul>
