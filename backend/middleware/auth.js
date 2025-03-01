const { verifyAccessToken, decodeToken } = require("../utils/app.utils");

const authMiddleware = {
    checkAccessToken: async (req, res, next) => {
        const authorization = req.get("Authorization");
        if (authorization && authorization.startsWith("Bearer")) {
            const token = authorization.substring(7);
            const isValidToken = await verifyAccessToken(token);
            if (!isValidToken) {
                return res.status(401).json({error: "Invalid access token (JWT) provided"});
            }
            req.userPayload = await decodeToken(token);
            return next();
        }
        res.status(401).json({error: "Missing access token (JWT)"});
        return next();
    }
}

module.exports = authMiddleware;