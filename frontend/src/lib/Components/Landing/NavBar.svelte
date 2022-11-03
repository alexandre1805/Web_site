<script>
  import { push, link } from "svelte-spa-router";
  import { username, currentGame, socket } from "../../store";
  import notificationsLogo from "../../../assets/icons-pack/notifications.svg";
  import logoutLogo from "../../../assets/icons-pack/log-out-outline.svg";
  import menuLogo from "../../../assets/icons-pack/menu-outline.svg";
  import Notifications from "./Notifications.svelte";

  let notificationsOpen = false;

  const default_routes = [
    { name: "Home", route: "/" },
    { name: "About Us", route: "/about" },
    { name: "Log In", route: "/dashboard" },
  ];

  function log_out() {
    if ($currentGame !== "") {
      $socket.emit("GameConnection:leave", {
        id: $currentGame,
        username: $username,
      });
      currentGame.set("");
    }

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    push("/home");
    username.set("");
  }
</script>

<div
  class="navigation fixed flex bg-white top-0 w-full h-16 min-h-[5Opx] justify-between items-center z-10 border-b-2"
>
  <div class="left-content h-full flex justify-center items-center ml-1">
    {#if $username === ""}
      <button
        class="h-2/3 md:hidden"
        on:click={() => {
          document.getElementById("menu").classList.toggle("invisible");
        }}
      >
        <img src={menuLogo} alt="menu" class="h-full" />
      </button>
    {/if}
    <h2
      class="relative text-blue-500 no-underline uppercase
      font-extrabold ml-3 text-center text-3xl"
    >
      LOGO
    </h2>
  </div>
  {#if $username !== ""}
    <div class="flex justify-center mx-4">
      <button
        on:click={() => {
          notificationsOpen = !notificationsOpen;
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
  {:else}
    <ul
      id="menu"
      class="absolute top-full h-screen w-full flex justify-center mr-3 flex-col bg-slate-100 items-center invisible md:visible md:relative md:bg-white md:flex-row md:w-auto md:h-auto md:top-0 md:bg-transparent"
    >
      {#each default_routes as page}
        <li
          class="flex no-underline text-center text-4xl p-3 m-6 rounded-full hover:bg-gray-300 md:text-base"
        >
          <a
            use:link
            href={page.route}
            on:click={() => {
              document.getElementById("menu").classList.toggle("invisible");
            }}>{page.name}</a
          >
        </li>
      {/each}
      <li
        class="flex no-underline text-center text-4xl p-3 m-6 rounded-full hover:bg-gray-300 text-white bg-blue-500 md:text-base md:top-0"
      >
        <a
          use:link
          href="/register"
          on:click={() => {
            document.getElementById("menu").classList.toggle("invisible");
          }}>Sign Up</a
        >
      </li>
    </ul>
  {/if}
</div>
