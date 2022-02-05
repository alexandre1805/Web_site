import '../styles/login.css'

function login(props) {
  return (
    <div className="login">
      <form>
        <h2 className='title'>Sign In</h2>
        <input className="input-field" type="text" placeholder="Username" />
        <input className="input-field" type="password" placeholder="Password" />
        <button>Login</button>
      </form>
      <h3>New here ?</h3>
      <p>Don't hesitate to sign up to access to website !</p>
      <a id="sign-up-btn" href="/">
        Sign Up
      </a>
    </div>
  );
}

export default login;
