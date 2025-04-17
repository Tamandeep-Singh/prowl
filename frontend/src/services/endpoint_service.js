import ApiService from "./api_service";

export default class EndpointService {
    static connectToEndpoint = async (host_id, host_ip, username, password) => {
        const response = await ApiService.post("/api/console/connect", { host_id, host_ip, username, password });
        return response;
    };

    static sendCommand = async (host_id, command) => {
        const response = await ApiService.post("/api/console/command", { host_id, command });
        return response;
    };

    static fetchEndpoints = async () => {
        const response = await ApiService.get("/api/endpoints/list");
        return response;
    };

    static disconnectEndpoint = async (host_id) => {
        const response = await ApiService.post("/api/console/disconnect", { host_id });
        return response;
    };

};