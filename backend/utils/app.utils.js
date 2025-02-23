const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateSessionToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
    return token;
};

const decodeSessionToken = async (sessionToken) => {
    const payload = await jwt.decode(sessionToken);
    return payload;
};

const verifySessionToken = async (sessionToken) => {
    try {
        const isValidToken = await jwt.verify(sessionToken, process.env.JWT_SECRET);
        return isValidToken;
    }
    catch(error) { return false; };
};

module.exports = { generateSessionToken, decodeSessionToken, verifySessionToken };