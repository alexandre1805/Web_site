<script>
  export let current_room;
  export let return_room;
</script>

<div class="bg-gray-500 text-center flex h-24 items-center">
  <button class="mx-2" on:click={return_room}
    ><img
      id="arrow"
      src="/left-arrow.svg"
      alt="left arrow"
      class="h-16 md:hidden"
    /></button
  >
  <img
    class="h-16 m-1 rounded-full bg-white"
    src="/room_image.png"
    alt="user_image"
  />
  <div class="w-full h-full flex justify-center items-center text-2xl">
    {current_room.name}
  </div>
</div>
