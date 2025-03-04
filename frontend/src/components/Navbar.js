import "../css/Navbar.css";
import ProwlLogo from "../assets/logo.png";

const Navbar = () => {
    return <header>
        <nav className="navbar__nav">
            <div>
                <img id="prowl-logo" src={ProwlLogo} alt="Prowl Logo"/>
                <span>Prowl</span>
            </div>
            <ul>
                <li><a href="/login">Login</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/tools">Tools</a></li>
            </ul>
        </nav>
    </header>
};

export default Navbar;