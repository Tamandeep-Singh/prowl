const express = require("express");
const eventsRouter = express.Router();
const eventsController = require("../controllers/events_controller");

eventsRouter.get("/count", async (req, res) => {
    const result = await eventsController.getDocumentsCountInCollections();
    return res.status(200).json({result});
});


module.exports = eventsRouter;