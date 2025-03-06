const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user_controller");

userRouter.post("/register", async (req, res) => {
    const result = await userController.createUser(req.body.user);
    return res.status(200).json({result});
});

userRouter.post("/login", async (req, res) => {
    const result = await userController.authenticateUser(req);
    return res.status(200).json({result});
});

userRouter.post("/refresh/token", async (req, res) => {
    if (!req.body.refreshToken) { 
        return res.status(400).json({ result: { success: false, error: "No refresh token provided"}} ); 
    };
    
    const refreshToken = req.body.refreshToken;
    const result = await userController.consumeRefreshToken(refreshToken);
    return res.status(200).json({result});
});

module.exports = userRouter;