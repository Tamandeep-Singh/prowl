import "../css/NotFound.css";
import ProwlLogo from "../assets/logo.png";
import WarningIcon from "../assets/warning.png";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleOnDashboardClick = async (event) => {
        event.preventDefault();
        return navigate("/dashboard")
    };

    return <div id="notfound-wrapper">
    <div className="notfound">
        <p>404 - Not Found</p>
        <div className="prowl__logo">
                <img id="inner-logo" src={ProwlLogo} alt="Prowl Logo"/>
                <span>Prowl</span>
        </div>
        <div className="notfound__error">
            <img id="warning-icon" src={WarningIcon} alt="Warning Icon"/>
            <span>The page you requested was not found</span>
        </div>
        <button id="dashboard-btn" onClick={handleOnDashboardClick}>Return to Dashboard</button>
    </div>
    </div>
};

export default NotFound;