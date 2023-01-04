<script>
  import menuLogo from '../../../assets/icons-pack/menu-outline.svg'
  import { link } from 'svelte-spa-router'

  const default_routes = [
    { name: 'Home', route: '/' },
    { name: 'About Us', route: '/about' },
    { name: 'Log In', route: '/dashboard' },
  ]
</script>
<div
  class="absolute navbar bg-primary text-secondary flex-initial"
>
  <div class="flex-1">
    <button
      class="btn btn-circle btn-ghost btn-lg m-1 md:hidden"
      on:click={() => {
        document.getElementById('menu').classList.toggle('hidden')
      }}
    >
      <img src={menuLogo} alt="menu" />
    </button>
    <h2
      class="uppercase font-extrabold ml-3 text-center text-3xl text-accent"
    >
      LOGO
    </h2>
  </div>
  <ul
    id="menu"
    class="absolute top-full w-full h-screen flex justify-center flex-col bg-primary left-0 hidden md:visible md:relative md:bg-white md:flex-row md:w-auto md:h-auto md:top-0 md:bg-transparent"
  >
    {#each default_routes as page}
      <li class="my-4 mx-2">
        <a
          class="btn btn-ghost text-4xl md:text-base"
          use:link
          href={page.route}
          on:click={() => {
            document.getElementById('menu').classList.toggle('hidden')
          }}>{page.name}</a
        >
      </li>
    {/each}
    <li
      class="my-4 mx-2"
    >
      <a
      class="btn btn-accent text-2xl md:text-base"
        use:link
        href="/register"
        on:click={() => {
          document.getElementById('menu').classList.toggle('hidden')
        }}>Sign Up</a
      >
    </li>
  </ul>
</div>
