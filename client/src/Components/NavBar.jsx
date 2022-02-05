import '../styles/NavBar.css'

function Navbar(props) {
    return (
        <header className="navigation">
        <h2>LOGO</h2>
        <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact</li>
            <li id='login'>Log In</li>
        </ul>
        </header>
    )
}

export default Navbar