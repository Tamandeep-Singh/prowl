const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user_controller");
const authMiddleware = require("../middleware/auth");

userRouter.get("/list", authMiddleware.checkAccessToken, async (req, res) => {
    if (req.userPayload.role !== "administrator") {
        return res.status(200).json({ result: { success: false, error: "You do not have the required permissions to access this route."}});
    }
    const result = await userController.getUsersList();
    return res.status(200).json({result});
});

userRouter.post("/update/:id", authMiddleware.checkAccessToken, async (req, res) => {
    if (req.userPayload.role !== "administrator") {
        return res.status(200).json({ result: { success: false, error: "You do not have the required permissions to access this route."}});
    };
    const result = await userController.updateUser(req.params.id, req.body.user);
    return res.status(200).json({result});
});

userRouter.post("/password/change", authMiddleware.checkAccessToken, async (req, res) => {
    const { userId, newPassword } = req.body.user;
    if (userId !== req.userPayload.uid) {
        return res.status(200).json({ result: { success: false, error: "Invalid User ID provided!"}});
    };
    const result = await userController.changeUserPassword(userId, newPassword);
    return res.status(200).json({result});
});

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