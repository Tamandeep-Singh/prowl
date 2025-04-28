import ApiService from "./api_service";

export default class EventsService {
    static fetchEventsCount = async () => {
        const response = await ApiService.get("/api/events/count");
        return response;
    };
};