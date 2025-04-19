const mongoose = require("mongoose");

const AlertSchema = mongoose.Schema({
    endpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: [true, "Endpoint Object ID for the Alert must be provided for referencing"]
    },
    artifact_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Artifact ID for the Alert must be provided"]
    },
    artifact_collection: {
        type: String,
        required: [true, "Artifact Collection for the Alert must be provided"]
    },
    detection: {
        type: String,
        required: [true, "Detection for the Alert must be provided"]
    },
    host_name: {
        type: String,
        required: [true, "Host Name for the Alert must be provided"]
    },
    trigger: {
        type: String,
        required: [true, "Trigger for the Alert must be provided"]
    },
    score: {
        type: Number,
        required: [true, "Score for the Alert must be provided"]
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    message: {
        type: String,
        required: [true, "Message for the Alert must be provided"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Alert", AlertSchema);