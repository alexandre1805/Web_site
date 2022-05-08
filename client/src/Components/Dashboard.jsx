import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Messages from "./Dashboard/Message";
import Friend from "./Dashboard/Friends";
import Room from "./Dashboard/Room";
import "../styles/Dashboard/Dashboard.css";

function Dashboard(props) {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("General");

  //create a socket and connect to API
  useEffect(() => {
    setSocket(socketIOClient.connect("http://localhost:4000"));
  }, []);

  return (
    <div className="Dashboard">
      <div className="Menu">
        <Friend />
        <Room />
      </div>
      <Messages
        socket={socket}
        currentRoom={currentRoom}
        username={props.Username}
      />
    </div>
  );
}

export default Dashboard;
