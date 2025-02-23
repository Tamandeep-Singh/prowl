const { verifySessionToken, decodeSessionToken } = require("../utils/app.utils");

const authMiddleware = {
    checkSessionToken: async (req, res, next) => {
        const authorization = req.get("Authorization");
        if (authorization && authorization.startsWith("Bearer")) {
            const token = authorization.substring(7);
            const isValidToken = await verifySessionToken(token);
            if (!isValidToken) {
                return res.status(400).json({error: "invalid session token (jwt)"});
            }
            req.userPayload = await decodeSessionToken(token);
            return next();
        }
        res.status(400).json({error: "missing session token (jwt) "});
        return next();
    }
}

module.exports = authMiddleware;