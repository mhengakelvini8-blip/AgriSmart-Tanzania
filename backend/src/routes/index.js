// ========================================
// ROUTES
// Maps URLs to controller functions. Kept separate
// from the controllers themselves (which hold the
// actual logic) — standard MVC-style separation.
// ========================================

const authController = require("../controllers/authController");
const adminAuthController = require("../controllers/adminAuthController");
const passwordResetController = require("../controllers/passwordResetController");
const marketPriceController = require("../controllers/marketPriceController");

const { requireFarmer, requireAdmin } = require("../middleware/auth");
const { createRateLimiter } = require("../middleware/rateLimit");

const authRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const registerRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const adminLoginRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const resetRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 30 });

function registerRoutes(app) {

    // ----- Health check -----
    app.get("/api/health", function (req, res) {
        res.json({ status: "ok", time: new Date().toISOString() });
    });

    // ----- Farmer auth -----
    app.post("/api/register", registerRateLimit, authController.register);
    app.post("/api/login", authRateLimit, authController.login);
    app.get("/api/profile", requireFarmer, authController.getProfile);
    app.put("/api/profile", requireFarmer, authController.updateProfile);

    app.post("/api/logout", function (req, res) {
        // JWTs are stateless — there is nothing to invalidate server-side.
        // The client discards the token, which is sufficient here.
        res.json({ message: "Logged out." });
    });

    // ----- Admin auth -----
    app.post("/api/admin/login", adminLoginRateLimit, adminAuthController.login);

    // ----- Password reset (shared) -----
    app.post("/api/forgot-password", resetRateLimit, passwordResetController.forgotPassword);
    app.post("/api/reset-password", resetRateLimit, passwordResetController.resetPassword);

    // ----- Market prices -----
    app.get("/api/market-prices", marketPriceController.list);
    app.post("/api/market-prices", requireAdmin, marketPriceController.create);
    app.put("/api/market-prices/:id", requireAdmin, marketPriceController.update);
    app.delete("/api/market-prices/:id", requireAdmin, marketPriceController.remove);

}

module.exports = registerRoutes;
