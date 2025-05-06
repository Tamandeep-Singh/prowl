const AlertController = require("./alert_controller");
const rules = require("../config/security_rules.config");
const { LRUCache } = require("lru-cache");
const crypto = require("crypto");
const VirusTotalController = require("./virustotal_controller");

const buffer = new LRUCache({
    max: 10000,
    ttl: 1000 * 60 * 3
});

setInterval(() => {
    buffer.purgeStale();
}, 60000);

class SecurityController {
    static createAlertHash = (alert) => {
        const hash = crypto.createHash("sha1").update(String(alert.artifact_id)).update(alert.trigger).digest("hex");
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

                // Check Whitelist first
                const isProcessWhitelisted = rules.whitelist.processes.some(rule => new RegExp(rule.filter, "i").test(process[rule.field]));
                if (isProcessWhitelisted) {
                    continue; // since the process is whitelisted, do not analyse or raise an alert and continue to the next process
                };

                // Check for Blacklisted Users
                if (rules.blacklist.users.includes(`${process.host_name}:${process.user}`)) {
                    score = 10;
                    await this.raiseAlert({
                        endpoint_id: process.endpoint_id,
                        artifact_id: process._id,
                        artifact_collection: "processes",
                        detection: "Blacklisted User detected",
                        host_name: process.host_name,
                        trigger: process.command,
                        score,
                        severity: await this.getSeverity(score),
                        message: `User: ${process.user} is in the blacklist!`
                    });
                    continue;
                };

                // Check Blacklist
                let isBlacklisted = false;
                for (const rule of rules.blacklist.processes) {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(process[rule.field])) {
                        score = 10; // significant threat score due to the process being blacklisted
                        await this.raiseAlert({
                            endpoint_id: process.endpoint_id,
                            artifact_id: process._id,
                            artifact_collection: "processes",
                            detection: rule.detection,
                            host_name: process.host_name,
                            trigger: process.command,
                            score,
                            severity: await this.getSeverity(score),
                            message: rule.message
                        });
                        isBlacklisted = true;
                    };
                    if (isBlacklisted) { break; }
                };

                if (isBlacklisted) { continue; }

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

                // Check Whitelist first
                const isFileWhitelisted = rules.whitelist.files.some(rule => new RegExp(rule.filter, "i").test(file[rule.field]));
                if (isFileWhitelisted) {
                    continue; // since the file is whitelisted, do not analyse or raise an alert and continue to the next file
                };

                // Check Blacklist
                let isBlacklisted = false;
                for (const rule of rules.blacklist.files) {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(file[rule.field])) {
                        score = 10; // significant threat score due to the file being blacklisted
                        await this.raiseAlert({
                            endpoint_id: file.endpoint_id,
                            artifact_id: file._id,
                            artifact_collection: "files",
                            detection: rule.detection,
                            host_name: file.host_name,
                            trigger: file.file_path,
                            score,
                            severity: await this.getSeverity(score),
                            message: `${rule.message} VirusTotal Report: ${await VirusTotalController.getFileReport(file.sha256_hash)}`
                        });
                        isBlacklisted = true;
                    };
                    if (isBlacklisted) { break; }
                };

                if (isBlacklisted) { continue; }


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
                    const severity = await this.getSeverity(score);
                    if (severity === "High") {
                        await this.raiseAlert({
                            endpoint_id: file.endpoint_id,
                            artifact_id: file._id,
                            artifact_collection: "files",
                            detection,
                            host_name: file.host_name,
                            trigger: file.file_path,
                            score,
                            severity,
                            message: `${message} VirusTotal Report: ${await VirusTotalController.getFileReport(file.sha256_hash)}`
                        });
                    }
                    else {
                        await this.raiseAlert({
                            endpoint_id: file.endpoint_id,
                            artifact_id: file._id,
                            artifact_collection: "files",
                            detection,
                            host_name: file.host_name,
                            trigger: file.file_path,
                            score,
                            severity,
                            message
                        });
                    };
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

                // Check Whitelist first
                const isConnectionWhitelisted = rules.whitelist.network_connections.some(rule => new RegExp(rule.filter, "i").test(connection[rule.field]));
                if (isConnectionWhitelisted) {
                    continue; // since the network connection is whitelisted, do not analyse or raise an alert and continue to the next network connection
                }
 
                // Check Blacklist
                let isBlacklisted = false;
                for (const rule of rules.blacklist.network_connections) {
                    const pattern = new RegExp(rule.filter, "i");
                    if (pattern.test(connection[rule.field])) {
                        score = 10; // significant threat score due to the network connection being blacklisted
                        await this.raiseAlert({
                            endpoint_id: connection.endpoint_id,
                            artifact_id: connection._id,
                            artifact_collection: "network_connections",
                            detection: rule.detection,
                            host_name: connection.host_name,
                            trigger: `(${connection.command}): ${connection.remote_address_ip}:${connection.remote_address_port}`,
                            score,
                            severity: await this.getSeverity(score),
                            message: rule.message
                        });
                        isBlacklisted = true;
                    };
                    if (isBlacklisted) { break; }
                };

                if (isBlacklisted) { continue; }
               
            
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
                        trigger: `(${connection.command}): ${connection.remote_address_ip}:${connection.remote_address_port}`,
                        score,
                        severity: await this.getSeverity(score),
                        message
                    });
                };
                
            };
        }
        catch (error) {
            console.log(`[Security_Controller]: An error has occurred when analysing network connections. Debug: ${error}`);
        };
    };
};

module.exports = SecurityController;