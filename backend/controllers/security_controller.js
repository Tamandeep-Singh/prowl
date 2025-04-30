const AlertController = require("./alert_controller");
const rules = require("../config/security_rules.config");
const { LRUCache } = require("lru-cache");
const crypto = require("crypto");

const buffer = new LRUCache({
    max: 10000,
    ttl: 1000 * 15
});

setInterval(() => {
    buffer.purgeStale();
}, 20000);


class SecurityController {
    static createAlertHash = (alert) => {
        const hash = crypto.createHash("sha1").update(alert.artifact_id).update(alert.trigger).digest("hex");
        return hash;
    };

    static raiseAlert = async (alert) => {
        // only insert the alert and send notifications if the alert is "fresh"
        const hash = this.createAlertHash(alert);
        if (!buffer.has(hash)) {
            buffer.set(hash, null);
            await AlertController.insertAlert(alert);
            if (alert.severity === "High") {
                await AlertController.sendAlert(alert, rules.notification_emails);
            };
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
                    score = 10; // significant threat score due to the user or process being blacklisted
                    return;
                };

                // Check Whitelist 
                const whitelist = rules.whitelist.processes.map(filter => new RegExp(filter, "i"));
                const isProcessWhitelisted = whitelist.some(filter => filter.test(process.command));
                if (isProcessWhitelisted) {
                    return; // since the process is whitelisted, do not analyse or raise an alert
                };

                const matchedRules = [];

                rules.processes.forEach(rule => {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(process[rule.field])) {
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

                // Check Blacklist first
                const blacklist = rules.blacklist.files.map(filter => new RegExp(filter, "i"));
                const isFileBlacklisted = blacklist.some(filter => filter.test(file.file_path));
                if (isFileBlacklisted) {
                    score = 10; // significant threat score due to the file being blacklisted
                    return;
                };

                // Check Whitelist 
                const whitelist = rules.whitelist.files.map(filter => new RegExp(filter, "i"));
                const isFileWhitelisted = whitelist.some(filter => filter.test(file.file_path));
                if (isFileWhitelisted) {
                    return; // since the file is whitelisted, do not analyse or raise an alert
                };

                const matchedRules = [];

                rules.files.forEach(rule => {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(file[rule.field])) {
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
                }
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

                // Check Blacklist first
                const blacklist = rules.blacklist.network_connections.map(filter => new RegExp(filter, "i"));
                const isConnectionBlacklisted = blacklist.some(filter => filter.test(connection.remote_address_ip));
                if (isConnectionBlacklisted) {
                    score = 10; // significant threat score due to the network connection being blacklisted
                    return;
                };

                // Check Whitelist 
                const whitelist = rules.whitelist.network_connections.map(filter => new RegExp(filter, "i"));
                const isConnectionWhitelisted = whitelist.some(filter => filter.test(connection.remote_address_ip));
                if (isConnectionWhitelisted) {
                    return; // since the network connection is whitelisted, do not analyse or raise an alert
                };

                const matchedRules = [];

                rules.network_connections.forEach(rule => {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(connection[rule.field])) {
                        score += rule.score;
                        matchedRules.push(rule);
                    };
                });

                if (matchedRules.length !== 0) {
                    const message = matchedRules.map(rule => rule.message).join(" ");
                    const detection = matchedRules.map(rule => rule.detection).join(", ");
                    await this.raiseAlert({
                        endpoint_id: connection.endpoint_id,
                        artifact_id: connection._id,
                        artifact_collection: "network_connections",
                        detection,
                        host_name: connection.host_name,
                        trigger: `${connection.remote_address_ip}:${connection.remote_address_port}`,
                        score,
                        severity: await this.getSeverity(score),
                        message
                    });
                }
                
            };
        }
        catch (error) {
            console.log(`[Security_Controller]: An error has occurred when analysing network connections. Debug: ${error}`);
        };
    };
};

module.exports = SecurityController;