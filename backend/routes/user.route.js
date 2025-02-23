const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user_controller");

userRouter.post("/register", async (req, res) => {
    const result = await userController.createUser(req);
    if (result.operationFailed) {
        return res.status(400).json(result.error);
    };
    return res.status(200).json(result);
});

userRouter.post("/login", async (req, res) => {
    const result = await userController.authenticateUser(req);
    return res.status(200).json({result, payload: req.userPayload});
});

module.exports = userRouter;