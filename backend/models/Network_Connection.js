const mongoose = require("mongoose");

const NetworkConnectionSchema = mongoose.Schema({
    endpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: [true, "Endpoint Object ID for the network connection must be provided for referencing"]
    },
    host_name: {
        type: String,
        required: [true, "Host Name for the network connection must be provided"]
    },
    command: {
        type: String,
        required: [true, "Command for the network connection must be provided"]
    },
    pid: {
        type: Number,
        required: [true, "Process ID (PID) for the network connection must be provided"]
    },
    local_address_ip: {
        type: String,
        required: [true, "Local Address (IP) for the network connection must be provided"],
    },
    local_address_port: {
        type: Number,
        required: [true, "Local Address Port for the network connection must be provided"],
    },
    remote_address_ip: {
        type: String,
        required: [true, "Remote Address (IP) for the network connection must be provided"],
    },
    remote_address_port: {
        type: Number,
        required: [true, "Remote Address Port for the network connection must be provided"],
    },
    connection_status: {
        type: String,
        required: [true, "Connection status for the network connection must be provided"],
    },
}, { timestamps: true });

module.exports = mongoose.model("Network_Connection", NetworkConnectionSchema);