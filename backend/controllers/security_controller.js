const AlertController = require("./alert_controller");
const rules = require("../config/security_rules.config");

class SecurityController {
    static raiseAlert = async (alert) => {
        await AlertController.insertAlert(alert);
        if (alert.severity === "High") {
            await AlertController.sendAlert(alert, {
                recipient: "<Insert Email Address Here>",
                subject: `[${alert.host_name}]: Critical Alert at ${new Date(Date.now()).toLocaleString("en-GB")}`,
                body: `Automated Alert: Severity: ${alert.severity}, Score: ${alert.score}, Category: ${alert.artifact_collection}, Trigger: ${alert.trigger}, Host: ${alert.host_name}, Detection Message: ${alert.message}`
            });
        };
    };

    static getSeverity = async (score) => {
        let severity = "Low";
        if (score >= 5) { severity = "Medium" }
        if (score >= 8) { severity = "High" }
        return severity;
    };

    static analyseProcesses = async (processes) => {
        try {
            for (const process of processes) {
                let score = 0;

                // Check Blacklist first
                const blacklist = rules.blacklist.processes.map(filter => new RegExp(filter, "i"));
                const isProcessBlacklisted = blacklist.some(filter => filter.test(process.command));
                if (isProcessBlacklisted || rules.blacklist.users.includes(process.user)) {
                    score = 10;
                    return;
                };

                // Check Whitelist 
                const whitelist = rules.whitelist.processes.map(filter => new RegExp(filter, "i"));
                const isProcessWhitelisted = whitelist.some(filter => filter.test(process.command));
                if (isProcessWhitelisted || rules.whitelist.users.includes(process.user)) {
                    return;
                };

                const matchedRules = [];

                rules.processes.forEach(rule => {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(process.command)) {
                        score += rule.score;
                        matchedRules.push(rule);
                    };
                });

                if (matchedRules.length !== 0) {
                    const message = matchedRules.map(rule => rule.message).join(" ");
                    const detection = matchedRules.map(rule => rule.detection).join(", ");
                    await this.raiseAlert({
                        endpoint_id: process.endpoint_id,
                        artifact_id: process._id,
                        artifact_collection: "processes",
                        detection,
                        host_name: process.host_name,
                        trigger: process.command,
                        score,
                        severity: await this.getSeverity(score),
                        message
                    });
                }
            };
        }
        catch (error) {
            console.log(`[Security_Controller]: An error has occurred when analysing processes. Debug: ${error}`);
        };
    };

    static analyseFiles = async (files) => {
        try {
            for (const file of files) {
                let score = 0;

                const matchedRules = [];

                rules.files.forEach(rule => {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(file.command)) {
                        score += rule.score;
                        matchedRules.push(rule);
                    };
                });

                if (matchedRules.length !== 0) {
                    const message = matchedRules.map(rule => rule.message).join(" ");
                    const detection = matchedRules.map(rule => rule.detection).join(", ");
                    await this.raiseAlert({
                        endpoint_id: file.endpoint_id,
                        artifact_id: file._id,
                        artifact_collection: "files",
                        detection,
                        host_name: file.host_name,
                        trigger: file.file_path,
                        score,
                        severity: await this.getSeverity(score),
                        message
                    });
                };
            };
        }
        catch (error) {
            console.log(`[Security_Controller]: An error has occurred when analysing files. Debug: ${error}`);
        };
    };

    static analyseNetworkConnections = async (connections) => {
        try {
            for (const connection of connections) {
                let score = 0;
                
            };
        }
        catch (error) {
            console.log(`[Security_Controller]: An error has occurred when analysing network connections. Debug: ${error}`);
        };
    };
};

module.exports = SecurityController;