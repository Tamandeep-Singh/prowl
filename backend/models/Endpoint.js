const mongoose = require("mongoose");

const EndpointSchema = mongoose.Schema({
    host_uuid: {
        type: String,
        unique: true,
        required: [true, "Endpoint UUID must be provided"]
    },
    host_name: {
        type: String,
        required: [true, "Endpoint name must be provided"]
    },
    host_ip: {
        type: String,
        required: [true, "IP Address for the endpoint must be provided"]
    },
    host_os: {
        type: String,
        required: [true, "Operating System for the endpoint must be provided"],
        enum: ["Windows", "MacOS", "Linux"]
    },
    host_os_version: {
        type: String,
        required: [true, "OS version details must be provided"],
    }
}, { timestamps: true });

module.exports = mongoose.model("Endpoint", EndpointSchema);