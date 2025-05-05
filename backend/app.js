const express = require("express");
const app = express(); 
const cors = require("cors");
const authMiddleware = require("./middleware/auth");
const connectToMongoDB = require("./config/mongo.config");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const PORT = process.env.PROWL_BACKEND_PORT || 9728;

app.use(cookieParser());
app.use(cors({ 
    origin: process.env.PROWL_FRONTEND_HUB,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.get("/", async (req, res) => {
    return res.status(200).json({ result: { success: true, message: `Prowl API is active on port: ${PORT} in Node ENV: ${process.env.NODE_ENV}`}});
});

// To simply test if the API is active and operational
app.get("/ping", async (req, res) => {
    return res.status(200).json({result: { success: true, message: "pong!" }});
});

app.use("/api/users", require("./routes/user.route"));
app.use("/api/endpoints", require("./routes/endpoint.route"));
app.use("/api/processes", authMiddleware.checkAccessToken, require("./routes/process.route"));
app.use("/api/files", authMiddleware.checkAccessToken, require("./routes/file.route"));
app.use("/api/network_connections", authMiddleware.checkAccessToken, require("./routes/network.route"));
app.use("/api/alerts", authMiddleware.checkAccessToken, require("./routes/alert.route"));
app.use("/api/reports", authMiddleware.checkAccessToken, require("./routes/report.route"));
app.use("/api/events", authMiddleware.checkAccessToken, require("./routes/events.route"));
app.use("/api/console", authMiddleware.checkAccessToken, require("./routes/console.route"));
app.use("/api/oauth", require("./routes/oauth.route"));

const setupServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`[Prowl-API]: Server has started on port ${PORT}`));
};

if (process.env.NODE_ENV !== "test") {
    setupServer();
};

module.exports = app;

