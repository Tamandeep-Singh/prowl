const User = require("../models/User");
const { generateSessionToken } = require("../utils/app.utils");

class UserController {
    static findUser = async (username) => {
        try {
            const exists = await User.exists({ username });
            return !(exists === null);
        }
        catch (error) { return false; };
    };

    static getUser = async (username) => {
        try {
            const user = await User.findOne({ username });
            return user;
        }
        catch (error) { return null; };
    };

    static createUser = async (request) => {
        const user = {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email
        };
        try {
            const result = await User.create(user);
            const token = await generateSessionToken({ username: user.username, email: user.email, uid: result._id });
            return { success: true, sessionToken: token };
        }
        catch(error) { return { operationFailed: true,  error }; };
    };

    static authenticateUser = async (request) => {
        const { username, password } = request.body;
        const doesUserExist = await this.findUser(username);
        if (!doesUserExist) { return { error: `Username ${username} does not exist` } };
        const user = await this.getUser(username);
        const successfulAuth = await user.doesPasswordMatch(password);
        if (!successfulAuth) { return { error: "Password doesn't match" } };
        const token = await generateSessionToken({ username, email: user.email, uid: user._id });
        return { success: true, sessionToken: token };
    };

};

module.exports = UserController;