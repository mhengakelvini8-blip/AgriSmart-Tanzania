// ========================================
// MIGRATE LEGACY JSON DATA INTO SQLITE (OR TURSO)
// One-time script: imports the old data/users.json,
// data/admin-users.json and data/market-prices.json
// into the new database, if they still exist and
// the database is empty. Safe to run more than once
// — it skips rows that are already present.
//
// Run with:  npm run migrate
// (Works against Turso too if TURSO_DATABASE_URL is
// set in backend/.env — same command either way.)
// ========================================

const fs = require("fs");
const path = require("path");
const db = require("../src/config/db");
const { hashPassword } = require("../src/lib/password");

const dataDir = path.join(__dirname, "../../data");

function readJson(filename) {

    const filePath = path.join(dataDir, filename);

    if (!fs.existsSync(filePath)) {
        return [];
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
        console.error("Could not parse " + filename + ":", error.message);
        return [];
    }

}

async function migrateFarmers() {

    const users = readJson("users.json");
    let imported = 0;

    for (const user of users) {

        if (!user.farmName || !user.email || !user.passwordHash) {
            continue;
        }

        const exists = await db
            .prepare("SELECT id FROM farmers WHERE farm_name = ? COLLATE NOCASE")
            .get(user.farmName);

        if (exists) {
            continue;
        }

        await db.prepare(
            `INSERT INTO farmers (farm_name, region, email, password_hash, created_at)
             VALUES (?, ?, ?, ?, ?)`
        ).run(
            user.farmName,
            user.region || "",
            user.email,
            user.passwordHash,
            user.createdAt || new Date().toISOString()
        );

        imported += 1;

    }

    console.log("Farmers imported: " + imported + " / " + users.length);

}

async function migrateAdmins() {

    const admins = readJson("admin-users.json");
    let imported = 0;

    for (const admin of admins) {

        if (!admin.username || !admin.password) {
            continue;
        }

        const exists = await db
            .prepare("SELECT id FROM admins WHERE username = ? COLLATE NOCASE")
            .get(admin.username);

        if (exists) {

            // Keep the email in sync since forgot-password depends on it.
            if (admin.email) {
                await db.prepare("UPDATE admins SET email = ? WHERE username = ? COLLATE NOCASE")
                    .run(admin.email, admin.username);
            }

            continue;

        }

        // Legacy admin passwords were stored in plain text — hash it now.
        await db.prepare(
            `INSERT INTO admins (username, email, password_hash)
             VALUES (?, ?, ?)`
        ).run(
            admin.username,
            admin.email || "admin@example.com",
            hashPassword(admin.password)
        );

        imported += 1;

    }

    console.log("Admins imported: " + imported + " / " + admins.length);

}

async function migrateMarketPrices() {

    const prices = readJson("market-prices.json");
    const existingCountRow = await db.prepare("SELECT COUNT(*) AS c FROM market_prices").get();

    if (existingCountRow.c > 0) {
        console.log("Market prices already present in the database — skipping.");
        return;
    }

    let imported = 0;

    for (const price of prices) {

        await db.prepare(
            `INSERT INTO market_prices (crop, price, unit, region, market, updated)
             VALUES (?, ?, ?, ?, ?, ?)`
        ).run(
            price.crop, price.price, price.unit, price.region, price.market, price.updated
        );

        imported += 1;

    }

    console.log("Market prices imported: " + imported + " / " + prices.length);

}

(async function main() {

    await db.initDb();

    await migrateFarmers();
    await migrateAdmins();
    await migrateMarketPrices();

    console.log("Migration complete.");

})().catch(function (error) {

    console.error("Migration failed:", error);
    process.exit(1);

});
