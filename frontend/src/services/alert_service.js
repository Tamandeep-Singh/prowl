import ApiService from "./api_service";

export default class AlertService {
    static fetchAlerts = async () => {
        const response = await ApiService.get("/api/alerts/list");
        return response;
    };
};