const { verifyAccessToken, decodeToken } = require("../utils/app.utils");

const authMiddleware = {
    checkAccessToken: async (req, res, next) => {
        const authorization = req.get("Authorization");
        if (authorization && authorization.startsWith("Bearer")) {
            const token = authorization.substring(7);
            const isValidToken = await verifyAccessToken(token);
            if (!isValidToken) {
                return res.status(200).json({result: {success: false, error: "Invalid access token (JWT) provided", invalid: true}});
            }
            req.userPayload = await decodeToken(token);
            return next();
        }
        return res.status(200).json({result: {success: false, error: "Missing access token (JWT)"}});
    }
}

module.exports = authMiddleware;