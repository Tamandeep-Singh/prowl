import  React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppUtils from "../utils";

// The base code of this file is taken from the website below and the PawCare (ECS506U Software Engineering Project) that I did in Year 2 (this file was my personal contribution)
// Base Code: https://levelup.gitconnected.com/implement-authentication-and-protect-routes-in-react-135a60b1e16f  

const AuthenticatedRoute = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthToken = () => {
        if (AppUtils.getAuthToken() === null) {
            setIsAuthenticated(false);
            
            //redirect back to login if there is no JWT token (hence no login)
            return navigate("/login");
        }
        setIsAuthenticated(true);

    };
    useEffect(() => {
        checkAuthToken();
    }, [isAuthenticated])

    // if the user is logged in, then render the component passed in via props
    return <React.Fragment>
        {isAuthenticated ? props.children : null}
    </React.Fragment>
    
    
};

export default AuthenticatedRoute;