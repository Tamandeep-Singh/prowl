const mongoose = require("mongoose");

const ProcessSchema = mongoose.Schema({
    endpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: [true, "Endpoint Object ID for the process must be provided for referencing"]
    },
    ppid: {
        type: Number,
        required: [true, "Parent Process ID (PPID) for the process must be provided"]
    },
    pid: {
        type: Number,
        required: [true, "Process ID (PID) for the process must be provided"]
    },
    user: {
        type: String,
        required: [true, "User for the process must be provided"],
    },
    command: {
        type: String,
        required: [true, "Command for the process must be provided"],
    },
    start_time: {
        type: mongoose.Schema.Types.Date,
        required: [true, "Start time for the process must be provided"]
    },
    elapsed_time : {
        type: String,
        required: [true, "Elapsed time for the process must be provided"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Process", ProcessSchema);