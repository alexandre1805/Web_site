<script>
  import "../../styles/Games/Connection_Box.css";
  import { socket } from "../../store";
  export let setOpenDialogBox;
  let socketValue;
  socket.subscribe((val) => (socketValue = val));
  let message = "Waiting for informations...";

  socketValue.on("update", (game) => {
    console.log(game);
    if (game.type === "Connection_status") {
      if (game.message !== "") message = game.message;
      else setOpenDialogBox(false);
    }
  });
</script>

<div class="Dialog_box">
  <div class="Container">
    {message}
    <button>Leave</button>
  </div>
</div>
