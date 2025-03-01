const File = require("../models/File");
const MongoUtilities = require("../utils/mongo.utils");

class FileController {
    static insertFiles = async (filesArray, endpoint_id) => {
        const files = filesArray.map(file => ({
            ...file,
            creation_ts: new Date(file.creation_ts * 1000),
            last_mod_ts: new Date(file.last_mod_ts * 1000),
            endpoint_id
        }));
        const result = await MongoUtilities.insertManyDocuments(File, files);
        return result;
    };

    static getFileList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(File, fields);
        return result;
    };
};

module.exports = FileController;