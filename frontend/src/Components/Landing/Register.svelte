<script>
  import axios from "axios";
  import "../../styles/login.css";
  import { push } from "svelte-spa-router";

  let username = "";
  let usernameMsg = "";
  let email = "";
  let emailMsg = "";
  let password = "";
  let passwordMsg = "";
  let confirmPassword = "";
  let confirmPasswordMsg = "";
  let finalMsg = "";

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

  function handleSubmit(e) {
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
      .post(
        "http://" + process.env.URI + ":" + process.env.API_PORT + "/register",
        {
          username: username,
          email: email,
          password: password,
        }
      )
      .then(
        (res) => {
          const msg = res.data.message;
          if (msg === "OK") push("/login");
          else finalMsg = msg;
        },
        (error) => {
          finalMsg = "API not connected";
        }
      );
  }
</script>

<div class="login">
  <form>
    <h2 class="title">Sign Up</h2>
    Already a member ?
    <a id="sign-up-btn" href="/#/login"> Sign In </a>
    Username :
    <input
      class="input-field"
      type="text"
      placeholder="Username"
      on:change={(e) => {
        username = e.target.value;
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
      on:change={(e) => {
        email = e.target.value;
        verifyEmail();
      }}
    />
    {@html emailMsg}
    Password :
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      on:change={(e) => {
        password = e.target.value;
        verifyPassword();
      }}
    />
    {@html passwordMsg}
    Confirm password :
    <input
      class="input-field"
      type="password"
      placeholder="Password"
      on:change={(e) => {
        confirmPassword = e.target.value;
        verifyConfirmPassword();
      }}
    />
    {@html confirmPasswordMsg}
    <button type="submit" on:click={handleSubmit}> Sign Up ! </button>
    <h3 style="color: #FF4136">{finalMsg}</h3>
  </form>
</div>
