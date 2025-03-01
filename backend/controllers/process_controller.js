const Process = require("../models/Process");
const MongoUtilities = require("../utils/mongo.utils");

class ProcessController {
    static insertProcesses = async (processArray, endpoint_id) => {
        const processes = processArray.map(process => ({
            ...process,
            start_time: new Date(process.start_time),
            endpoint_id
        }));
        const result = await MongoUtilities.insertManyDocuments(Process, processes);
        return result;
    };

    static getProcessList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(Process, fields);
        return result;
    };
};

module.exports = ProcessController;