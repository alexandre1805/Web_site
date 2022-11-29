<script lang="ts">
  import axios from 'axios'
  import messageLogo from '../../../../assets/icons-pack/chatbox-ellipses-outline.svg'
  import addLogo from '../../../../assets/icons-pack/add-outline.svg'
  import NewRoom from './New_room.svelte'
  import NewFriend from './Add_friend.svelte'
  import { socket } from '../../../store'
  import { onMount } from 'svelte'

  export let setCurrentRoom
  export let current_room
  let rooms = []
  let search = ''
  let searchRooms = rooms
  let openDialogBoxNewRoom = false
  let openDialogBoxNewFriend = false

  onMount(async () => {
    await axios
      .get('http://' + window.location.host + '/api/getRooms', {
        withCredentials: true,
      })
      .then((res) => {
        rooms = res.data.rooms
        searchRooms = rooms
      })
  })

  if ($socket !== null) {
    $socket.on('Room:New', (elt) => {
      rooms = [...rooms, elt]
      Search()
    })
    $socket.on('Message:New', (elt) => {
      rooms = rooms.map((room) => {
        if (room.id === elt.room) {
          room.lastMessage = elt.message
          if (current_room.id !== elt.room) room.unread++
        }
        return room
      })
      Search()
    })
  }

  /**
   * @param {{ _id: string; }} room
   */
  function handleChangeRoom(room) {
    document.querySelectorAll('.Room li').forEach((element) => {
      element.classList.remove('md:border-l-8', 'md:border-l-blue-400')
    })
    setCurrentRoom(room)
    rooms = rooms.map((elm) => {
      if (room._id === elm._id) elm.unread = 0
      return elm
    })
    Search()
    document
      .getElementById(room._id)
      .classList.add('md:border-l-8', 'md:border-l-blue-400')
  }

  /**
   * @param {boolean} val
   */
  function setopenDialogBoxNewRoom(val) {
    openDialogBoxNewRoom = val
  }

  /**
   * @param {boolean} val
   */
  function setopenDialogBoxNewFriend(val) {
    openDialogBoxNewFriend = val
  }

  function Search() {
    searchRooms = rooms.filter((room) => room.name.includes(search))
  }
</script>

<div
  class="Room w-full min-w-fit float-left bg-white flex flex-col h-full overflow-y-auto"
>
  <div class="p-1 h-24 flex border-b-2 border-gray-300">
    <input
      bind:value={search}
      class="input-field my-auto bg-gray-100 border-0 h-14 w-full text-lg"
      placeholder="Search..."
      on:input={Search}
    />
    <button
      class="my-auto rounded-full hover:bg-slate-200 p-2 m-1"
      on:click={() => {
        openDialogBoxNewRoom = true
      }}
    >
      <img src={messageLogo} alt="new_room" class="w-10" /></button
    >
    <button
      class="my-auto rounded-full hover:bg-slate-200 p-2 m-1"
      on:click={() => {
        openDialogBoxNewFriend = true
      }}
    >
      <img src={addLogo} alt="new_room" class="w-10" /></button
    >

    {#if openDialogBoxNewRoom}
      <NewRoom setOpenDialogBox={setopenDialogBoxNewRoom} />
    {/if}
    {#if openDialogBoxNewFriend}
      <NewFriend setOpenDialogBox={setopenDialogBoxNewFriend} />
    {/if}
  </div>
  {#if searchRooms.length === 0}
    No rooms available
  {/if}
  <ul class="w-full list-none overflow-y-auto">
    {#each searchRooms as room}
      <li
        class="flex p-2 w-full border-b-2 border-gray-300 items-center hover:bg-blue-200"
        id={room.id}
        on:click={() => {
          handleChangeRoom(room)
        }}
        aria-hidden="true"
      >
        <img
          src="/room_image.png"
          alt="user_image"
          class="rounded-full w-16 bg-white"
        />
        <div class="flex ml-5 flex-col text-gray-500">
          <span class="font-bold text-lg text-black">{room.name}</span>
          {#if room.lastMessage !== undefined}
            {#if room.lastMessage.length > 20}
              {room.lastMessage.slice(0, 20) + '...'}
            {:else}
              {room.lastMessage}
            {/if}
          {/if}
        </div>
        {#if room.unread !== 0}
          <div
            class="w-8 h-8 flex bg-blue-400 rounded-full justify-center items-center text-white font-bold ml-auto"
          >
            {room.unread}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
