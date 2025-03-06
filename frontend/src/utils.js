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
};