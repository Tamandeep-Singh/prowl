const Process = require("../models/Process");
const MongoUtilities = require("../utils/mongo.utils");
const crypto = require("crypto");
const { LRUCache } = require("lru-cache");
const SecurityController = require("../controllers/security_controller");

const buffer = new LRUCache({
    max: 10000,
    ttl: 1000 * 15
});

setInterval(() => {
    buffer.purgeStale();
}, 20000);

class ProcessController {
    static createProcessHash = (process) => {
        const hash = crypto.createHash("sha1").update(String(process.pid)).update(String(process.ppid)).update(process.command).update(process.user).digest("hex");
        return hash;
    };

    static insertProcesses = async (processArray, endpoint_id, host_name, agent_pid) => {
        const processes = processArray.map(process => ({
            ...process,
            start_time: new Date(process.start_time),
            endpoint_id,
            host_name
        }));
        const filteredProcesses = [];
        processes.map(process => {
            const hash = this.createProcessHash(process);
            if (!buffer.has(hash)) {
                buffer.set(hash, null);
                if (process.pid !== agent_pid && process.ppid !== agent_pid) {
                    filteredProcesses.push(process);
                };
            };
        });
        if (filteredProcesses.length === 0) {
            return { success: true, message: "No new processes were inserted, all duplicates were found."};
        };
        const result = await MongoUtilities.insertManyDocuments(Process, processes);
        await SecurityController.analyseProcesses(result);
        return result;
    };

    static getProcessList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(Process, fields);
        return result;
    };

    static getProcessesCount = async () => {
        const result = await MongoUtilities.countDocumentsInCollection(Process);
        return result;
    };
};

module.exports = ProcessController;