import "../css/Navbar.css";
import ProwlLogo from "../assets/logo.png";
import AppUtils from "../utils";
import { useNavigate  } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginRoute = async (event) => {
        event.preventDefault();
        navigate("/login");
    };

    const handleLogoutRoute = async (event) => {
        event.preventDefault();
        window.localStorage.clear();
        navigate("/login");
    };

    const handleDashboardRoute = async (event) => {
        event.preventDefault();
        navigate("/dashboard");
    };

    const handleToolsRoute = async (event) => {
        event.preventDefault();
        navigate("/tools");
    };

    
    return <header>
        <nav className="navbar__nav">
            <div>
                <img id="prowl-logo" src={ProwlLogo} alt="Prowl Logo"/>
                <span>Prowl</span>
            </div>
            <ul>
                {AppUtils.isUserLoggedIn() === true ? <li><button onClick={handleLogoutRoute}>Logout</button></li> : <li><button onClick={handleLoginRoute}>Login</button></li>}
                <li><button onClick={handleDashboardRoute}>Dashboard</button></li>
                <li><button onClick={handleToolsRoute}>Tools</button></li>
            </ul>
        </nav>
    </header>
};

export default Navbar;