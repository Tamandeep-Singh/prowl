const mongoose = require("mongoose");

const FileSchema = mongoose.Schema({
    endpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: [true, "Endpoint Object ID for the file must be provided for referencing"]
    },
    host_name: {
        type: String,
        required: [true, "must be provided"]
    },
    file_name: {
        type: String,
        required: [true, ""]
    },
    file_path: {
        type: String,
        required: [true, "must be provided"]
    },
    sha1_hash: {
        type: String,
        required: [true, " must be provided"]
    },
    creation_ts: {
        type: mongoose.Schema.Types.Date,
        required: [true, "must be provided"],
    },
    last_mod_ts: {
        type: mongoose.Schema.Types.Date,
        required: [true, " must be provided"],
    },
    file_size: {
        type: Number,
        required: [true, " must be provided"]
    },
    file_description: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);