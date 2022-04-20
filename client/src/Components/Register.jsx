import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register(props) {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [finalMsg, setFinalMsg] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const verifyUsername = () => {
    if (username === "")
      return (
        <li style={{ color: "#FF4136" }}>Please put a non-empty username</li>
      );
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const validEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  const verifyEmail = () => {
    if (!email.match(validEmail))
      return (
        <li style={{ color: "#FF4136" }}>Please put a non-empty username</li>
      );
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const validPassword =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  const verifyPassword = () => {
    if (!password.match(validPassword))
      return (
        <div style={{ color: "#FF4136" }}>
          <li>At least 8 characters</li>
          <li>One special character</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One number</li>
        </div>
      );
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const verifyConfirmPassword = () => {
    if (password !== confirmPassword)
      return <li style={{ color: "#FF4136" }}>Passwords must correspond</li>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      username === "" ||
      !email.match(validEmail) ||
      !password.match(validPassword) ||
      password !== confirmPassword
    )
      return;
    axios
      .post("http://localhost:4000/register", {
        username: username,
        email: email,
        password: password,
      })
      .then(
        (res) => {
          const msg = res.data.message;
          if (msg === "OK")
            navigate("/login");
          else
            setFinalMsg(msg);
        },
        (error) => {
          setFinalMsg("API not connected");
        }
      );
  };

  return (
    <div className="login">
      <form>
        <h2 className="title">Sign Up</h2>
        Already a member ?
        <a id="sign-up-btn" href="/login">
          Sign In
        </a>
        Username :
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          onChange={handleUsername}
        />
        {verifyUsername()}
        E-mail :
        <input
          className="input-field"
          type="text"
          placeholder="E-mail"
          onChange={handleEmail}
        />
        {verifyEmail()}
        Password :
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          onChange={handlePassword}
        />
        {verifyPassword()}
        Confirm password :
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          onChange={handleConfirmPassword}
        />
        {verifyConfirmPassword()}
        <button type="submit" onClick={handleSubmit}>
          Sign Up !
        </button>
        <h3 style={{ color: "#FF4136" }}>{finalMsg}</h3>
      </form>
    </div>
  );
}

export default Register;
