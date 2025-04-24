import ApiService from "./api_service";

export default class ProwlUsersService {
    static fetchProwlUsers = async () => {
        const response = await ApiService.get("/api/users/list");
        return response;
    };

    static updateProwlUser = async (user) => {
        const response = await ApiService.post(`/api/users/update/${user.id}`, { user: { role: user.role, email: user.email }});
        return response;
    };

    static changeUserPassword = async (user) => {
        const response = await ApiService.post("/api/users/password/change", { user: { userId: user.userId, newPassword: user.newPassword }});
        return response;
    };
};