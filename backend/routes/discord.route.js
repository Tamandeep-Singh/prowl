const express = require("express");
const discordRouter = express.Router();
const discordController = require("../controllers/discord_webhook_controller");

discordRouter.post("/test", async (req, res) => {
    const result = await discordController.sendChannelAlert(req.body.alert);
    return res.status(200).json({result});
});

module.exports = discordRouter;