const express = require("express");
const app = express(); 
const authMiddleware = require("./middleware/auth");
const connectToMongoDB = require("./config/mongo.config");
require("dotenv").config();

const PORT = process.env.PROWL_BACKEND_PORT || 9728;

app.use(express.json({ limit: '10mb' }));

app.use("/api/v1/users", require("./routes/user.route"));
app.use("/api/v1/endpoints", require("./routes/endpoint.route"));
app.use("/api/v1/processes", require("./routes/process.route"));
app.use("/api/v1/files", require("./routes/file.route"));

app.get("/", (req, res) => {
res.status(200).json({success: true});
});


const setupServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`[Prowl-API]: Started on port ${PORT}`));
};

setupServer();


