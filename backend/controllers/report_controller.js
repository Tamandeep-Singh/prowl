const Report = require("../models/Report");
const MongoUtilities = require("../utils/mongo.utils");

class ReportController {
    static insertReport = async (report) => {
        const result = await MongoUtilities.insertDocument(Report, report);
        return result;
    };

    static getReportsList = async (fields) => {
        const result = await MongoUtilities.getDocumentsByField(Report, fields);
        return result;
    };

    static getReportByAlertID = async (alertId) => {
        const result = await MongoUtilities.getDocumentByField(Report, { alert_id: alertId });
        return result;
    };

    static getReportsCount = async () => {
        const result = await MongoUtilities.countDocumentsInCollection(Report);
        return result;
    };
};

module.exports = ReportController;