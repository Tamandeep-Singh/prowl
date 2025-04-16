const EmailServiceController = require("./email_service_controller");
const DiscordWebhookController = require("./discord_webhook_controller");

class AlertController {
    static sendAlert = async (alert) => {
        const discordResponse = await DiscordWebhookController.sendChannelAlert(alert);
        const emailResponse = await EmailServiceController.sendEmailAlert(alert.email.recipient, alert.email.subject, alert.email.body);
    };
};

module.exports = AlertController;