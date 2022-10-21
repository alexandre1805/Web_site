<script>
  import { push } from "svelte-spa-router";
  import axios from "axios";
  export let fetchLogin;

  let username = "";
  let password = "";
  let finalMsg = "";

  function handleSubmit() {
    console.log(username);
    if (username === "" || password === "") return;
    axios
      .post(
        "http://" + window.location.host + "/api/login",
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

<div class="w-full h-full flex flex-col items-center justify-center">
  <form
    class="flex flex-col border-2 border-black rounded-xl justify-center text-center p-2 md:text-2xl"
  >
    <h2 class="flex justify-center font-bold text-blue-500 text-3xl p-5">
      Sign In
    </h2>
    <input
      class="input-field"
      type="text"
      placeholder="Username"
      bind:value={username}
    />
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      bind:value={password}
    />
    <button
      class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
      on:click|preventDefault={handleSubmit}>Login</button
    >
    <h3 style="color: #FF4136">{finalMsg}</h3>
  </form>
  <h3 class="font-bold mt-4">New here ?</h3>
  <p>Don't hesitate to sign up to access to website !</p>
  <button
    class="text-white bg-blue-500 rounded-full w-fit p-2 mx-auto mb-4 hover:bg-slate-500"
    on:click={() => {
      push("/register");
    }}>Sign Up</button
  >
</div>
