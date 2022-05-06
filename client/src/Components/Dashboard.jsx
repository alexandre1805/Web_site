import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

function Dashboard(props) {
  const [addFriendField, setAddFriendField] = useState("");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setSocket(socketIOClient.connect("http://localhost:4000"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/getMsg", { withCredentials: true })
      .then((res) => {
        const messages = res.data.messages;
        setMessages(messages);
      });
  }, []);

  useEffect(() => {
    if (socket === null) return;
    socket.on("new message", (elt) => {
      console.log(elt);
      setMessages((oldMessages) => [...oldMessages, elt]);
    });
  }, [socket]);

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriendField === "") return;
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    var args = { client: props.Username, msg: message };
    socket.emit("message", args);
    setMessage("");
  };

  return (
    <div className="Dashboard">
      Welcome {props.Username} !
      <div className="Friends">
        Find your friends here :<ul></ul>
        <div>
          Add a Friend:
          <input
            type="text"
            placeholder="Add a friend..."
            onChange={(e) => {
              setAddFriendField(e.target.value);
            }}
          />
          <button onClick={handleAddFriend}>Add</button>
        </div>
      </div>
      <div className="Messages">
        Messages:
        <div>
          {messages.map((e) => {
            return <div key={e._id}>{e.user + ": " + e.message}</div>;
          })}
        </div>
        <input
          type="text"
          placeholder="New message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={handleSubmitMessage}>Send</button>
        <ul></ul>
      </div>
    </div>
  );
}

export default Dashboard;
