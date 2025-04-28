const express = require("express");
const networkConnectionRouter = express.Router();
const networkConnectionController = require("../controllers/network_connection_controller");

networkConnectionRouter.get("/list", async (req, res) => {
    const connections = await networkConnectionController.getNetworkConnectionsList();
    return res.status(200).json({result: connections});
});

module.exports = networkConnectionRouter;