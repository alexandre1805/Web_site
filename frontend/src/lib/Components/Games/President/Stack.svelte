<script lang="ts">
  import type { CardType } from '../../../types'
  import Card from './Card.svelte'

  export let cards: CardType[]
</script>

<ul id="stack" class="flex max-w-xl h-48 p-3 mb-2">
  {#each cards as card}
    <li
      class="overflow-visible flex-grow w-8 last:w-24 last:grow-0 hover:-translate-y-7"
    >
      <Card {card} />
    </li>
  {/each}
</ul>
