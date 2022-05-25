import { useState, useEffect } from "react";
import axios from "axios";

function Room(props) {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://localhost:4000/getRooms",
        { withCredentials: true }
      )
      .then((res) => {
        const rooms = res.data.rooms;
        setRooms(rooms);
        props.setRoom(rooms[0].name)
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
  }

  return (
    <div className="Room">
      <div className="Search">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="SearchBar"
        ></input>
        <button onClick={handleCreateRoom}>Search</button>
      </div>
      Rooms:
      <ul>
        {rooms.map((e) => {
          return (
            <li className="room" key={e._id}>
              <img src="/room_image.png" alt="user_image" />
              <button className="content" onClick={handleChangeRoom}>{e.name}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Room;
