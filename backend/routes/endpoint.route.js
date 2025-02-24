const express = require("express");
const endpointRouter = express.Router();

endpointRouter.post("/register", async (req, res) => {
    return res.status(200).json({});
});

endpointRouter.get("/list", async (req, res) => {
    return res.status(200).json({});
});

endpointRouter.post("/ingest", async (req, res) => {
    return res.status(200).json({});
});

module.exports = endpointRouter;