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

    static sendDiscordAlert = async (payload) => {
        try {
            await axios.post(process.env.PROWL_ALERTS_DISCORD_WEBHOOK_URL, payload);
            return { success: true, message: "[Discord-Alert]: successfully sent"};
        }
        catch (error) {
            return { success: false, error}
        };
    };

    static sendEmailAlert = async (payload) => {
        try {
            const emailDetails = await service.sendMail({
                from: "Prowl Alerts <prowl.alerts@gmail.com>",
                to: payload.recipient,
                subject: payload.subject,
                html: payload.body
            });
            return { success: true, message: emailDetails };
        }
        catch (error) {
            return { success: false, error };
        };
    };
    
    static sendAlert = async (alert, recipients) => {
        await this.sendDiscordAlert({embeds: [{
            title: `[${alert.host_name}] Automated Alert on: ${new Date(Date.now()).toLocaleString("en-GB")}`,
            description: `Detection message: **${alert.message}**`,
            color: 0x00b0f4,
            url: "http://192.168.1.79:3000/dashboard/alerts",
            fields: [{ name: "Severity", value: alert.severity},{ name: "Score", value: alert.score}, { name: "Triggered By", value: alert.trigger}],
            footer: { text: "Sent via Prowl API (Security Controller)" },
            timestamp: new Date().toISOString()}
        ]});
        recipients.forEach(async (email) => {
            await this.sendEmailAlert({
                recipient: email,
                subject: `Automated Prowl Alert for [${alert.host_name}] on: ${new Date(Date.now()).toLocaleString("en-GB")}`,
                body: `<div style="background-color:#3A3F4B; color:white; font-family:Arial; padding: 30px; border-radius: 8px; width: 700px; margin: auto;">
                        <h1 style="margin-top: 0; font-size: 23px;">Critical Alert detected on [${alert.host_name}]</h1>
                        <p style="font-size: 16px;">Detection Message: <strong>${alert.message}</strong></p>
                        <table style="width: 100%; margin-top:17px;">
                            <tr>
                                <td style="padding: 10px 0px; font-weight:bold;">Severity: <span style="font-weight:normal;">${alert.severity}</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0px; font-weight:bold;">Score: <span style="font-weight:normal;">${alert.score}</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0px; font-weight:bold;">Triggered By: <span style="font-weight:normal;">${alert.trigger}</span></td>
                            </tr>
                        </table>
                        <div style="text-align: center; margin-bottom: 20px; margin-top: 20px;">
                            <a href="http://192.168.1.79:3000/dashboard/alerts" style="padding: 10px; display: inline-block; width: 200px; background-color: rgb(25, 118, 210); color: white; text-decoration:none; border-radius:6px; font-weight:bold;">Go to Alerts</a>
                        </div>
                        <p style="margin-top: 30px; font-size: 13px; color: #ccc;">Sent via Prowl API (Security Controller)</p>
                     </div>`
            });
        });
    };

    static getAlertsList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(Alert, fields);
        return result;
    };
};

module.exports = AlertController;