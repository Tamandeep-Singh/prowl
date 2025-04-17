import ApiService from "./api_service";

export default class FileService {
    static fetchFiles = async () => {
        const response = await ApiService.get("/api/files/list");
        return response;
    };
};