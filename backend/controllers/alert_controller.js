require("dotenv").config();
const axios = require("axios");
const nodemailer = require("nodemailer");
const Alert = require("../models/Alert");
const MongoUtilities = require("../utils/mongo.utils");

const service = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "prowl.alerts@gmail.com",
        pass: process.env.PROWL_ALERTS_GMAIL_APP_PASSWORD
    }
});

class AlertController {
    static insertAlert = async (alert) => {
        const result = await MongoUtilities.insertDocument(Alert, alert);
        return result;
    };

    static sendDiscordAlert = async (alert) => {
        try {
            await axios.post(process.env.PROWL_ALERTS_DISCORD_WEBHOOK_URL, {
                content: alert
            });
            return { success: true, message: "alert successfully sent"};
        }
        catch (error) {
            return { success: false, error}
        };
    };

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
    
    static sendAlert = async (alert, emailConfig) => {
        const discordResponse = await this.sendDiscordAlert(alert);
        const emailResponse = await this.sendEmailAlert(emailConfig.recipient, emailConfig.subject, emailConfig.body);
    };

    static getAlertsList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(Alert, fields);
        return result;
    };

    static getAlertsCount = async () => {
        const result = await MongoUtilities.countDocumentsInCollection(Alert);
        return result;
    };
};

module.exports = AlertController;