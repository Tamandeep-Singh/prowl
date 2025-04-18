import "../css/Navbar.css";
import ProwlLogo from "../assets/logo.png";
import { useNavigate  } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogoutRoute = async (event) => {
        event.preventDefault();
        window.localStorage.clear();
        navigate("/login");
    };

    return <header>
        <nav className="navbar__nav">
            <div>
                <img id="prowl-logo" src={ProwlLogo} alt="Prowl Logo"/>
                <span>Prowl</span>
            </div>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/alerts">Alerts</a></li>
                <li><a href="/endpoint-rtc">Endpoint RTC</a></li>
                <li><a href="/integrations">Integrations</a></li>
                <li><a href="/account">Account</a></li>
                <li><a href="/logout" onClick={handleLogoutRoute}>Logout</a></li>
            </ul>
        </nav>
    </header>
};

export default Navbar;