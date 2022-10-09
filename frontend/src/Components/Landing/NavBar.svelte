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
  ];
</script>

<div class="navigation">
  <div class="left-content">
    {#if username === ""}
      <img
        src="menu.svg"
        alt="menu"
        on:click={() => {
          document.getElementById("menu").classList.toggle("hide");
        }}
        class="menu-icon"
      />
    {/if}
    <h2>LOGO</h2>
  </div>
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
    <ul id="menu">
      {#each default_routes as page}
        <li>
          <a
            use:link
            href={page.route}
            on:click={() => {
              document.getElementById("menu").classList.toggle("hide");
            }}>{page.name}</a
          >
        </li>
      {/each}
      <li class="Sign_Up">
        <a
          use:link
          href="/register"
          on:click={() => {
            document.getElementById("menu").classList.toggle("hide");
          }}>Sign Up</a
        >
      </li>
    </ul>
  {/if}
</div>
