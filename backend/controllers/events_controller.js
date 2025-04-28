const Alert = require("../models/Alert");
const Endpoint = require("../models/Endpoint");
const File = require("../models/File");
const NetworkConnection = require("../models/Network_Connection");
const Process = require("../models/Process");
const Report = require("../models/Report");

class EventsController {
    static getDocumentsCountInCollections = async () => {
        try {
            const [alertCount, endpointCount, fileCount, networkConnectionCount, processCount, reportCount] = await Promise.all([
                Alert.countDocuments(),
                Endpoint.countDocuments(),
                File.countDocuments(),
                NetworkConnection.countDocuments(),
                Process.countDocuments(),
                Report.countDocuments()
            ]);
            return { success: true, counts: [{alerts: alertCount, endpoints: endpointCount, files: fileCount, networkConnections: networkConnectionCount, processes: processCount, reports: reportCount}]};
        }
        catch (error) {
            console.log(`An error occurred when determining document count for numerous collections! Debug: `);
            return { success: false, error: "Unable to retrieve events count for all collections"};
        };
    };
};

module.exports = EventsController;