import { useState, useEffect } from "react";
import axios from "axios";

function NewRoom(props) {
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/getFriends", { withCredentials: true })
      .then((res) => {
        const friends = res.data.friends;
        setFriendList(friends);
      });
  }, []);

  return (
    <div className="Dialog_box">
      <div className="Container">
        <img
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
              <li className="room" key={e._id}>
                <img src="/room_image.png" alt="user_image" />
                <span>{e.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NewRoom;
