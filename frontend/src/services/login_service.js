import ApiService from "./api_service";

export default class LoginService {
    static performUserLogin = async (email, password) => {
        const response = await ApiService.post("/api/users/login", { email, password });
        return response;
    };

    static performUserSignup = async (username, email, password) => {
        const response = await ApiService.post("/api/users/register", { user: { username, email, password }});
        return response;
    };
};
