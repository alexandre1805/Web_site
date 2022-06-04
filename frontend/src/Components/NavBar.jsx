import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function Navbar(props) {
  if (props.isLogged)
    return (
      <header className="navigation">
        <h2>LOGO</h2>
        <div className="loged">
          <img src="/notification.png" alt="notif" />
          <h3>Welcome {props.username} !</h3>
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
