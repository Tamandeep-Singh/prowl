const express = require("express");
const fileRouter = express.Router();
const fileController = require("../controllers/file_controller");

fileRouter.get("/list", async (req, res) => {
    const files = await fileController.getFileList();
    return res.status(200).json({result: files});
});


module.exports = fileRouter;