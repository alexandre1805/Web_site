<script lang="ts">
  export let current_room: RoomType;
  export let return_room: Function;
  import leftArrow from "../../../../assets/icons-pack/arrow-back-outline.svg";
  import type { RoomType } from "../../../types"
</script>

<div class="bg-white text-center flex h-24 items-center">
  <button class="mx-2" on:click={(e) => return_room(e)}
    ><img
      id="arrow"
      src={leftArrow}
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
