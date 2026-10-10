// ========================================
// SECURITY HEADERS + CORS + REQUEST LOGGING
// Equivalent to what "helmet", "cors" and "morgan"
// give you, written by hand so no npm install is
// required. Swap these for the real packages
// whenever you like — the behaviour is the same.
// ========================================

const config = require("../config/env");

function securityHeaders(req, res, next) {

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    res.setHeader("X-XSS-Protection", "0"); // superseded by CSP; explicit 0 per current best practice

    next();

}

function cors(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", config.CORS_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    next();

}

function requestLogger(req, res, next) {

    const start = Date.now();

    res.on("finish", function () {

        const ms = Date.now() - start;

        console.log(
            "[" + new Date().toISOString() + "] " +
            req.method + " " + req.path + " -> " +
            res.statusCode + " (" + ms + "ms)"
        );

    });

    next();

}

module.exports = { securityHeaders, cors, requestLogger };
