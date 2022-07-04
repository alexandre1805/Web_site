import { useState, useEffect } from "react";
import axios from "axios";

function NewRoom(props) {
  const [friendList, setFriendList] = useState([]);
  const [listNewRoom, setListNewRoom] = useState([]);
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
    if (state) console.log(state);
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
          }}
        ></img>
        Create room by adding your friends :
        <ul>
          {friendList.map((e) => {
            return (
              <li className="room" key={e._id} onClick={handleClickFriend}>
                <input type="checkbox"></input>
                <img src="/room_image.png" alt="user_image" />
                <span>{e.username}</span>
              </li>
            );
          })}
        </ul>
        <button>Create Room</button>
      </div>
    </div>
  );
}

export default NewRoom;
