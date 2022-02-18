import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
function Dashboard(props) {
  const [addFriendField, setAddFriendField] = useState("");
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setSocket(socketIOClient.connect("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if(socket === null)
      return
    socket.on("new message", (elt) => {
      setMessages(oldMessages => [...oldMessages, elt])
    })

  }, [socket])

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriendField === "") return;
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if(message === "") return;
    socket.emit("message", message)
    setMessage("");

  }

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
              return(<div key={e}>{e}</div>);
              })
            }
        </div>
        <input
            type="text"
            placeholder="New message..."
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
            />
            <button onClick={handleSubmitMessage}>Send</button>
        <ul></ul>
      </div>
    </div>
  );
}

export default Dashboard;
