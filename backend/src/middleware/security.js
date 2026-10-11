
 // ========================================
 // SECURITY HEADERS + CORS + REQUEST LOGGING
 // AgriSmart Tanzania API
 // ========================================

const config = require("../config/env");

function securityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
        "Referrer-Policy",
        "no-referrer-when-downgrade"
    );
    res.setHeader("X-XSS-Protection", "0");

    next();
}

function cors(req, res, next) {
    // CORS_ORIGIN inaweza kuwa na origins kadhaa,
    // zikitenganishwa kwa koma.
    const allowedOrigins = (config.CORS_ORIGIN || "")
        .split(",")
        .map(function (origin) {
            return origin.trim();
        })
        .filter(Boolean);

    const requestOrigin = req.headers.origin;

    // Ruhusu origin inayolingana na orodha tu.
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    // Jibu maombi ya CORS preflight.
    if (req.method === "OPTIONS") {
        if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
            res.status(403).end();
            return;
        }

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

module.exports = {
    securityHeaders,
    cors,
    requestLogger
};
