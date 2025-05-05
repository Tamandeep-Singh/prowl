const mongoose = require("mongoose");
require("dotenv").config();
const APP_ENV = process.env.NODE_ENV || "development";

const connectToMongoDB = async () => {
    let MONGO_URI = "";
    switch (APP_ENV) {
        case "development":
            MONGO_URI = process.env.MONGO_URI_DEV;
            break;
        case "prototype":
            MONGO_URI = process.env.MONGO_URI_PROTO;
            break;
        case "production":
            MONGO_URI = process.env.MONGO_URI_PROD;
            break;
        case "test":
            MONGO_URI = process.env.MONGO_URI_TEST;
            break;
    };
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[MongoDB]: Successfully connected to the MongoDB Instance!");
        console.log(`[MongoDB]: Loaded Database Environment as ${APP_ENV}`);
    }
    catch(error) { console.log(`[Prowl-API]: Unable to connect to the MongoDB Instance. Error: ${error}`); };
};

module.exports = connectToMongoDB;