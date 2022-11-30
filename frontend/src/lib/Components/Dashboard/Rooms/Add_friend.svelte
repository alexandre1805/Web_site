<script lang="ts">
  import closeButton from "../../../../assets/icons-pack/close-outline.svg";
  import { socket } from "../../../store";

  export let setOpenDialogBox: Function;
  let friendMsg = "";
  let addFriend = "";

  function handleAddFriend(e: any) {
    e.preventDefault();
    if (addFriend === "") return;
    $socket.emit("User:Friend:Add", addFriend);
    addFriend = "";
  }

  $socket.on("User:Friend:Add:Return", (msg: string) => {
    friendMsg = msg;
  });
</script>

<div class="Dialog_box">
  <div class="Container">
    <button class="w-12 ml-auto"
      on:click={() => {
        setOpenDialogBox(false);
      }}
    >
      <img class="w-12 hover:bg-slate-200 rounded-full" src={closeButton} alt="close" /></button
    >
    Add new friend :
    <input
      placeholder="Type username..."
      class="input-field"
      bind:value={addFriend}
    />
    <button
      on:click={handleAddFriend}
      class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
      >Send invitation</button
    >
    <div class="friend_msg">{friendMsg}</div>
  </div>
</div>
