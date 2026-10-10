// ========================================
// APP
// Wires middleware + routes together. Separated
// from server.js so tests can import the app
// directly without binding to a real port twice.
// ========================================

const { createApp } = require("./lib/httpKit");
const { securityHeaders, cors, requestLogger } = require("./middleware/security");
const registerRoutes = require("./routes");
const resetCodeModel = require("./models/resetCodeModel");

const app = createApp();

app.use(cors);
app.use(securityHeaders);
app.use(requestLogger);

registerRoutes(app);

// Housekeeping: clear expired password-reset codes periodically.
setInterval(function () {
    resetCodeModel.clearExpired().catch(function (error) {
        console.error("[housekeeping] Failed to clear expired reset codes:", error);
    });
}, 5 * 60 * 1000).unref();

module.exports = app;
