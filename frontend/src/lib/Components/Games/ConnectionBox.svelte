<script>
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../store'
  let message = 'Waiting for informations...'
  let open = true
  let startButton = false

  $socket.on('GameConnection:update', (obj) => {
    message = obj.message

    if (obj.state === 'Running') {
      open = false
      message = 'Waiting for informations...'
      startButton = false
    } else if (obj.state === 'Ready') {
      startButton = true
    } else {
      open = true
      startButton = false
    }
  })

  function handleLeaveGame() {
    $socket.emit('GameConnection:leave', {
      id: $currentGame,
      username: $username,
    })
    currentGame.set('')
    push('/dashboard')
  }

  function handleStartGame() {
    $socket.emit('GameConnection:start', $currentGame)
  }
</script>

<div class="Connection_Box">
  {#if open}
    <div class="Dialog_box">
      <div class="Container">
        {message}
        <div class="flex">
          {#if startButton}
            <button
              on:click={handleStartGame}
              class="text-white bg-blue-500 rounded-full p-1 my-3 mx-1 w-full hover:bg-slate-500"
              >Start</button
            >
          {/if}
          <button
            on:click={handleLeaveGame}
            class="text-white bg-blue-500 rounded-full p-1 my-3 mx-1 w-full hover:bg-slate-500"
            >Leave</button
          >
        </div>
      </div>
    </div>
  {/if}
</div>
