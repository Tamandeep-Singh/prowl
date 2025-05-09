const processController = require("./process_controller");
const endpointController = require("./endpoint_controller");
const fileController = require("./file_controller");
const networkConnectionController = require("./network_connection_controller");

class IngestController {
    static fetchEndpointID = async (host_uuid) => {
        const endpoint_id = await endpointController.getEndpointID(host_uuid);
        return endpoint_id;
    };

    static handleProcessIngest = async (processes, host_uuid, host_name, agent_pid) => {
        const endpoint_id = await this.fetchEndpointID(host_uuid);
        if (endpoint_id === null) { 
            return { success: false, error: "Invalid or unlinked endpoint provided" }; 
        };
        const result = await processController.insertProcesses(processes, endpoint_id, host_name, agent_pid);
        return result;
    };

    static handleFileIngest = async (files, host_uuid, host_name) => {
        const endpoint_id = await this.fetchEndpointID(host_uuid);
        if (endpoint_id === null) { 
            return { success: false, error: "Invalid or unlinked endpoint provided" }; 
        };
        const result = await fileController.insertFiles(files, endpoint_id, host_name);
        return result;
    };

    static handleNetworkIngest = async (connections, host_uuid, host_name) => {
        const endpoint_id = await this.fetchEndpointID(host_uuid);
        if (endpoint_id === null) { 
            return { success: false, error: "Invalid or unlinked endpoint provided" }; 
        };

        const result = await networkConnectionController.insertNetworkConnections(connections, endpoint_id, host_name);
        return result;
    };

    static handleIngestType = async (request) => {
        let ingestResult = {};
        const host_uuid = request.body.host_uuid;
        const host_name = request.body.host_name;
        switch (request.body.ingest_type) {
            case "processes":
                ingestResult = await this.handleProcessIngest(request.body.processes, host_uuid, host_name, request.body.agent_pid);
                break;
            case "files":
                ingestResult = await this.handleFileIngest(request.body.files, host_uuid, host_name);
                break;
            case "network":
                ingestResult = await this.handleNetworkIngest(request.body.network_connections, host_uuid, host_name);
                break;
            default:
               ingestResult =  { success: false, error: "Invalid ingest type provided" }
               break     
        };
        return ingestResult;

    };
};

module.exports = IngestController;