const { GoogleGenAI }  = require("@google/genai");
const ReportController = require("./report_controller");
require("dotenv").config();

const googleAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

class GoogleGeminiController {
    static generateAlertReport = async (alert) => {
        try {
            const config = {
                model: "gemini-2.0-flash",
                contents: `Analyse this alert and provide a detailed summary on any potential Indicators of Compromise (IOCs) or Indicators of Attacks (IOAs) and if the designated severity is accurate. Also provide potential remediation strategies or actions to mitigate this threat on the associated endpoint via SSH. Be concise (so that the summary fits an applicable User Interface) and do not use any markdown elements, the output will be rendered in paragraph tags for HTML, so be considerate. Alert: ${JSON.stringify(alert)}`
            };
            const response = await googleAI.models.generateContent(config);
            const report = await ReportController.insertReport({
                alert_id: alert.alert_id,
                host_name: alert.host_name,
                trigger: alert.trigger,
                summary: response.text
            });
            return report;
        }
        catch (error) {
            return { success: false, error: "Unable to dynamically analyse the alert!", debug: error};
        };
    };
};

module.exports = GoogleGeminiController;