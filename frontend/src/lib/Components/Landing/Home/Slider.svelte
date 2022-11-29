<script>
  import slider1 from '../../../../assets/slider/tchat.png'
  import slider2 from '../../../../assets/slider/connect4.png'
  import slider3 from '../../../../assets/slider/ticTacToe.png'
  import leftArrow from '../../../../assets/icons-pack/caret-back-circle-outline.svg'
  import rightArrow from '../../../../assets/icons-pack/caret-forward-circle-outline.svg'

  let current_image = 1

  function changeImage(numero) {
    for (let index = 0; index < 3; index++) {
      document.getElementById('slider-' + index).classList.add('invisible')
    }
    current_image = current_image > 3 ? 1 : current_image++
    document.getElementById('slider-' + numero).classList.remove('invisible')
  }
</script>

<div class="h-4/6 relative">
  <img
    src={slider1}
    id="slider-1"
    alt="slider 1"
    class="object-cover h-full w-full absolute top-0 left-0"
  />
  <img
    src={slider2}
    alt="slider 2"
    class="object-cover h-full w-full absolute top-0 left-0 invisible"
  />
  <img
    src={slider3}
    alt="slider 3"
    class="object-cover h-full w-full absolute top-0 left-0 invisible"
  />
  <img
    src={leftArrow}
    alt="left arrow"
    class="h-14 absolute top-[50%] left-4"
  />
  <img
    src={rightArrow}
    alt="left arrow"
    class="h-14 absolute top-[50%] right-4"
  />
</div>
