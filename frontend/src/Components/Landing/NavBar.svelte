<script>
  import "../../styles/NavBar/NavBar.css";
  import { link } from "svelte-spa-router";
  import { username, socket } from "../../store";
  import axios from "axios";

  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let notifications = [];
  let notificationsOpen = false;

  $: if (usernameValue !== "")
    axios
      .get(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/getNotifs",
        {
          params: { username: usernameValue },
          withCredentials: true,
        }
      )
      .then((res) => {
        notifications = res.data;
      });

  function handleAccpetInvit(e) {
    socketValue.emit("accept invitation", e);
    notifications = notifications.filter((elm) => elm._id !== e._id);
  }

  const default_routes = [
    { name: "Home", route: "/" },
    { name: "About Us", route: "/about" },
    { name: "Log In", route: "/dashboard" },
    { name: "Sign Up", route: "/register" },
  ];
</script>

<div class="navigation">
  <h2>LOGO</h2>
  {#if usernameValue !== ""}
    <div class="loged">
      <img
        src="/notification.png"
        alt="notif"
        on:click={() => {
          notificationsOpen = !notificationsOpen;
        }}
      />
      <h3>Welcome {usernameValue} !</h3>
      {#if notificationsOpen}
        <div class="Notification">
          {#each notifications as e}
            {#if e.type === "add_friend"}
              <div class="add_friend" key={e._id}>
                <span>{e.message}</span>
                <button
                  onClick={() => {
                    handleAccpetInvit(e);
                  }}
                >
                  ADD
                </button>
                <button>DELETE</button>
              </div>{/if}
          {/each}
        </div>
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
