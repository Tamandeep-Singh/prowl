import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../css/LoginPage.css";
import ProwlLogo from "../assets/logo.png";
import WarningIcon from "../assets/warning.png";
import LoginService from "../services/login_service";
import AppUtils from "../utils";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const location = useLocation();
    const [externalError, setExternalError] = useState(location.state?.externalError || "");

    useEffect(() => {
        if (AppUtils.isUserLoggedIn() === true) {
            return navigate("/dashboard");
        }
    }, [navigate]);

    const onUserLogin = async (event) => {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        setExternalError("");
        
        if (emailInput.checkValidity() && passwordInput.checkValidity()) {
            event.preventDefault();
            const response = await LoginService.performUserLogin(email, password); 
            if (response.result.error) {
                setLoginError(response.result.error);
            }
            else {
                AppUtils.setAuthToken(response.result.accessToken);
                AppUtils.setRefreshToken(response.result.refreshToken);
                navigate("/dashboard");
            };
        }; 
    };

    return <div id="login-wrapper">
        <div className="login">
            <p>Sign in to continue to Prowl Prototype</p>
            <form>
                <div className="login__logo">
                        <img id="inner-logo" src={ProwlLogo} alt="Prowl Logo"/>
                        <span>Prowl</span>
                    </div>
                    <input type="email" id="email" required placeholder="Email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                    <input type="password" id="password" required placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                    <input id="login-btn" type="submit" value="Login" onClick={onUserLogin}></input>
                </form>
                {loginError && <div className="login__error">
                    <img id="warning-icon" src={WarningIcon} alt="Warning Icon"/>
                    <span>Error: {loginError}</span>
                </div>
                }
                {externalError && <div className="login__error">
                    <img id="warning-icon" src={WarningIcon} alt="Warning Icon"/>
                    <span>Error: {externalError}</span>
                </div>
                }
        </div>
        </div>
};

export default LoginPage;