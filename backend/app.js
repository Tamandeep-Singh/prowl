const express = require("express");
const app = express(); 
const authMiddleware = require("./middleware/auth");
const connectToMongoDB = require("./config/mongo.config");
require("dotenv").config();

const PORT = process.env.PROWL_BACKEND_PORT || 9728;

app.use(express.json());

app.use("/api/v1/users", require("./routes/user.route"));
app.use("/api/v1/endpoints", authMiddleware.checkAccessToken, require("./routes/endpoint.route"));


app.get("/", (req, res) => {
res.status(200).json({success: true});
});


const setupServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`[Prowl-API]: Started on port ${PORT}`));
};

setupServer();


