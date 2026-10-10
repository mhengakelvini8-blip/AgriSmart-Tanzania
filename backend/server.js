// ========================================
// AGRISMART TANZANIA - BACKEND ENTRY POINT
// ========================================

const config = require("./src/config/env");
const db = require("./src/config/db");
const app = require("./src/app");

(async function start() {

    // No-op for local SQLite (already ready); does the real async
    // schema setup when running against Turso in production.
    await db.initDb();

    app.listen(config.PORT, function () {

        console.log("AgriSmart Tanzania API running on http://localhost:" + config.PORT);
        console.log("Environment: " + config.NODE_ENV);
        console.log(
            "Database: " +
            (config.TURSO_DATABASE_URL ? "Turso (" + config.TURSO_DATABASE_URL + ")" : config.DB_PATH)
        );

    });

})().catch(function (error) {

    console.error("Failed to start server:", error);
    process.exit(1);

});
