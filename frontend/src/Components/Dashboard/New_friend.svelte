<script>
  import { socket } from "../../store";
  export let setOpenDialogBox;
  let addFriend = "";
  let friendMsg = "";
  let socketValue;
  socket.subscribe((val) => (socketValue = val));

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
    <img
      class="close_button"
      src="/plus.png"
      alt="plus"
      on:click={() => {
        setOpenDialogBox(false);
        addFriend = "";
      }}
    />
    Add new friend :
    <input
      placeholder="Add friend..."
      value={addFriend}
      on:change={(e) => {
        addFriend = e.target.value;
      }}
    />
    <button on:click={handleAddFriend}>Send invitation</button>
    {friendMsg}
  </div>
</div>
