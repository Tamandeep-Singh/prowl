import ApiService from "./api_service";

export default class ReportsService {
    static fetchReports = async () => {
        const response = await ApiService.get("/api/reports/list");
        return response;
    };

    static fetchReportByAlertID = async (alertId) => {
        const response = await ApiService.get(`/api/reports/${alertId}`);
        return response;
    };

    static generateReport = async (alert) => {
        const response = await ApiService.post("/api/reports/generate", { alert });
        return response;
    };
};