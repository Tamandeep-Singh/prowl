const express = require("express");
const consoleRouter = express.Router();
const ConsoleController = require("../controllers/console_controller");

consoleRouter.post("/connect", async (req, res) => {
    const result = await ConsoleController.connectToEndpoint(req);
    return res.status(200).json({result});
});

consoleRouter.post("/command", async (req, res) => {
   const result = await ConsoleController.executeCommand(req);
   return res.status(200).json({result})
});

module.exports = consoleRouter;