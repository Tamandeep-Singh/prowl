const axios = require("axios");
require("dotenv").config();

class VirusTotalController {
    static getFileReport = async (sha256_hash) => {
        try {
            const response = await axios.get(`https://www.virustotal.com/api/v3/files/${sha256_hash}`, {headers: {
                "x-apikey": process.env.VIRUSTOTAL_API_KEY
            }});
            if (response.data.error) {
                return "N/A";
            };
            const statsArray = [];
            const votesArray = [];
            for (const [key, value] of Object.entries(response.data.data.attributes.last_analysis_stats)) {
                statsArray.push(`${key}:${value}`);
            };
            for (const [key, value] of Object.entries(response.data.data.attributes.total_votes)) {
                votesArray.push(`${key}:${value}`);
            };
            const stats = statsArray.join(", ");
            const votes = votesArray.join(", ");
            return `[Votes]: ${votes} and [Stats]: ${stats}`;
        }
        catch (error) {
            return "N/A";
        };
    };
};

module.exports = VirusTotalController;