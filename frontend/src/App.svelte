<script>
  import "./styles/index.css";
  import axios from "axios";
  import NavBar from "./Components/Landing/NavBar.svelte";
  import { socket, username } from "./store";
  import Router, { push } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import io from "socket.io-client";

  import About from "./Components/Landing/About.svelte";
  import Home from "./Components/Landing/Home.svelte";
  import Register from "./Components/Landing/Register.svelte";
  import Login from "./Components/Landing/Login.svelte";
  import Dashboard from "./Components/Dashboard/Dashboard.svelte";
  import TicTacToe from "./Components/Games/Tic-tac-toe/Tic-tac-toe.svelte";
  import Connect_4 from "./Components/Games/Connect_4.svelte";

  let logged = false;
  let usernameValue = "";
  username.subscribe((val) => (usernameValue = val));
  async function fetchLogin() {
    try {
      let response = await axios.get(
        "http://" + window.location.host + "/api/verifToken",
        { withCredentials: true }
      );
      if (response.data.message === "OK") {
        logged = true;
        username.set(response.data.username);
        push("/dashboard");
      }
    } catch {}

    if (usernameValue !== "")
      socket.set(
        io("http://" + window.location.host, {
          path: "/api/socket.io/",
          query: {
            username: usernameValue,
          },
        })
      );
  }
  fetchLogin();

  function conditionsFailed(e) {
    if (e.detail.route === "/") push("/home");
    else push("/login");
  }
</script>

<NavBar />
<div style="margin-top: 60px;">
  <Router
    routes={{
      "/": wrap({
        component: Dashboard,
        conditions: [() => logged],
      }),
      "/home": Home,
      "/about": About,
      "/dashboard": wrap({
        component: Dashboard,
        conditions: [() => logged],
      }),
      "/register": Register,
      "/login": wrap({
        component: Login,
        props: { fetchLogin: () => fetchLogin() },
      }),
      "/tic-tac-toe": TicTacToe,
      "/connect-4": Connect_4,
    }}
    on:conditionsFailed={conditionsFailed}
  />
</div>
