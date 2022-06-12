import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Dashboard/Room.css";

function Room(props) {
  const [search, setSearch] = useState("");
  const [addFriend, setAddFriend] = useState("");
  const [friendMsg, setFriendMsg] = useState("");
  const [rooms, setRooms] = useState([]);
  const [openDialogBox, setOpenDialogBox] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/getRooms", { withCredentials: true })
      .then((res) => {
        const rooms = res.data.rooms;
        setRooms(rooms);
        props.setRoom(rooms[0].name);
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

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriend === "") return;
    axios
      .post(
        "http://localhost:4000/addFriend",
        { username: props.username, friend: addFriend },
        { withCredentials: true }
      )
      .then(
        (res) => {
          if (res.msg === "OK") {
            setAddFriend("");
            setOpenDialogBox(false);
          } else setFriendMsg(res.msg);
        },
        (error) => {
          setFriendMsg(error.message);
        }
      );
  };

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
          src="/plus.png"
          alt="plus"
          onClick={() => {
            if (!openDialogBox) setOpenDialogBox(true);
          }}
        />
        {openDialogBox && (
          <div className="Dialog_box">
            <div className="Container">
              <img
                src="/plus.png"
                alt="plus"
                onClick={() => {
                  if (openDialogBox) setOpenDialogBox(false);
                }}
              ></img>
              Add new friend :
              <input
                placeholder="Add friend..."
                onChange={(e) => {
                  setAddFriend(e.target.value);
                }}
              ></input>
              <button onClick={handleAddFriend}>Send invitation</button>
              {friendMsg}
            </div>
          </div>
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
