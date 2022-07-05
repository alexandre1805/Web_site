import { useState, useEffect } from "react";
import axios from "axios";

function NewRoom(props) {
  const [friendList, setFriendList] = useState([]);
  const [listNewRoom, setListNewRoom] = useState([props.username]);
  const [finalMsg, setFinalMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/getFriends", { withCredentials: true })
      .then((res) => {
        const friends = res.data.friends;
        setFriendList(friends);
      });
  }, []);

  const handleClickFriend = (e) => {
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
    if (state) setListNewRoom((oldList) => [...oldList, obj.textContent]);
    else setListNewRoom(listNewRoom.filter((elm) => elm !== obj.textContent));
  };

  const handleNewRoom = (e) => {
    if (listNewRoom.length === 1) return;
    props.socket.emit("new Room", listNewRoom);
  };

  useEffect(() => {
    if (props.socket === null) return;
    props.socket.on("new Room return", (msg) => {
      setFinalMsg(msg);
    });
  }, [props.socket]);

  return (
    <div className="Dialog_box">
      <div className="Container">
        <img
          className="close_button"
          src="/plus.png"
          alt="plus"
          onClick={() => {
            props.setOpenDialogBox(false);
          }}
        ></img>
        Create room by adding your friends :
        <ul>
          {friendList.map((e) => {
            return (
              <li
                className="room"
                key={e._id}
                id={e._id}
                onClick={handleClickFriend}
              >
                <input type="checkbox"></input>
                <img src="/room_image.png" alt="user_image" />
                <span>{e.username}</span>
              </li>
            );
          })}
        </ul>
        <button onClick={handleNewRoom}>Create Room</button>
        {finalMsg}
      </div>
    </div>
  );
}

export default NewRoom;
