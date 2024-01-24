<script lang="ts">
  import axios from 'axios'
  import io from 'socket.io-client'
  import { wrap } from 'svelte-spa-router/wrap'
  import Router, { push } from 'svelte-spa-router'
  import { socket, username } from './lib/store'

  import NavBarConnected from './lib/Components/NavBar/Connected.svelte'
  import NavBarLanding from './lib/Components/NavBar/Landing.svelte'
  import About from './lib/Components/Landing/About.svelte'
  import Home from './lib/pages/Home.svelte'
  import Register from './lib/Components/Landing/Register.svelte'
  import Login from './lib/Components/Landing/Login.svelte'
  import Dashboard from './lib/Components/Dashboard/Dashboard.svelte'
  import TicTacToe from './lib/Components/Games/Tic-tac-toe/Tic-tac-toe.svelte'
  import Connect_4 from './lib/Components/Games/Connect_4/Connect_4.svelte'
  import President from './lib/Components/Games/President/President.svelte'

  async function fetchLogin() {
    try {
      let response = await axios.get(
        'http://' + window.location.host + '/api/verifToken',
        { withCredentials: true }
      )
      if (response.data.message === 'OK') {
        username.set(response.data.username)
        push('/dashboard')
      }
    } catch {}

    if ($username !== '')
      socket.set(
        io('http://' + window.location.host, {
          path: '/api/socket.io/',
          query: {
            username: $username,
          },
        })
      )
  }
  fetchLogin()

  function conditionsFailed(e: any) {
    if (e.detail.route === '/') push('/home')
    else push('/login')
  }
</script>

{#if $username === ''}
  <NavBarLanding />
{:else}
  <NavBarConnected />
{/if}
<div class="absolute w-full h-[calc(100%_-_5rem)] top-20">
  <Router
    routes={{
      '/': wrap({
        component: Dashboard,
        conditions: [() => $username !== ''],
      }),
      '/home': Home,
      '/about': About,
      '/dashboard': wrap({
        component: Dashboard,
        conditions: [() => $username !== ''],
      }),
      '/register': Register,
      '/login': wrap({
        component: Login,
        props: { fetchLogin: () => fetchLogin() },
      }),
      '/tic-tac-toe': TicTacToe,
      '/connect-4': Connect_4,
      '/president': President,
    }}
    on:conditionsFailed={conditionsFailed}
  />
</div>
