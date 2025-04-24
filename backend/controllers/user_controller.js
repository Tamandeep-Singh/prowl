const User = require("../models/User");
const MongoUtilities = require("../utils/mongo.utils");
const { generateAccessToken, generateRefreshToken, decodeToken, verifyRefreshToken } = require("../utils/app.utils");

class UserController {
    static findUser = async (email) => {
        const exists = await MongoUtilities.doesDocumentExist(User, { email });
        return exists;
    };

    static getUser = async (email) => {
        const user = await MongoUtilities.getDocumentByField(User, { email });
        return user;
    };

    static changeUserPassword = async (userId, newPassword) => {
        const user = await MongoUtilities.getDocumentByField(User, { _id: userId});
        if (user === null) {
            return { success: false, error: "Unable to find user!"};
        };
        try {
            user.password = newPassword;
            const result = await user.save();
            return { success: true, message: result};
        }
        catch (error) {
            return { success: false, error };
        };
       
    };

    static getUsersList = async (fields) => {
        const result = await MongoUtilities.getAllDocuments(User, fields);
        return result;
    };
    
    static updateUser = async (userId, fields) => {
        const result = await MongoUtilities.updateDocumentById(User, userId, fields);
        return result;
    };

    static createUser = async (user) => {
        const result = await MongoUtilities.insertDocument(User, user);
        if (result.error) { 
            return result;
        };
        
        const payload = { username: result.username, email: result.email, role: result.role, uid: result._id };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return { success: true, accessToken, refreshToken };
    };

    static consumeRefreshToken = async (refreshToken) => {
        const isValid = await verifyRefreshToken(refreshToken);
        if (!isValid) { 
            return { success: false, error: "Invalid refresh token" };
        };

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
        if (!doesUserExist) { 
            return { success: false, error: `User with email: ${email} does not exist` }; 
        };

        const user = await this.getUser(email);
        const successfulAuth = await user.doesPasswordMatch(password);
        if (!successfulAuth) { 
            return { success: false, error: "Incorrect Password" };
        };

        const payload = {username: user.username, email: user.email, role: user.role, uid: user._id};
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return { success: true, accessToken, refreshToken };
    };

};

module.exports = UserController;