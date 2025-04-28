class MongoUtilities  {
    static doesDocumentExist = async (model, field) => {
        try {
            const exists = await model.exists(field);
            return !(exists === null);
        }
        catch (error) { return false; };
    };

    static getDocumentByField = async (model, field) => {
        try {
            const document = await model.findOne(field);
            return document;
        }
        catch (error) { return null; };
    };

    static insertManyDocuments = async (model, documents) => {
        try {
            const result = await model.insertMany(documents);
            return result;
        }
        catch (error) { return { success: false, error } };
    };
    
    static getDocumentsByField = async (model, field) => {
        try {
            const document = await model.find(field);
            return document;
        }
        catch (error) { return null; };
    };

    static getDocumentByField = async (model, field) => {
        try {
            const document = await model.findOne(field);
            return document;
        }
        catch (error) { return null; };
    };

    static updateDocumentById = async (model, id, fields) => {
        try {
            const result = await model.updateOne({ _id: id }, { $set: fields});
            return result;
        }
        catch (error) { return { success: false, error }};
    };

    static getDocumentObjectID = async (model, field) => {
        try {
            const document = await model.findOne(field).select("_id");
            return document._id;
        }
        catch (error) { return null; };
    }

    static insertDocument = async (model, documentObject) => {
        try {
            const document = await model.create(documentObject);
            return document;
        }
        catch (error) { return { success: false, error } };
    };

    static getAllDocuments = async (model) => {
        try {
            const documents = await model.find();
            return documents;
        }
        catch (error) { return { success: false, error } };
    };
}

module.exports = MongoUtilities;