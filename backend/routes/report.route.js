const express = require("express");
const reportRouter = express.Router();
const googleGeminiController = require("../controllers/google_gemini_controller");
const reportController = require("../controllers/report_controller");

reportRouter.post("/generate", async (req, res) => {
    const result = await googleGeminiController.generateAlertReport(req.body.alert);
    return res.status(200).json({result});
});

reportRouter.get("/list", async (req, res) => {
    const reports = await reportController.getReportsList();
    return res.status(200).json({result: reports});
});

reportRouter.get("/:id", async (req, res) => {
    const result = await reportController.getReportByAlertID(req.params.id);
    return res.status(200).json({result});
});

module.exports = reportRouter;