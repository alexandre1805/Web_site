<script lang="ts">
  import type { CardType } from '../../../types'
  import Card from './Card.svelte'

  export let cards: CardType[]
  export let emptyStack: boolean

  $: if (cards.length !== 0 && emptyStack)
    setTimeout(() => {
      cards = []
    }, 1000)
</script>

<ul id="stack" class="flex max-w-xl h-[9rem] p-3 m-10">
  {#each cards as card}
    <li
      class="overflow-visible flex-grow w-8 last:w-24 last:grow-0 animate-stack-cards"
    >
      <Card {card} />
    </li>
  {/each}
</ul>
