const express = require("express");
const processRouter = express.Router();
const processController = require("../controllers/process_controller");

processRouter.get("/list", async (req, res) => {
    const processes = await processController.getProcessList();
    return res.status(200).json({result: processes});
});

processRouter.get("/count", async (req, res) => {
    const result = await processController.getProcessesCount();
    return res.status(200).json({result});
});


module.exports = processRouter;