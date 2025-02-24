const mongoose = require("mongoose");

const EndpointSchema = mongoose.Schema({
    host_name: String,
    ip_address: String,
    operating_system: String
}, { timestamps: true });

module.exports = mongoose.model("Endpoint", EndpointSchema);