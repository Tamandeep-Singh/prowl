const File = require("../models/File");
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

class FileController {
    static createFileHash = (file) => {
        const hash = crypto.createHash("sha1").update(file.file_name).update(file.file_path).update(String(file.last_mod_ts)).digest("hex");
        return hash;
    };

    static insertFiles = async (filesArray, endpoint_id, host_name) => {
        const files = filesArray.map(file => ({
            ...file,
            creation_ts: new Date(file.creation_ts * 1000),
            last_mod_ts: new Date(file.last_mod_ts * 1000),
            endpoint_id,
            host_name
        }));
        const filteredFiles = [];
        files.map(file => {
            const hash = this.createFileHash(file);
            if (!buffer.has(hash)) {
                buffer.set(hash, null);
                filteredFiles.push(file);
            };
        });
        if (filteredFiles.length === 0) {
            return { success: true, message: "No new files were inserted, all duplicates were found."};
        };
        await SecurityController.analyseFiles(filteredFiles);
        const result = await MongoUtilities.insertManyDocuments(File, files);
        return result;
    };

    static getFileList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(File, fields);
        return result;
    };
};

module.exports = FileController;