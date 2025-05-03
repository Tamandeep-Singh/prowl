const express = require("express");
const oauthRouter = express.Router();
const githubController = require("../controllers/github_controller");
require("dotenv").config();

oauthRouter.get("/github", async (req, res) => {
    return res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo&redirect_uri=http://192.168.1.79:4500/api/oauth/github/callback`);
});

oauthRouter.get("/github/callback", async (req, res) => {
    const result = await githubController.getAccessToken(req.query.code);
    if (!result.error) {
        res.cookie("github_token", result.accessToken);
    };
    return res.redirect(`${process.env.PROWL_FRONTEND_HUB}/dashboard/integrations/github`);
});

oauthRouter.get("/github/repos", async (req, res) => {
    const token = req.cookies.github_token;
    if (!token) {
        return res.status(200).json({result: { success: false, error: "No Github Access Token provided"}});
    };
    const result = await githubController.getRepos(token);
    return res.status(200).json({result});
});

oauthRouter.post("/github/repo/analyse", (req, res) => {
    const token = req.cookies.github_token;
    if (!token) {
        return res.status(200).json({result: { success: false, error: "No Github Access Token provided"}});
    };
    const result = githubController.cloneAndAnalyseRepo(token, req.body.repo);
    return res.status(200).json({result});
});

module.exports = oauthRouter;