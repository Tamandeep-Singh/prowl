const express = require("express");
const emailRouter = express.Router();
const emailController = require("../controllers/email_service_controller");

emailRouter.post("/test", async (req, res) => {
    const { emailRecipient, emailSubject, emailBody } = req.body;
    const result = await emailController.sendEmailAlert(emailRecipient, emailSubject, emailBody);
    return res.status(200).json({result});
});

module.exports = emailRouter;