import ApiService from "./api_service";

export default class NetworkConnectionService {
    static fetchNetworkConnections = async () => {
        const response = await ApiService.get("/api/network_connections/list");
        return response;
    };
};