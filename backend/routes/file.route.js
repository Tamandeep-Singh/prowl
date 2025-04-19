const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/file_controller");

fileRouter.get("/list", async (req, res) => {
    const files = await fileController.getFileList();
    return res.status(200).json({result: files});
});

fileRouter.get("/count", async (req, res) => {
    const result = await fileController.getFilesCount();
    return res.status(200).json({result});
});


module.exports = fileRouter;