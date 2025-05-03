require("dotenv").config();
const axios = require("axios");
const simpleGit = require('simple-git');
const path = require('path');

class GithubController {
    static getAccessToken = async (code) => {
        try {
            const response = await axios.post("https://github.com/login/oauth/access_token", { 
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            }, {
                headers: {
                    "Accept": "application/json"
                }
            });
            const token = response.data.access_token;
            return { success: true, accessToken: token};
        }
        catch (error) {
            return { success: false, error: "Unable to retrieve the Github access token!", debug: error};
        };
    };

    static getRepos = async (token) => {
        try {
            const response = await axios.get("https://api.github.com/user/repos", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return { success: true, repos: response.data};
        }
        catch (error) {
            return { success: false, error: "Unable to fetch github repos!", debug: error};
        };
    };

    static getUserDetails = async (token) => {
        try {
            const response = await axios.get("https://api.github.com/user", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return { success: true, user: response.data};
        }
        catch (error) {
            return { success: false, error: "Unable to fetch details for the github user!", debug: error};
        };
    };

    static cloneRepo = async (token, repo) => {
        const cloneUrl = `https://${token}@github.com/${repo.owner}/${repo.name}.git`;
        const clonePath = path.resolve(process.cwd(), `${process.env.PROWL_GITHUB_CLONE_PATH}/${repo.name}`);
        const git = simpleGit();
        try {
            await git.clone(cloneUrl, clonePath);
            return { success: true, message: `Cloned ${repo.name} to ${clonePath}`};
        }
        catch(error) {
            return { success: false, error: `failed to clone ${repo.name}`, debug: error};
        };
    };
};

module.exports = GithubController;