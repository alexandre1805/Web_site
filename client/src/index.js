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

function App(props) {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        await axios
          .get("http://localhost:4000/verifToken", { withCredentials: true })
          .then((response) => {
            if (response.data.message === "OK") {
              setIsLogged(true);
              setUsername(response.data.username);
            }
            setLoading(false);
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

  if (loading) return <h1>Loading...</h1>;

  return (
    <BrowserRouter>
      <Navbar />
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
              <Dashboard Username={username} />
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
