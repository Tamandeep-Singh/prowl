const Endpoint = require("../models/Endpoint");
const MongoUtilities = require("../utils/mongo.utils");

class EndpointController {
    static getEndpointList = async () => {
        const endpoints = await MongoUtilities.getAllDocuments(Endpoint);
        return endpoints;
    };

    static getEndpointID = async (host_uuid) => {
        const endpoint_id = await MongoUtilities.getDocumentObjectID(Endpoint, { host_uuid });
        return endpoint_id;
    };

    static getEndpointByName = async (host_name) => {
        const endpoint = await MongoUtilities.getDocumentByField(Endpoint, { host_name });
        return endpoint;
    };

    static createEndpoint = async (endpoint) => {
        const result = await MongoUtilities.insertDocument(Endpoint, endpoint);
        if (result.error?.errorResponse?.code === 11000) {
            result.error = "This Endpoint is already linked. Restart the script for telemetry collection!";
            return result;
        };
        if (result.error) {
            result.debug = result.error;
            result.error = "Unable to link the Endpoint.";
        };
        return result;
    };

    static getEndpointsCount = async () => {
        const result = await MongoUtilities.countDocumentsInCollection(Endpoint);
        return result;
    };
};

module.exports = EndpointController;