import ApiService from "./api_service";

export default class OauthService {
    static getGithubRepos = async () => {
        const response = await ApiService.getWithCredentials("/api/oauth/github/repos");
        return response;
    };
};