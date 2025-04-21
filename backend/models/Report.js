const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
    alert_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alert",
        required: [true, "Alert Object ID for the Report must be provided for referencing"]
    },
    host_name: {
        type: String,
        required: [true, "Host Name for the Report must be provided"]
    },
    trigger: {
        type: String,
        required: [true, "Trigger for the Report must be provided"]
    },
    summary: {
        type: String,
        required: [true, "Summary for the Report must be provided"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);