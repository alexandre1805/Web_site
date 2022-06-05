import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Dashboard/Room.css";

function Room(props) {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);

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

  const handleCreateRoom = (e) => {
    if (search === "") return;
    e.preventDefault();

    props.socket.emit("create room", {
      search: search,
      username: props.username,
    });
    setSearch("");
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
        <img src="/plus.png" alt="plus" onClick={handleCreateRoom} />
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
