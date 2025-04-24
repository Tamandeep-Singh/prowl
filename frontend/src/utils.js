import { jwtDecode } from "jwt-decode";

export default class AppUtils {
    static getAuthToken = () => {
        return window.localStorage.getItem("authToken");
    };

    static getRefreshToken = () => {
        return window.localStorage.getItem("refreshToken");
    };

    static setAuthToken = (authToken) => {
        window.localStorage.setItem("authToken", authToken);
    };

    static setRefreshToken = (refreshToken) => {
        window.localStorage.setItem("refreshToken", refreshToken);
    };

    static isUserLoggedIn = () => {
        return this.getAuthToken() !== null;
    };

    static isUserAdmin = () => {
        try {
            const authToken = this.getAuthToken();
            if (authToken !== null) {
                const payload = jwtDecode(authToken);
                return payload.role === "administrator";
            }
            return false;
        }
        catch (error) {
            console.log("An error occurred when decoding the JWT Token:", error);
            return false;
        }
    };

    static getTokenPayload = () => {
        try {
            const authToken = this.getAuthToken();
            if (authToken !== null) {
                const payload = jwtDecode(authToken);
                return payload;
            }
            return null;
        }
        catch (error) {
            console.log("An error occurred when decoding the JWT Token:", error);
            return null;
        }
    };

};