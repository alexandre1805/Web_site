<script>
  import { push } from "svelte-spa-router";
  import axios from "axios";
  import { onMount } from "svelte";
  export let fetchLogin;

  let username = "";
  let password = "";
  let finalMsg = "";

  function handleSubmit() {
    if (username === "" || password === "") return;
    axios
      .post(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/login",
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        const msg = res.data.message;

        if (msg === "OK") {
          await fetchLogin();
          push("/dashboard");
        } else finalMsg = msg;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data === undefined) finalMsg = "Internal Error";
          else finalMsg = error.response.data.message;
        }
      });
  }
</script>

<div class="login">
  <form>
    <h2 class="title">Sign In</h2>
    <input
      class="input-field"
      type="text"
      placeholder="Username"
      on:change={(e) => {
        username = e.target.value;
      }}
    />
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      on:change={(e) => {
        password = e.target.value;
      }}
    />
    <button on:click|preventDefault={handleSubmit}>Login</button>
    <h3 style="color: #FF4136">{finalMsg}</h3>
  </form>
  <h3>New here ?</h3>
  <p>Don't hesitate to sign up to access to website !</p>
  <a id="sign-up-btn" href="/register"> Sign Up </a>
</div>
