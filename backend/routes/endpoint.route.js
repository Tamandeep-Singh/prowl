const express = require("express");
const endpointRouter = express.Router();
const endpointController = require("../controllers/endpoint_controller");
const ingestController = require("../controllers/ingest_controller");
const authMiddleware = require("../middleware/auth");

endpointRouter.post("/link", async (req, res) => {
    const result = await endpointController.createEndpoint(req.body.endpoint);
    return res.status(200).json({result});
});

endpointRouter.get("/list", authMiddleware.checkAccessToken, async (req, res) => {
    const endpoints = await endpointController.getEndpointList();
    return res.status(200).json({result: endpoints});
});

endpointRouter.post("/ingest", async (req, res) => {
    const result = await ingestController.handleIngestType(req);
    return res.status(200).json({result});
});

module.exports = endpointRouter;