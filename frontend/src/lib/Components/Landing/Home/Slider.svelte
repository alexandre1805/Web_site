<script lang="ts">
  import tchatImage from '../../../../assets/slider/tchat.png'
  import Connect4Image from '../../../../assets/slider/connect4.png'
  import TicTacToeImage from '../../../../assets/slider/ticTacToe.png'
  import leftArrow from '../../../../assets/icons-pack/caret-back-circle-outline.svg'
  import rightArrow from '../../../../assets/icons-pack/caret-forward-circle-outline.svg'
  import { onMount } from 'svelte'
  import { text } from 'svelte/internal'

  let slider = {
    1: {
      image: tchatImage,
      text: 'Easy to chat and play !',
    },
    2: {
      image: Connect4Image,
      text: 'New Connect 4 !',
    },
    3: {
      image: TicTacToeImage,
      text: "Let's play Tic-Tac-Toe !",
    },
  }
  let current_image: number = 1

  onMount(() => {
    window.setInterval(() => {
      changeImage(true)
    }, 10000)
  })

  function changeImage(clockwise: boolean) {
    if (clockwise) current_image = current_image >= 3 ? 1 : current_image + 1
    else current_image = current_image <= 1 ? 3 : current_image - 1
  }
</script>

<div
  class="h-4/6 relative bg-blue-600 flex items-center flex-col md:flex-row justify-center md:justify-start"
>
  <img
    src={slider[current_image].image}
    alt={slider[current_image].text}
    class="h-[60%] md:h-[90%] md:ml-[8%]"
  />
  <h2 class="text-2xl md:text-6xl font-bold text-white">
    {slider[current_image].text}
  </h2>

  <button
    on:click={() => {
      changeImage(false)
    }}
  >
    <img
      src={leftArrow}
      alt="left arrow"
      class="h-14 absolute top-[50%] left-4"
    />
  </button>
  <button
    on:click={() => {
      changeImage(true)
    }}
  >
    <img
      src={rightArrow}
      alt="left arrow"
      class="h-14 absolute top-[50%] right-4"
    />
  </button>
</div>
