<script lang="ts">
  import type { CardType } from '../../../types'
  import Card from './Card.svelte'

  export let cards: CardType[] = []
  export let toggleCard: Function

  function drop(e: any) {
    e.preventDefault()
    const card: CardType = JSON.parse(e.dataTransfer.getData('text/plain'))
    toggleCard(card)
  }
</script>

<ul
  id="playZone"
  class="w-1/3 min-h-[9rem] border-2 border-black flex"
  on:drop={drop}
  on:dragover={(e) => {
    e.preventDefault()
    return false
  }}
>
  {#if cards.length === 0}
    <span class="m-auto">Drop here cards that you want to play !</span>
  {/if}
  {#each cards as card}
    <li>
      <Card {card} />
    </li>
  {/each}
</ul>
