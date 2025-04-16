const nodemailer = require("nodemailer");
require("dotenv").config();

const service = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "prowl.alerts@gmail.com",
        pass: process.env.PROWL_ALERTS_GMAIL_APP_PASSWORD
    }
});

class EmailServiceController {
    static sendEmailAlert = async (emailRecipient, emailSubject, emailBody) => {
        try {
            const emailDetails = await service.sendMail({
                from: "Prowl Alerts <prowl.alerts@gmail.com>",
                to: emailRecipient,
                subject: emailSubject,
                text: emailBody
            });
            return { success: true, message: emailDetails };
        }
        catch (error) {
            return { success: false, error };
        };
    };
};

module.exports = EmailServiceController;