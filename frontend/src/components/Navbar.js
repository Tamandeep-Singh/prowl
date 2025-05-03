import "../css/Navbar.css";
import ProwlLogo from "../assets/logo.png";
import { useNavigate  } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogoutRoute = async (event) => {
        event.preventDefault();
        window.localStorage.clear();
        document.cookie = "github_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // clear Github Token cookie
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
                <li><a href="/endpoint-rtc">Endpoint RTC</a></li>
                <li><a href="/logout" onClick={handleLogoutRoute}>Logout</a></li>
            </ul>
        </nav>
    </header>
};

export default Navbar;