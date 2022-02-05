import { useState } from "react";
import "../styles/login.css";

function Register(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  return (
    <div className="login">
      <form>
        <h2 className="title">Sign Up</h2>
        Already a member ?
        <a id="sign-up-btn" href="/">
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
        <button type="submit">Sign Up !</button>
      </form>
    </div>
  );
}

export default Register;
