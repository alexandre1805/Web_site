<script>
  import "../../styles/NavBar/NavBar.css";
  import "../../styles/NavBar/Notification.css";
  import { link } from "svelte-spa-router";
  import { username } from "../../store";
  import Notifications from "./Notifications.svelte";

  let notificationsOpen = false;

  const default_routes = [
    { name: "Home", route: "/" },
    { name: "About Us", route: "/about" },
    { name: "Log In", route: "/dashboard" },
    { name: "Sign Up", route: "/register" },
  ];
</script>

<div class="navigation">
  <h2>LOGO</h2>
  {#if $username !== ""}
    <div class="loged">
      <img
        src="/notification.png"
        alt="notif"
        on:click={() => {
          notificationsOpen = !notificationsOpen;
        }}
      />
      <h3 class="hide">Welcome {$username} !</h3>
      {#if notificationsOpen}
        <Notifications />
      {/if}
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
