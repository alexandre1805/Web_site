import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

function Navbar(props) {
    return (
        <header className="navigation">
        <h2>LOGO</h2>
        <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About Us</Link></li>
            <li>Contact</li>
            <li><Link to='/login'>Log In</Link></li>
        </ul>
        </header>
    )
}

export default Navbar