import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login(props) {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [finalMsg, setFinalMsg] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "" || password === "") return;
    axios
      .post("http://localhost:4000/login", {
        username: username,
        password: password,
      }, { withCredentials: true })
      .then(
        (res) => {
          const msg = res.data.message;
          
          if (msg === "OK") navigate("/dashboard");
        },
        (error) => {
          setFinalMsg("API not connected");
        }
      );
  };

  return (
    <div className="login">
      <form>
        <h2 className="title">Sign In</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          onChange={handleUsername}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          onChange={handlePassword}
        />
        <button onClick={handleSubmit}>Login</button>
        <h3 style={{ color: "#FF4136" }}>{finalMsg}</h3>
      </form>
      <h3>New here ?</h3>
      <p>Don't hesitate to sign up to access to website !</p>
      <a id="sign-up-btn" href="/register">
        Sign Up
      </a>
    </div>
  );
}

export default Login;
