import axios from "axios";
import ApiService from "./api_service";

export default class LoginService {
    static performUserLogin = async (email, password) => {
        const response = await ApiService.post("/api/users/login", { email, password });
        return response;
    };
};
