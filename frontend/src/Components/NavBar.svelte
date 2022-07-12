<script>
  import "../styles/NavBar/NavBar.css";
  import { link } from "svelte-spa-router";
  let logged = false;

  const default_routes = [
    { name: "Home", route: "/" },
    { name: "About Us", route: "/about" },
    { name: "Log In", route: "/dashboard" },
    { name: "Sign Up", route: "/register" },
  ];
</script>

<div class="navigation">
  <h2>LOGO</h2>
  {#if logged}
    <div class="loged">
      <img src="/notification.png" alt="notif" onClick="" />
      <h3>Welcome username !</h3>
    </div>
  {:else}
    <ul>
      {#each default_routes as page}
        <li>
          <a use:link href={page.route}>{page.name}</a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
