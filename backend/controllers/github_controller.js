require("dotenv").config();
const axios = require("axios");
const path = require('path');
const fs = require("fs");
const { execSync } = require("child_process");

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

    static deleteRepoCloneDirectory = async (path) => {
        try {
            fs.rmSync(path, { recursive: true, force: true });
        }
        catch (error) {
            console.log(`[Github_Controller::deleteRepoCloneDirectory]: Unable to delete ${path}!`);
        };
    };

    static analyseRepoWithGitLeaks = (path) => {
        try {
            execSync(`gitleaks detect --source ${path} --report-format json --report-path ${path}/gitleaks_report.json`, { stdio: "pipe" });
            return [{"message": "No sensitive information or leaks found!"}];
        }
        catch (error) {
            if (error.status === 1) {
                const data = fs.readFileSync(`${path}/gitleaks_report.json`, 'utf-8');
                const report = JSON.parse(data);
                return report;
            };
            return "Unable to analyse Repo!";
        };
    };

    static cloneAndAnalyseRepo = (token, repo) => {
        const cloneUrl = `https://${token}@github.com/${repo.owner}/${repo.name}.git`;
        const clonePath = path.resolve(process.cwd(), `${process.env.PROWL_GITHUB_CLONE_PATH}/${repo.name}`);
        try {
            execSync(`git clone ${cloneUrl} ${clonePath}`, { stdio: ["ignore", "ignore", "ignore"] });
            const gitLeaksReport = this.analyseRepoWithGitLeaks(clonePath);
            this.deleteRepoCloneDirectory(clonePath);
            return { success: true, repo, report: [{gitLeaksReport}]};
        }
        catch(error) {
            return { success: false, error: `failed to clone and analyse ${repo.name}`, debug: error};
        };
    };
};

module.exports = GithubController;