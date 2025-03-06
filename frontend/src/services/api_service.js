import axios from "axios";
const endpoint = "http://localhost:4500";

export default class ApiService {
    static post = async (url, postData) => {
        try {
            const response = await axios.post(`${endpoint}${url}`, postData);
            return response.data;
        }
        catch (error) {
            return { result: { success: false, error: "Unable to connect to the API" } };
        };
    };

    static get = async (url) => {
        try {
            const response = await axios.get(`${endpoint}${url}`);
            return response.data;
        }
        catch (error) {
            return { result: { success: false,  error: "Unable to connect to the API"} };
        };
    };
};



