<script lang="ts">
  import axios from "axios";
  import { socket, username } from "../../../store";
  import closeButton from "../../../../assets/icons-pack/close-outline.svg";
  import type { FriendType } from "../../../types"

  export let setOpenDialogBox: Function;
  let friendList: FriendType[] = [];
  let listNewRoom = [$username];
  let finalMsg: string = "";

  axios
    .get("http://" + window.location.host + "/api/getFriends", {
      withCredentials: true,
    })
    .then((res) => {
      friendList = res.data.friends;
    });

  function handleClickFriend(friend: FriendType) {
    if (listNewRoom.includes(friend.username)) {
      listNewRoom = listNewRoom.filter((str) => str !== friend.username);
      // @ts-ignore
      document.getElementById(friend._id).checked = false;
    } else {
      listNewRoom.push(friend.username);
      // @ts-ignore
      document.getElementById(friend._id).checked = true;
    }
  }

  function handleNewRoom() {
    if (listNewRoom.length === 1) return;
    $socket.emit("Room:create", listNewRoom);
  }

  $socket.on("Room:Create:Return", (msg: string) => {
    finalMsg = msg;
  });
</script>

<div class="Dialog_box">
  <div class="Container min-w-[300px]">
    <button class="w-12 ml-auto"
      on:click={() => {
        setOpenDialogBox(false);
      }}
    >
      <img
        class="w-12 hover:bg-slate-200 rounded-full"
        src={closeButton}
        alt="close"
      /></button
    >
    New message group :
    <ul class="overflow-y-auto m-3">
      {#each friendList as friend}
        <li
          class="flex hover:bg-slate-400 items-center p-2 border-b-2"
          on:click={() => handleClickFriend(friend)}
          aria-hidden="true"
        >
          <input type="checkbox" id={friend._id} />
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
