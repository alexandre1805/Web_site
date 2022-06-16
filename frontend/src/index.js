import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import Navbar from "./Components/NavBar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import About from "./Components/About";
import Dashboard from "./Components/Dashboard";
import "./styles/index.css";
import io from "socket.io-client";

function App(props) {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        await axios
          .get("http://localhost:4000/verifToken", { withCredentials: true })
          .then((response) => {
            if (response.data.message === "OK") {
              setIsLogged(true);
              setUsername(response.data.username);
              setSocket(
                io("http://localhost:4000", {
                  query: {
                    username: username,
                  },
                })
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchLogin();
  }, [isLogged]);

  return (
    <BrowserRouter>
      <Navbar isLogged={isLogged} username={username} socket={socket} />
      <Routes>
        <Route
          path="/"
          element={isLogged ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            !isLogged ? (
              <Login SetIsLogged={setIsLogged} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            isLogged ? (
              <Dashboard Username={username} socket={socket} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
