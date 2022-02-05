import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./Components/NavBar";
import Register from "./Components/Register";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <Register />
  </React.StrictMode>,
  document.getElementById("root")
);
