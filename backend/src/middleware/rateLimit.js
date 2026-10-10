// ========================================
// RATE LIMITER
// A small in-memory fixed-window rate limiter.
// Protects sensitive endpoints (login, register,
// password reset) from brute-force / spam without
// needing an external package or Redis.
//
// For a multi-server production deployment you'd
// back this with Redis instead — see README.
// ========================================

const config = require("../config/env");

function createRateLimiter(options) {

    const windowMs = (options && options.windowMs) || config.RATE_LIMIT_WINDOW_MS;
    const max = (options && options.max) || config.RATE_LIMIT_MAX_ATTEMPTS;

    const hits = new Map(); // key -> { count, resetAt }

    // Periodically clear stale entries so this Map can't grow forever.
    setInterval(function () {

        const now = Date.now();

        hits.forEach(function (entry, key) {
            if (now > entry.resetAt) {
                hits.delete(key);
            }
        });

    }, windowMs).unref();

    return function rateLimit(req, res, next) {

        const key = (req.socket && req.socket.remoteAddress) || "unknown";
        const now = Date.now();

        let entry = hits.get(key);

        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            hits.set(key, entry);
        }

        entry.count += 1;

        if (entry.count > max) {

            res.setHeader(
                "Retry-After",
                Math.ceil((entry.resetAt - now) / 1000)
            );

            res.status(429).json({
                message: "Too many requests. Please try again shortly."
            });

            return;

        }

        next();

    };

}

module.exports = { createRateLimiter };
