import { useState, useEffect } from "react";
import axios from "axios";

function Messages(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  //get all messages form API
  useEffect(() => {
    axios
      .get("http://localhost:4000/getMsg", { withCredentials: true })
      .then((res) => {
        const messages = res.data.messages;
        setMessages(messages);
      });
  }, []);

  // get one message from socket
  useEffect(() => {
    if (props.socket === null) return;
    props.socket.on("new message", (elt) => {
      console.log(elt);
      setMessages((oldMessages) => [...oldMessages, elt]);
    });
  }, [props.socket]);

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
        <button onClick={handleSubmitMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messages;