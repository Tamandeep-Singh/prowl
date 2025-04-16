const AlertController = require("./alert_controller");

class SecurityController {
    static analyseProcesses = async (processes) => {
        for (const process of processes) {
            await AlertController.sendAlert({
                discord: {}, 
                email: {}
            });
        };
    };

    static analyseFiles = async (files) => {
        for (const file of files) {
            await AlertController.sendAlert({
                discord: {}, 
                email: {}
            });
        };
    };

    static analyseNetworkConnections = async (connections) => {
        for (const connection of connections) {
            await AlertController.sendAlert({
                discord: {}, 
                email: {}
            });
        };
    };
};

module.exports = SecurityController;