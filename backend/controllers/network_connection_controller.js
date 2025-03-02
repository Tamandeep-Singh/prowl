const NetworkConnection = require("../models/Network_Connection");
const MongoUtilities = require("../utils/mongo.utils");

class NetworkConnectionController {
    static insertNetworkConnections = async (connectionsArray, endpoint_id) => {
        const connections = connectionsArray.map(connection => ({
            ...connection,
            endpoint_id
        }));
        const result = await MongoUtilities.insertManyDocuments(NetworkConnection, connections);
        return result;
    };

    static getNetworkConnectionsList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(NetworkConnection, fields);
        return result;
    };
};

module.exports = NetworkConnectionController;