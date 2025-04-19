const express = require("express");
const networkConnectionRouter = express.Router();
const networkConnectionController = require("../controllers/network_connection_controller");

networkConnectionRouter.get("/list", async (req, res) => {
    const connections = await networkConnectionController.getNetworkConnectionsList();
    return res.status(200).json({result: connections});
});

networkConnectionRouter.get("/count", async (req, res) => {
    const result = await networkConnectionController.getNetworkConnectionsCount();
    return res.status(200).json({result});
});


module.exports = networkConnectionRouter;