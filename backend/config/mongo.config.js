const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[Prowl-API]: Successfully connected to MongoDB Instance");
    }
    catch(error) { console.log(`[Prowl-API]: Unable to connect to MongoDB Instance. Error: ${error}`); };
};

module.exports = connectToMongoDB;