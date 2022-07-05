import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Dashboard/Room.css";
import Newfriend from "./New_friend";
import NewRoom from "./New_room";

function Room(props) {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [openDialogBoxFriend, setOpenDialogBoxFriend] = useState(false);
  const [openDialogBoxRoom, setOpenDialogBoxRoom] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/getRooms", { withCredentials: true })
      .then((res) => {
        const rooms = res.data.rooms;
        setRooms(rooms);
        if (rooms.length !== 0) props.setRoom(rooms[0].name);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.username]);

  useEffect(() => {
    if (props.socket === null) return;
    props.socket.on("new room", (elt) => {
      console.log(elt);
      setRooms((oldRooms) => [...oldRooms, elt]);
    });
  }, [props.socket]);

  const handleChangeRoom = (e) => {
    props.setRoom(e.target.innerText);
  };

  return (
    <div className="Room">
      <div className="Search">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="SearchBar"
          placeholder="Search..."
        ></input>
        <img
          src="/message.png"
          alt="plus"
          onClick={() => {
            if (!openDialogBoxRoom) setOpenDialogBoxRoom(true);
          }}
        />
        <img
          src="/plus.png"
          alt="plus"
          onClick={() => {
            if (!openDialogBoxFriend) setOpenDialogBoxFriend(true);
          }}
        />
        {openDialogBoxFriend && (
          <Newfriend
            setOpenDialogBox={setOpenDialogBoxFriend}
            socket={props.socket}
          />
        )}

        {openDialogBoxRoom && (
          <NewRoom
            setOpenDialogBox={setOpenDialogBoxRoom}
            username={props.username}
            socket={props.socket}
          />
        )}
      </div>
      <ul>
        {rooms.map((e) => {
          return (
            <li className="room" key={e._id} onClick={handleChangeRoom}>
              <img src="/room_image.png" alt="user_image" />
              <span>{e.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Room;
