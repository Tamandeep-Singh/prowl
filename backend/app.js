const express = require("express");
const app = express(); 
const cors = require("cors");
const authMiddleware = require("./middleware/auth");
const connectToMongoDB = require("./config/mongo.config");
require("dotenv").config();

const PORT = process.env.PROWL_BACKEND_PORT || 9728;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// To simply test if the API is active and operational
app.get("/ping", async (req, res) => {
    return res.status(200).json({result: { success: true, message: "pong!" }});
});

app.use("/api/users", require("./routes/user.route"));
app.use("/api/endpoints", require("./routes/endpoint.route"));
app.use("/api/processes", require("./routes/process.route"));
app.use("/api/files", require("./routes/file.route"));
app.use("/api/network_connections", require("./routes/network.route"));
app.use("/api/alerts", require("./routes/alert.route"));
app.use("/api/console", authMiddleware.checkAccessToken, require("./routes/console.route"));

const setupServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`[Prowl-API]: Started on port ${PORT}`));
};

setupServer();


