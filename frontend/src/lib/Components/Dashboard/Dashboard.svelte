<script lang="ts">
  import Room from './Rooms/Room.svelte'
  import Messages from './Messages/Messages.svelte'
  import type { RoomType } from '../../types'
  let current_room = { name: '', _id: null }

  function setCurrentRoom(room: RoomType) {
    current_room = room
    document.getElementById('room_container').classList.add('hidden')
    document.getElementById('message_container').classList.remove('hidden')
  }

  function return_room() {
    document.getElementById('room_container').classList.remove('hidden')
    document.getElementById('message_container').classList.add('hidden')
    current_room = { name: '', _id: null  }
  }
</script>

<div class="Dashboard w-full h-full flex">
  <div id="room_container" class="w-full h-full md:inline md:w-2/5 ">
    <Room {setCurrentRoom} {current_room} />
  </div>
  <div
    id="message_container"
    class="w-full h-full hidden md:inline md:w-3/5 border-l-2 "
  >
    <Messages {current_room} {return_room} />
  </div>
</div>
