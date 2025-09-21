const { admin } = require("../../firestore/firebase-config");

/**
 * Middleware to verify Firebase ID Token
 *
 * Extracts the Bearer token from `Authorization` header,
 * verifies it with Firebase Admin SDK, and attaches
 * the decoded user info to `req.user`.
 *
 * Usage: Protect routes by adding `authMiddleware` before controllers.
 */

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authenticate;
