<script>
  import { username, socket } from "../../store";
  import axios from "axios";
  let notifications = [];

  //get the notifications
  axios
    .get(
      "http://" + process.env.URI + ":" + process.env.API_PORT + "/getNotifs",
      {
        params: { username: $username },
        withCredentials: true,
      }
    )
    .then((res) => {
      notifications = res.data;
    });

  //real-times get notifications
  $socket.on("notification", (elt) => {
    console.log(elt);
    notifications = [...notifications, elt];
  });

  function deleteNotification(e) {
    $socket.emit("delete notification", e.id);
    notifications = notifications.filter((elm) => elm.id !== e.id);
  }
  function handleAccpetInvit(e) {
    $socket.emit("accept invitation", e);
    notifications = notifications.filter((elm) => elm.id !== e.id);
  }
</script>

<div class="Notification">
  {#each notifications as e}
    {#if e.type === "add_friend"}
      <div class="add_friend" key={e._id}>
        <span>{e.message}</span>
        <button
          on:click={() => {
            handleAccpetInvit(e);
          }}
        >
          ADD
        </button>
        <button
          on:click={() => {
            deleteNotification(e);
          }}>DELETE</button
        >
      </div>
    {/if}
  {/each}
</div>
