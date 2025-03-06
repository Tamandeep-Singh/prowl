const express = require("express");
require("dotenv").config();
const endpointRouter = express.Router();
const endpointController = require("../controllers/endpoint_controller");
const ingestController = require("../controllers/ingest_controller");

endpointRouter.post("/link", async (req, res) => {
    const result = await endpointController.createEndpoint(req.body.endpoint);
    return res.status(200).json({result});
});

endpointRouter.get("/list", async (req, res) => {
    const endpoints = await endpointController.getEndpointList();
    return res.status(200).json({result: endpoints});
});

endpointRouter.post("/ingest", async (req, res) => {
    if (req.query.agent_api_key === process.env.AGENT_API_KEY) {
        const result = await ingestController.handleIngestType(req);
        return res.status(200).json({result});
    };
    return res.status(400).json({ result: { success: false, error: "Invalid Agent API Key provided"}});
});

module.exports = endpointRouter;