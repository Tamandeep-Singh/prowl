const express = require("express");
const app = express(); 
const connectToMongoDB = require("./config/mongo.config");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

const PORT = process.env.PROWL_BACKEND_PORT || 9728;

app.use(express.json());

app.use("/api/v1/users", require("./routes/user.route"));

app.use(authMiddleware.checkSessionToken);


app.get("/", (req, res) => {
res.status(200).json({success: true});
});


const setupEndpoint = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`[Prowl-API]: started on port ${PORT}`));
};

setupEndpoint();


