<script>
  import axios from "axios";
  import NavBar from "./Components/NavBar.svelte";
  import { socket, username } from "./store";

  import Router, { push } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import About from "./Components/About.svelte";
  import Home from "./Components/Home.svelte";
  import Register from "./Components/Register.svelte";
  import Login from "./Components/Login.svelte";
  import Dashboard from "./Components/Dashboard.svelte";
  import io from "socket.io-client";

  let logged = false;
  let usernameValue = "";
  username.subscribe((val) => (usernameValue = val));
  async function fetchLogin() {
    try {
      let response = await axios.get(
        "http://" +
          process.env.URI +
          ":" +
          process.env.API_PORT +
          "/verifToken",
        { withCredentials: true }
      );
      if (response.data.message === "OK") {
        logged = true;
        username.set(response.data.username);
        push("/dashboard");
      }
    } catch {}

    if (username !== "")
      socket.set(
        io("http://" + process.env.URI + ":" + process.env.API_PORT, {
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
  }}
  on:conditionsFailed={conditionsFailed}
/>
