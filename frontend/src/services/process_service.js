import ApiService from "./api_service";

export default class ProcessService {
    static fetchProcesses = async () => {
        const response = await ApiService.get("/api/processes/list");
        return response;
    };

};