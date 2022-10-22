<script>
  import axios from "axios";
  import { socket, username } from "../../../store";

  export let setOpenDialogBox;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let usernameValue;
  username.subscribe((val) => (usernameValue = val));
  let friendList = [];
  let listNewRoom = [usernameValue];
  let finalMsg = "";
  let friendMsg = "";
  let addFriend = "";

  axios
    .get("http://" + window.location.host + "/api/getFriends", {
      withCredentials: true,
    })
    .then((res) => {
      friendList = res.data.friends;
    });

  /**
   * @param {{ target: { type: string; className: string; parentNode: any; checked: any; }; preventDefault: () => void; }} e
   */
  function handleClickFriend(e) {
    if (e.target.type !== "checkbox") e.preventDefault();
    let obj;
    if (e.target.className !== "room") obj = e.target.parentNode;
    else obj = e.target;

    let state;
    if (e.target.type !== "checkbox") {
      let checkbox = obj.childNodes[0];
      if (!checkbox.checked) checkbox.checked = true;
      else checkbox.checked = false;
      state = checkbox.checked;
    } else state = e.target.checked;
    if (state) listNewRoom = [...listNewRoom, obj.innerText];
    else listNewRoom = listNewRoom.filter((elm) => elm !== obj.innerText);
  }

  function handleNewRoom(e) {
    if (listNewRoom.length === 1) return;
    socketValue.emit("create Room", listNewRoom);
  }

  socketValue.on("create Room return", (msg) => {
    finalMsg = msg;
  });

  function handleAddFriend(e) {
    e.preventDefault();
    if (addFriend === "") return;
    socketValue.emit("add Friend", addFriend);
    addFriend = "";
  }

  socketValue.on("add Friend return", (msg) => {
    friendMsg = msg;
  });
</script>

<div class="Dialog_box">
  <div class="Container">
    <button
      on:click={() => {
        setOpenDialogBox(false);
      }}
    >
      <img
        class="w-12 float-right"
        src="/icons-pack/close-outline.svg"
        alt="close"
      /></button
    >
    Add new friend :
    <input
      placeholder="Add friend..."
      value={addFriend}
      on:change={(e) => {
        addFriend = e.target.value;
      }}
    />
    <button on:click={handleAddFriend}>Send invitation</button>
    <div class="friend_msg">{friendMsg}</div>
    Create room by adding your friends :
    <ul>
      {#each friendList as friend}
        <li
          class="room"
          key={friend._id}
          id={friend._id}
          on:click={handleClickFriend}
        >
          <input type="checkbox" />
          <img src="/room_image.png" alt="user_image" />
          <span>{friend.username}</span>
        </li>
      {/each}
    </ul>
    <button on:click={handleNewRoom}>Create Room</button>
    {finalMsg}
  </div>
</div>
