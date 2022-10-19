<script>
  import { push } from "svelte-spa-router";
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

<div
  class="navigation fixed flex bg-white top-0 w-full h-16 min-h-[5Opx] justify-between items-center z-10 border-b-2"
>
  <div class="left-content h-full flex justify-center items-center ml-1">
    {#if $username === ""}
      <button
        class="h-2/3"
        on:click={() => {
          document.getElementById("menu").classList.toggle("hidden");
        }}
      >
        <img src="menu.svg" alt="menu" class="menu-icon h-full" />
      </button>
    {/if}
    <h2
      class="relative text-blue-500 no-underline uppercase
      font-extrabold tracking-wide ml-3 text-center"
    >
      LOGO
    </h2>
  </div>
  {#if $username !== ""}
    <div class="loged">
      <img
        src="/icons-pack/notifications.svg"
        alt="notif"
        on:click={() => {
          notificationsOpen = !notificationsOpen;
        }}
      />
      <img
        src="/icons-pack/log-out-outline.svg"
        alt="log-out"
        on:click={() => {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
          push("/home");
          username.set("");
        }}
      />
      <h3 class="mr-3 my-auto hidden">Welcome {$username} !</h3>
      {#if notificationsOpen}
        <Notifications />
      {/if}
    </div>
  {:else}
    <ul id="menu" class="flex justify-center mr-3">
      {#each default_routes as page}
        <li
          class="flex no-underline text-center font-medium px-1 py-4 mr-2 rounded-2xl"
        >
          <a
            use:link
            href={page.route}
            on:click={() => {
              document.getElementById("menu").classList.toggle("hide");
            }}>{page.name}</a
          >
        </li>
      {/each}
      <li class="flex no-underline text-center font-medium px-1 py-4 Sign_Up">
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
