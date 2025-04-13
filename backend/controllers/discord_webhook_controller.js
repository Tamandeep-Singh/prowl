const axios = require("axios");

class DiscordWebhookController {
    static sendChannelAlert = async (alert) => {
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
};

module.exports = DiscordWebhookController;