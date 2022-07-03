import { useState } from "react";
import "../../styles/Dashboard/Dashboard.css";
import Messages from "./Message";
import Room from "./Room";

function Dashboard(props) {
  const [currentRoom, setCurrentRoom] = useState("");

  return (
    <div className="Dashboard">
      <Room
        username={props.Username}
        socket={props.socket}
        setRoom={setCurrentRoom}
      />
      <Messages
        socket={props.socket}
        currentRoom={currentRoom}
        username={props.Username}
      />
    </div>
  );
}

export default Dashboard;
