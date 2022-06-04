import { useState, useEffect } from "react";
import io from "socket.io-client";
import Messages from "./Dashboard/Message";
import Room from "./Dashboard/Room";
import "../styles/Dashboard/Dashboard.css";

function Dashboard(props) {
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("");

  //create a socket and connect to API
  useEffect(() => {
    setSocket(
      io("http://localhost:4000", {
        query: {
          username: props.Username,
        },
      })
    );
  }, [props.Username]);

  // <Friend username={props.Username} />
  return (
    <div className="Dashboard">
      <Room
        username={props.Username}
        socket={socket}
        setRoom={setCurrentRoom}
      />
      <Messages
        socket={socket}
        currentRoom={currentRoom}
        username={props.Username}
      />
    </div>
  );
}

export default Dashboard;
