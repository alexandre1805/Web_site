import { useEffect, useState } from "react";

function Newfriend(props) {
  const [addFriend, setAddFriend] = useState("");
  const [friendMsg, setFriendMsg] = useState("");

  useEffect(() => {
    if (props.socket === null) return;
    props.socket.on("add Friend return", (msg) => {
      setFriendMsg(msg);
    });
  }, [props.socket]);

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriend === "") return;
    props.socket.emit("add Friend", addFriend);
    setAddFriend("");
  };

  return (
    <div className="Dialog_box">
      <div className="Container">
        <img
          className="close_button"
          src="/plus.png"
          alt="plus"
          onClick={() => {
            props.setOpenDialogBox(false);
            setFriendMsg("");
          }}
        ></img>
        Add new friend :
        <input
          placeholder="Add friend..."
          value={addFriend}
          onChange={(e) => {
            setAddFriend(e.target.value);
          }}
        ></input>
        <button onClick={handleAddFriend}>Send invitation</button>
        {friendMsg}
      </div>
    </div>
  );
}

export default Newfriend;
