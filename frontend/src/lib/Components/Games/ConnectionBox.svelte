<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { socket, currentGame, username } from '../../store'
  import type { GameMsgType } from '../../types'
  let message = 'Waiting for informations...'
  let open = true
  let startButton = false
  let replayButton = false

  $socket.on('GameConnection:update', (obj: GameMsgType) => {
    message = obj.message
    switch (obj.state) {
      case 'Running':
        open = false
        message = 'Waiting for informations...'
        startButton = false
        replayButton = false
        break
      case 'Ready':
        startButton = true
        break
      case 'Finished':
          replayButton = true
      default:
        open = true
        startButton = false
        replayButton = false
        break
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

  function handleReplayGame() {
    $socket.emit('GameConnection:restart', {
      id: $currentGame,
      username: $username,
    })
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
          {#if replayButton}
            <button
              on:click={handleReplayGame}
              class="text-white bg-blue-500 rounded-full p-1 my-3 mx-1 w-full hover:bg-slate-500"
              >Replay</button
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
