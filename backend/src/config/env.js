// ========================================
// ENVIRONMENT CONFIGURATION
// Loads backend/.env (if present) and exposes
// validated config values. No external "dotenv"
// package needed — this parses it manually.
// ========================================

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function loadDotEnv() {

    const envPath = path.join(__dirname, "../../.env");

    if (!fs.existsSync(envPath)) {
        return;
    }

    const lines = fs.readFileSync(envPath, "utf8").split("\n");

    lines.forEach(function (line) {

        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
            return;
        }

        const eq = trimmed.indexOf("=");

        if (eq === -1) {
            return;
        }

        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();

        // Strip surrounding quotes, e.g. KEY="value"
        if (
            (value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (process.env[key] === undefined) {
            process.env[key] = value;
        }

    });

}

loadDotEnv();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// A JWT secret is required. In development we generate and persist
// one automatically so the project runs out of the box; in
// production you must set JWT_SECRET yourself (see .env.example).
function resolveJwtSecret() {

    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }

    if (isProduction) {
        throw new Error(
            "JWT_SECRET is not set. Create backend/.env from " +
            ".env.example and set a real secret before running " +
            "in production."
        );
    }

    // Development convenience: generate one and save it to .env so
    // it survives restarts (otherwise every restart would invalidate
    // every logged-in session).
    const generated = crypto.randomBytes(48).toString("hex");
    const envPath = path.join(__dirname, "../../.env");

    const line = "\nJWT_SECRET=" + generated + "\n";

    try {
        fs.appendFileSync(envPath, line);
    } catch (error) {
        // Non-fatal — just means it will regenerate next restart.
    }

    console.warn(
        "[config] No JWT_SECRET found — generated a development " +
        "secret and saved it to backend/.env"
    );

    return generated;

}

module.exports = {

    NODE_ENV: NODE_ENV,
    isProduction: isProduction,

    PORT: parseInt(process.env.PORT, 10) || 5000,

    JWT_SECRET: resolveJwtSecret(),
    JWT_EXPIRES_IN_SECONDS:
        parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10) || 60 * 60 * 24 * 7, // 7 days

    DB_PATH:
        process.env.DB_PATH ||
        path.join(__dirname, "../../../data/agrismart.sqlite"),

    // If TURSO_DATABASE_URL is set, the app talks to a Turso
    // (libSQL) cloud database instead of the local SQLite file —
    // see README "Deploying for free" for how to set these up.
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || "",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || "",

    CORS_ORIGIN: process.env.CORS_ORIGIN || (isProduction ? "" : "*"),

    DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || (isProduction ? "" : "admin"),
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || (isProduction ? "" : "admin123"),
    DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || (isProduction ? "" : "youraddress@gmail.com"),

    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",

    RESET_CODE_TTL_MS: 10 * 60 * 1000,

    RATE_LIMIT_WINDOW_MS: 60 * 1000,
    RATE_LIMIT_MAX_ATTEMPTS: 30

};

if (isProduction) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error("Production requires JWT_SECRET with at least 32 characters.");
    }
    if (!process.env.DEFAULT_ADMIN_USERNAME || !process.env.DEFAULT_ADMIN_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD === "admin123" || process.env.DEFAULT_ADMIN_PASSWORD.length < 12) {
        throw new Error("Production requires a custom DEFAULT_ADMIN_USERNAME and a DEFAULT_ADMIN_PASSWORD of at least 12 characters.");
    }
    if (!process.env.DEFAULT_ADMIN_EMAIL || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(process.env.DEFAULT_ADMIN_EMAIL)) {
        throw new Error("Production requires a real DEFAULT_ADMIN_EMAIL.");
    }
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*") {
        throw new Error("Production requires CORS_ORIGIN set to the exact HTTPS frontend origin.");
    }
}
