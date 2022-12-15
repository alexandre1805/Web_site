<script lang="ts">
  import type { CardType } from '../../../types'
  import Card from './Card.svelte'

  export let cards: CardType[]
</script>

<ul id="stack" class="w-1/3 h-48 flex">
  {#each cards as card}
    <li>
      <Card {card} />
    </li>
  {/each}
</ul>
