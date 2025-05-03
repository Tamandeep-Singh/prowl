import "../css/SignUp.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ProwlLogo from "../assets/logo.png";
import WarningIcon from "../assets/warning.png";
import LoginService from "../services/login_service";
import AppUtils from "../utils";

const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupError, setSignupError] = useState("");

    useEffect(() => {
        if (AppUtils.isUserLoggedIn() === true) {
            return navigate("/dashboard");
        };
    }, [navigate]);

    const onUserSignup = async (event) => {
        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        
        if (emailInput.checkValidity() && passwordInput.checkValidity() && usernameInput.checkValidity()) {
            event.preventDefault();
            const response = await LoginService.performUserSignup(username, email, password); 
            if (response.result.error) {
                setSignupError(response.result.error);
            }
            else {
                AppUtils.setAuthToken(response.result.accessToken);
                AppUtils.setRefreshToken(response.result.refreshToken);
                navigate("/dashboard");
            };
        }; 
    };

    return <div id="signup-wrapper">
        <div className="signup">
            <p>Sign up to continue to the Prowl Hub</p>
            <form>
                <div className="signup__logo">
                        <img id="inner-logo" src={ProwlLogo} alt="Prowl Logo"/>
                        <span>Prowl</span>
                    </div>
                    <input type="text" id="username" required placeholder="Username" value={username} onChange={({ target }) => setUsername(target.value)}/>
                    <input type="email" id="email" required placeholder="Email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                    <input type="password" id="password" required placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                    <input id="signup-btn" type="submit" value="Sign Up" onClick={onUserSignup}></input>
                </form>
                {signupError && <div className="signup__error">
                    <img id="warning-icon" src={WarningIcon} alt="Warning Icon"/>
                    <span>Error: {signupError}</span>
                </div>
                }
        </div>
        </div>
};

export default SignUp;