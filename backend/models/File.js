const mongoose = require("mongoose");

const FileSchema = mongoose.Schema({
    endpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: [true, "Endpoint Object ID for the file must be provided for referencing"]
    },
    host_name: {
        type: String,
        required: [true, "Host Name for the file must be provided"]
    },
    file_name: {
        type: String,
        required: [true, "File Name for the file must be provided"]
    },
    file_path: {
        type: String,
        required: [true, "File Path for the file must be provided"]
    },
    sha256_hash: {
        type: String,
        required: [true, "SHA-256 Hash for the file must be provided"]
    },
    creation_ts: {
        type: mongoose.Schema.Types.Date,
        required: [true, "Creation Timestamp of the file must be provided"],
    },
    last_mod_ts: {
        type: mongoose.Schema.Types.Date,
        required: [true, "Last Modified Timestamp of the file must be provided"],
    },
    file_size: {
        type: Number,
        required: [true, "File Size of the file must be provided"]
    },
    file_description: {
        type: String,
        required: false,
        default: "No Description provided"
    }
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);