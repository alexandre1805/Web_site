import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Dashboard/Message.css";

function Messages(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  //get all messages form API
  useEffect(() => {
    if (props.currentRoom === "") return;
    axios
      .get(
        "http://localhost:4000/getMsg",
        { params: { room: props.currentRoom } },
        { withCredentials: true }
      )
      .then((res) => {
        const messages = res.data.messages;
        setMessages(messages);
      });
  }, [props.currentRoom]);

  // get one message from socket
  useEffect(() => {
    if (props.socket === null) return;
    props.socket.on("new message", (elt) => {
      console.log(elt);
      if (elt.room === props.currentRoom)
        setMessages((oldMessages) => [...oldMessages, elt]);
    });
  }, [props.currentRoom, props.socket]);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    var args = {
      client: props.username,
      msg: message,
      room: props.currentRoom,
    };
    props.socket.emit("message", args);
    setMessage("");
  };

  return (
    <div className="Message">
      <div className="Header">
        <img src="/room_image.png" alt="user_image" />
        <div className="Container">{props.currentRoom}</div>
      </div>
      <ul className="chat">
        {messages.map((e) => {
          return (
            <li
              className={`msg ${e.user === props.username ? "me" : "other"}`}
              key={e._id}
            >
              <div className="header">{e.user}</div>
              <div className="content">{e.message}</div>
            </li>
          );
        })}
      </ul>
      <div className="sending">
        <input
          type="text"
          placeholder="New message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <img
          src="/send_button.png"
          onClick={handleSubmitMessage}
          alt="send_button"
        ></img>
      </div>
    </div>
  );
}

export default Messages;
