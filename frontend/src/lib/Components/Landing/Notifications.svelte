<script lang="ts">
  import { username, socket } from '../../store'
  import type { NotificationType } from '../../types'
  import { NotificationType_type } from '../../types'
  import axios from 'axios'
  let notifications: NotificationType[] = []

  //get the notifications
  axios
    .get('http://' + window.location.host + '/api/getNotifs', {
      params: { username: $username },
      withCredentials: true,
    })
    .then((res) => {
      notifications = res.data
    })

  //real-times get notifications
  $socket.on('User:Notification:New', (elt: NotificationType) => {
    notifications = [...notifications, elt]
  })

  function deleteNotification(e: NotificationType) {
    $socket.emit('User:Notification:Delete', e._id)
    notifications = notifications.filter((elm) => elm._id !== e._id)
  }
  function handleAccpetInvit(e: NotificationType) {
    $socket.emit('User:Notification:Accept', e)
    notifications = notifications.filter((elm) => elm._id !== e._id)
  }
</script>

<div
  class="absolute top-full right-3 h-[70vh] w-[95vw] bg-white border-black border-2 rounded-xl overflow-auto z-10 md:w-[30vw]"
>
  {#each notifications as e}
    {#if e.type === NotificationType_type.add_friend}
      <div class="p-4 border-b-2 border-gray-300">
        <span>{e.message}</span>
        <button
          class="text-white bg-blue-500 rounded-full w-fit p-2 mx-auto mb-4 hover:bg-slate-500"
          on:click={() => {
            handleAccpetInvit(e)
          }}
        >
          ADD
        </button>
        <button
          class="text-white bg-blue-500 rounded-full w-fit p-2 mx-auto mb-4 hover:bg-slate-500"
          on:click={() => {
            deleteNotification(e)
          }}>DELETE</button
        >
      </div>
    {/if}
  {/each}
</div>
