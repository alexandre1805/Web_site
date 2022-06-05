import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import { useState } from "react";

function Navbar(props) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleOpenNotif = (e) => {
    setNotificationOpen(!notificationOpen);
  };

  if (props.isLogged)
    return (
      <header className="navigation">
        <h2>LOGO</h2>
        <div className="loged">
          <img src="/notification.png" alt="notif" onClick={handleOpenNotif} />
          <h3>Welcome {props.username} !</h3>
          {notificationOpen && <div className="Notification"></div>}
        </div>
      </header>
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
