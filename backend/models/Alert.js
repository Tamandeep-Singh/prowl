const mongoose = require("mongoose");

const AlertSchema = mongoose.Schema({
    
}, { timestamps: true });

module.exports = mongoose.model("Alert", AlertSchema);