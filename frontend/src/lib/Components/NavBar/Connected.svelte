<script>
  import { push } from 'svelte-spa-router'
  import notificationsLogo from '../../../assets/icons-pack/notifications.svg'
  import logoutLogo from '../../../assets/icons-pack/log-out-outline.svg'
  import Notifications from './../Landing/Notifications.svelte'
  import { username, currentGame, socket } from '../../store'

  let notificationsOpen = false

  function log_out() {
    if ($currentGame !== '') {
      $socket.emit('GameConnection:leave', {
        id: $currentGame,
        username: $username,
      })
      currentGame.set('')
    }

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    push('/home')
    username.set('')
  }
</script>

<div
  class="navigation fixed flex bg-white top-0 w-full h-16 min-h-[5Opx] justify-between items-center z-10 border-b-2"
>
  <div class="left-content h-full flex justify-center items-center ml-1">
    <h2
      class="relative text-blue-500 no-underline uppercase
      font-extrabold ml-3 text-center text-3xl"
    >
      LOGO
    </h2>
  </div>
  <div class="flex justify-center mx-4">
    <button
      on:click={() => {
        notificationsOpen = !notificationsOpen
      }}
      class="rounded-full hover:bg-slate-200 m-1"
    >
      <img src={notificationsLogo} alt="notif" class="h-10 m-2" />
    </button>
    <button on:click={log_out} class="rounded-full hover:bg-slate-200 m-1">
      <img src={logoutLogo} alt="log-out" class="h-10 m-2" /></button
    >
    <h3 class="mr-3 my-auto hidden">Welcome {$username} !</h3>
    {#if notificationsOpen}
      <Notifications />
    {/if}
  </div>
</div>
