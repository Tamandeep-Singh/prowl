const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
    return token;
};

const generateRefreshToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY
    });
    return token;
};

const decodeToken = async (accessToken) => {
    const payload = await jwt.decode(accessToken);
    return payload;
};

const verifyAccessToken = async (accessToken) => {
    try {
        const isValidToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
        return isValidToken;
    }
    catch(error) { return false; };
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const isValidToken = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        return isValidToken;
    }
    catch(error) { return false; };
};

module.exports = { generateAccessToken, decodeToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken };