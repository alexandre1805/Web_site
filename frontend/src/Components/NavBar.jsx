import { Link } from "react-router-dom";
import "../styles/NavBar/NavBar.css";
import "../styles/NavBar/Notification.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar(props) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (props.username === "") return;
    axios
      .get("http://localhost:4000/getNotif", {
        params: { username: props.username },
        withCredentials: true,
      })
      .then((res) => {
        const notifications = res.data;
        setNotifications(notifications);
      });
  }, [props.username]);

  const handleOpenNotif = (e) => {
    setNotificationOpen(!notificationOpen);
  };

  const handleAddFriend = (e) => {
    console.log("test");
    props.socket.emit("accept invitation", e);
    setNotifications(notifications.filter((elm) => elm._id !== e._id));
  };

  if (props.isLogged)
    return (
      <div className="navigation">
        <h2>LOGO</h2>
        <div className="loged">
          <img src="/notification.png" alt="notif" onClick={handleOpenNotif} />
          <h3>Welcome {props.username} !</h3>
          {notificationOpen && (
            <div className="Notification">
              {notifications.map((e) => {
                if (e.type === "add_friend")
                  return (
                    <div className="add_friend" key={e._id}>
                      <span>{e.message}</span>
                      <button
                        onClick={() => {
                          handleAddFriend(e);
                        }}
                      >
                        ADD
                      </button>
                      <button>DELETE</button>
                    </div>
                  );
                return <></>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  else
    return (
      <header className="navigation">
        <h2>LOGO</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>Contact</li>
          <li>
            <Link to="/dashboard">Log In</Link>
          </li>
        </ul>
      </header>
    );
}

export default Navbar;
