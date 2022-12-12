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
  id="hand"
  class="flex max-w-5xl p-3 mb-2 absolute bottom-2"
  on:drop={drop}
  on:dragover={(e) => {
    e.preventDefault()
    return false
  }}
>
  {#each cards as card}
    <li
      class="overflow-visible flex-grow w-8 last:w-24 last:grow-0 hover:-translate-y-7"
    >
      <Card {card} />
    </li>
  {/each}
</ul>
