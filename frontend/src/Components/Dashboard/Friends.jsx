import { useState, useEffect } from "react";
import axios from "axios";

function Friend(props) {
  const [addFriendField, setAddFriendField] = useState("");
  const [friends, setFriend] = useState("");
  const [final_msg, setFinalMsg] = useState("");

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriendField === "") return;
    axios
      .post(
        "http://localhost:4000/addFriend",
        {
          username: props.username,
          friend: addFriendField,
        },
        { withCredentials: true }
      )
      .then(
        (res) => {
          const msg = res.data.message;
          if (msg === "OK") setAddFriendField("");
          else setFinalMsg(msg);
        },
        (error) => {
          setFinalMsg("API not connected");
        }
      );
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/getFriends", { withCredentials: true })
      .then((res) => {
        const friends = res.data.friends;
        setFriend(friends);
      });
  }, []);

  return (
    <div className="Friends">
      Find your friends here :<ul></ul>
      <div>
        Add a Friend:
        <input
          type="text"
          placeholder="Add a friend..."
          onChange={(e) => {
            setAddFriendField(e.target.value);
          }}
        />
        <button onClick={handleAddFriend}>Add</button>
        <div className="final_msg">{final_msg}</div>
      </div>
    </div>
  );
}

export default Friend;
