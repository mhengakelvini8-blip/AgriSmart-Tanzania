// ========================================
// AUTH MIDDLEWARE
// Verifies the Bearer JWT on the Authorization
// header and attaches the decoded payload as
// req.user. Because JWTs are self-verifying, this
// works correctly even after a server restart —
// unlike an in-memory session list.
// ========================================

const jwt = require("../lib/jwt");

function getBearerToken(req) {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return null;
    }

    return header.slice(7);

}

function requireFarmer(req, res, next) {

    const token = getBearerToken(req);
    const payload = token ? jwt.verify(token) : null;

    if (!payload || payload.role !== "farmer") {
        res.status(401).json({ message: "Authentication required." });
        return;
    }

    req.user = payload;
    next();

}

function requireAdmin(req, res, next) {

    const token = getBearerToken(req);
    const payload = token ? jwt.verify(token) : null;

    if (!payload || payload.role !== "admin") {
        res.status(401).json({ message: "Admin authentication required." });
        return;
    }

    req.user = payload;
    next();

}

module.exports = { requireFarmer, requireAdmin };
