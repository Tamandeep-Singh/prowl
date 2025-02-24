const User = require("../models/User");
const { generateAccessToken, generateRefreshToken, decodeToken, verifyRefreshToken } = require("../utils/app.utils");

class UserController {
    static findUser = async (email) => {
        try {
            const exists = await User.exists({ email });
            return !(exists === null);
        }
        catch (error) { return false; };
    };

    static getUser = async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        }
        catch (error) { return null; };
    };

    static createUser = async (request) => {
        const user = {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email,
            role: request.body.role || "user",
        };
        try {
            const result = await User.create(user);
            const payload = {username: result.username, email: result.email, role: result.role, uid: result._id};
            const accessToken = await generateAccessToken(payload);
            const refreshToken = await generateRefreshToken(payload);
            return { success: true, accessToken, refreshToken };
        }
        catch(error) { return { success: false,  error }; };
    };

    static consumeRefreshToken = async (refreshToken) => {
        const isValid = await verifyRefreshToken(refreshToken);
        if (!isValid) { return { success: false, result: "Invalid refresh token" }; };
        const payload = await decodeToken(refreshToken);
        delete payload.iat;
        delete payload.exp;
        const accessToken = await generateAccessToken(payload);
        const newRefreshToken = await generateRefreshToken(payload);
        return { success: true, accessToken, refreshToken: newRefreshToken };
    };

    static authenticateUser = async (request) => {
        const { email, password } = request.body;
        const doesUserExist = await this.findUser(email);
        if (!doesUserExist) { return { error: `User with ${email} does not exist` } };
        const user = await this.getUser(email);
        const successfulAuth = await user.doesPasswordMatch(password);
        if (!successfulAuth) { return { error: "Password doesn't match" } };
        const payload = {username: user.username, email: user.email, role: user.role, uid: user._id};
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);
        return { success: true, accessToken, refreshToken };
    };

};

module.exports = UserController;