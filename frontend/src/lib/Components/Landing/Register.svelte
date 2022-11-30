<script lang="ts">
  import axios from "axios";
  import { push } from "svelte-spa-router";

  let username: string = "";
  let usernameMsg: string = "";
  let email: string = "";
  let emailMsg: string = "";
  let password: string = "";
  let passwordMsg: string = "";
  let confirmPassword: string = "";
  let confirmPasswordMsg: string = "";
  let finalMsg: string = "";

  const validEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  function verifyEmail() {
    if (!email.match(validEmail))
      emailMsg =
        '<li style="color: #FF4136">Please put a valid email adress</li>';
    else emailMsg = "";
  }

  const validPassword =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  function verifyPassword() {
    if (!password.match(validPassword))
      passwordMsg =
        '<div style="color: #FF4136"> \
          <li>At least 8 characters</li> \
          <li>One special character</li> \
          <li>One uppercase letter</li> \
          <li>One lowercase letter</li> \
          <li>One number</li> \
        </div>';
    else passwordMsg = "";
  }

  function verifyConfirmPassword() {
    if (password !== confirmPassword)
      confirmPasswordMsg =
        '<li style="color: #FF4136">Passwords must correspond</li>';
    else confirmPasswordMsg = "";
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    if (
      username === "" ||
      !email.match(validEmail) ||
      !password.match(validPassword) ||
      password !== confirmPassword
    ) {
      verifyEmail();
      verifyPassword();
      verifyConfirmPassword();
      return;
    }

    axios
      .post("http://" + window.location.host + "/api/register", {
        username: username,
        email: email,
        password: password,
      })
      .then(
        (res) => {
          const msg = res.data.message;
          if (msg === "OK") push("/login");
          else finalMsg = msg;
        },
        () => {
          finalMsg = "API not connected";
        }
      );
  }
</script>

<div class="w-full h-full flex items-center justify-center">
  <form
    class="flex flex-col border-2 border-black rounded-xl justify-center text-center p-2 md:text-2xl"
  >
    <h2 class="flex justify-center font-bold text-blue-500 text-3xl p-5">
      Sign Up
    </h2>
    Already a member ?
    <button
      class="text-white bg-blue-500 rounded-full w-fit p-2 mx-auto mb-4 hover:bg-slate-500"
      on:click={() => {
        push("/login");
      }}>Sign In</button
    >
    Username :
    <input
      class="input-field"
      type="text"
      placeholder="Username"
      bind:value={username}
      on:change={() => {
        if (username === "")
          usernameMsg =
            '<li style="color: #FF4136">Please put a non-empty username</li>';
        else usernameMsg = "";
      }}
    />
    {@html usernameMsg}
    E-mail :
    <input
      class="input-field"
      type="text"
      placeholder="E-mail"
      bind:value={email}
      on:change={verifyEmail}
    />
    {@html emailMsg}
    Password :
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      bind:value={password}
      on:change={verifyPassword}
    />
    {@html passwordMsg}
    Confirm password :
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      bind:value={confirmPassword}
      on:change={verifyConfirmPassword}
    />
    {@html confirmPasswordMsg}
    <button
      type="submit"
      class="text-white bg-blue-500 rounded-full p-1 my-3 hover:bg-slate-500"
      on:click={handleSubmit}
    >
      Sign Up !
    </button>
    <h3 style="color: #FF4136">{finalMsg}</h3>
  </form>
</div>
