<script lang="ts">
  import type { CardType } from '../../../types'
  export let card: CardType

  function dragStart(e: any) {
    e.dataTransfer.setData('text/plain', JSON.stringify(card))
    e.dataTransfer.dropEffect = 'move'
  }
</script>

<img
  class="w-24 max-w-none transition-shadow hover:shadow-xl"
  src={'/cards/' + card.file}
  alt={card.suite + '-' + card.value}
  draggable={true}
  on:dragstart={dragStart}
/>
