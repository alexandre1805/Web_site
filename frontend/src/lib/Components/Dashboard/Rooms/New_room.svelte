<script>
  import axios from "axios";
  import { socket, username } from "../../../store";

  export let setOpenDialogBox;
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let friendList = [];
  let listNewRoom = [usernameValue];
  let finalMsg = "";

  axios
    .get("http://" + window.location.host + "/api/getFriends", {
      withCredentials: true,
    })
    .then((res) => {
      friendList = res.data.friends;
    });

  function handleClickFriend(friend) {
    if (listNewRoom.includes(friend.username)) {
      listNewRoom = listNewRoom.filter((str) => str !== friend.username);
      // @ts-ignore
      document.getElementById(friend.id).checked = false;
    } else {
      listNewRoom.push(friend.username);
      // @ts-ignore
      document.getElementById(friend.id).checked = true;
    }
    console.log(listNewRoom);
  }

  function handleNewRoom(e) {
    if (listNewRoom.length === 1) return;
    $socket.emit("create Room", listNewRoom);
  }

  $socket.on("create Room return", (msg) => {
    finalMsg = msg;
  });
</script>

<div class="Dialog_box">
  <div class="Container min-w-[300px]">
    <button
      on:click={() => {
        setOpenDialogBox(false);
      }}
    >
      <img
        class="w-12 float-right hover:bg-slate-500 rounded-full"
        src="/icons-pack/close-outline.svg"
        alt="close"
      /></button
    >
    New message group :
    <ul class="overflow-y-scroll m-3">
      {#each friendList as friend}
        <li
          class="flex hover:bg-slate-400 items-center p-2 border-b-2"
          on:click={() => handleClickFriend(friend)}
          aria-hidden="true"
        >
          <input type="checkbox" id={friend.id} />
          <img
            src="/room_image.png"
            alt="user_image"
            class="h-12 rounded-full"
          />
          <span>{friend.username}</span>
        </li>
      {/each}
    </ul>
    <button
      on:click={handleNewRoom}
      class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
      >Create Room</button
    >
    {finalMsg}
  </div>
</div>
