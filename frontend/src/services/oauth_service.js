import ApiService from "./api_service";

export default class OauthService {
    static getGithubRepos = async () => {
        const response = await ApiService.getWithCredentials("/api/oauth/github/repos");
        return response;
    };

    static analyseGithubRepo = async (repo) => {
        const response = await ApiService.postWithCredentials("/api/oauth/github/repo/analyse", { repo });
        return response;
    };
};