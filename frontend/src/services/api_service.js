import axios from "axios";
import AppUtils from "../utils";
const endpoint = "http://localhost:4500";

export default class ApiService {
    static refreshToken = async () => {
        try {
            const response = await axios.post(`${endpoint}/api/users/refresh/token`, {
                refreshToken: AppUtils.getRefreshToken()
            });
            if (response.data.error) {
                return false;
            };
            AppUtils.setAuthToken(response.data.result.accessToken);
            AppUtils.setRefreshToken(response.data.result.refreshToken);
            return true;
        }
        catch (error) {
            return false;
        };
    }; 

    static post = async (url, postData) => {
        try {
            const response = await axios.post(`${endpoint}${url}`, postData, {
                headers: {
                    "Authorization": `Bearer ${AppUtils.getAuthToken()}`
                }
            });
            if (response.data.result.error) {
                if (response.data.result.invalid) {
                    const didTokenRefresh = await this.refreshToken();
                    if (!didTokenRefresh) {
                        return { result: { success: false, error: "Unable to consume refresh token", invalid: true}}
                    };
                    const retry = await axios.post(`${endpoint}${url}`, postData, {
                        headers: {
                            "Authorization": `Bearer ${AppUtils.getAuthToken()}`
                        }
                    });
                    return retry.data;

                };
            };
            return response.data;
        }
        catch (error) {
            return { result: { success: false, error: "Unable to connect to the API", debug: error} };
        };
    };

    static get = async (url) => {
        try {
            const response = await axios.get(`${endpoint}${url}`, {
                headers: {
                    "Authorization": `Bearer ${AppUtils.getAuthToken()}`
                }
            });
            if (response.data.result.error) {
                if (response.data.result.invalid) {
                    const didTokenRefresh = await this.refreshToken();
                    if (!didTokenRefresh) {
                        return { result: { success: false, error: "Unable to consume refresh token", invalid: true}}
                    };
                    const retry = await axios.get(`${endpoint}${url}`, {
                        headers: {
                            "Authorization": `Bearer ${AppUtils.getAuthToken()}`
                        }
                    });
                    return retry.data;

                };
            };
            return response.data;
        }
        catch (error) {
            return { result: { success: false,  error: "Unable to connect to the API", debug: error} };
        };
    };

    static ping = async () => {
        const response = await ApiService.get("/ping");
        return response;
    };
};



