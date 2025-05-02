const NetworkConnection = require("../models/Network_Connection");
const MongoUtilities = require("../utils/mongo.utils");
const crypto = require("crypto");
const { LRUCache } = require("lru-cache");
const SecurityController = require("../controllers/security_controller");

const buffer = new LRUCache({
    max: 10000,
    ttl: 1000 * 60
});

setInterval(() => {
    buffer.purgeStale();
}, 50000);

class NetworkConnectionController {
    static createConnectionHash = (connection) => {
        const hash = crypto.createHash("sha1").update(String(connection.pid)).update(connection.remote_address_ip).update(connection.command).update(String(connection.remote_address_port)).digest("hex");
        return hash;
    };

    static insertNetworkConnections = async (connectionsArray, endpoint_id, host_name) => {
        const connections = connectionsArray.map(connection => ({
            ...connection,
            endpoint_id,
            host_name
        }));
        const filteredConnections = [];
        connections.map(connection => {
            const hash = this.createConnectionHash(connection);
            if (!buffer.has(hash)) {
                buffer.set(hash, null);
                filteredConnections.push(connection);
            };
        });
        if (filteredConnections.length === 0) {
            return { success: true, message: "No new network connections were inserted, all duplicates were found." };
        };
        const result = await MongoUtilities.insertManyDocuments(NetworkConnection, connections);
        await SecurityController.analyseNetworkConnections(result);
        return result;
    };

    static getNetworkConnectionsList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(NetworkConnection, fields);
        return result;
    };
};

module.exports = NetworkConnectionController;