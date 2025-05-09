const express = require("express");
const alertRouter = express.Router();
const alertController = require("../controllers/alert_controller");

alertRouter.get("/list", async (req, res) => {
    const alerts = await alertController.getAlertsList();
    return res.status(200).json({result: alerts});
});

module.exports = alertRouter;