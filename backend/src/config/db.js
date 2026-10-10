// ========================================
// DATABASE
// Two swappable backends behind one interface
// (prepare/initDb), so models never know or care
// which one is active:
//
//   - node:sqlite (built-in, zero dependency) for
//     local development — fully synchronous,
//     schema is ready the instant this file loads.
//
//   - Turso (libSQL, a hosted SQLite-compatible
//     database) for production — used automatically
//     whenever TURSO_DATABASE_URL is set. This is
//     what makes data survive a free-tier host
//     restarting or redeploying your app, which
//     would otherwise wipe a local file.
//
// Swapping to Postgres/MySQL later only means
// rewriting this one file and the files in
// src/models/ — nothing else in the app touches
// SQL directly. See README "Scaling up".
// ========================================

const path = require("path");
const fs = require("fs");
const config = require("./env");
const { hashPassword } = require("../lib/password");

const useTurso = Boolean(config.TURSO_DATABASE_URL);

const SCHEMA_STATEMENTS = [

    `CREATE TABLE IF NOT EXISTS farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farm_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        region TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,

    `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,

    `CREATE TABLE IF NOT EXISTS market_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop TEXT NOT NULL,
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        region TEXT NOT NULL,
        market TEXT NOT NULL,
        updated TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS password_reset_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_type TEXT NOT NULL CHECK (account_type IN ('farmer', 'admin')),
        email TEXT NOT NULL COLLATE NOCASE,
        code TEXT NOT NULL,
        expires_at INTEGER NOT NULL
    );`,

    `CREATE INDEX IF NOT EXISTS idx_reset_codes_lookup
     ON password_reset_codes (account_type, email);`

];

let rawDb;       // node:sqlite DatabaseSync instance (local dev only)
let tursoClient; // @libsql/client instance (production/Turso only)
let initialized = false;

function seedDefaultAdminSync() {

    const row = rawDb
        .prepare("SELECT COUNT(*) AS count FROM admins")
        .get();

    if (row.count === 0) {

        rawDb.prepare(
            `INSERT INTO admins (username, email, password_hash)
             VALUES (?, ?, ?)`
        ).run(
            config.DEFAULT_ADMIN_USERNAME,
            config.DEFAULT_ADMIN_EMAIL,
            hashPassword(config.DEFAULT_ADMIN_PASSWORD)
        );

        console.log("[db] Seeded initial administrator account.");

    }

}

if (useTurso) {

    // Only required (and only needs to be installed) when actually
    // deploying with Turso — see README "Deploying for free".
    const { createClient } = require("@libsql/client");

    tursoClient = createClient({
        url: config.TURSO_DATABASE_URL,
        authToken: config.TURSO_AUTH_TOKEN || undefined
    });

} else {

    const { DatabaseSync } = require("node:sqlite");

    fs.mkdirSync(path.dirname(config.DB_PATH), { recursive: true });

    rawDb = new DatabaseSync(config.DB_PATH);

    rawDb.exec("PRAGMA journal_mode = WAL;");
    rawDb.exec("PRAGMA foreign_keys = ON;");

    SCHEMA_STATEMENTS.forEach(function (sql) {
        rawDb.exec(sql);
    });

    seedDefaultAdminSync();

}

// Called once by server.js (and by the migrate script) before
// accepting any requests. For node:sqlite this is a no-op — schema
// creation above already happened synchronously, the instant this
// file was required. For Turso it does the real (async) migration
// and seeding work over the network.
async function initDb() {

    if (!useTurso || initialized) {
        return;
    }

    initialized = true;

    for (const sql of SCHEMA_STATEMENTS) {
        await tursoClient.execute(sql);
    }

    const result = await tursoClient.execute(
        "SELECT COUNT(*) AS count FROM admins"
    );

    if (result.rows[0].count === 0) {

        await tursoClient.execute({
            sql: `INSERT INTO admins (username, email, password_hash)
                  VALUES (?, ?, ?)`,
            args: [
                config.DEFAULT_ADMIN_USERNAME,
                config.DEFAULT_ADMIN_EMAIL,
                hashPassword(config.DEFAULT_ADMIN_PASSWORD)
            ]
        });

        console.log("[db] Seeded initial administrator account.");

    }

}

// Uniform statement interface used by every model:
//   db.prepare(sql).run(...args)   -> { changes, lastInsertRowid }
//   db.prepare(sql).get(...args)   -> one row (or undefined)
//   db.prepare(sql).all(...args)   -> an array of rows
//
// Models always `await` these, which is safe and correct whether
// the underlying call is actually async (Turso) or already-resolved
// (node:sqlite) — `await` on a plain value just resolves immediately.
function prepare(sql) {

    if (!useTurso) {
        return rawDb.prepare(sql);
    }

    return {

        async run(...args) {

            const result = await tursoClient.execute({ sql, args });

            return {
                changes: result.rowsAffected,
                lastInsertRowid: Number(result.lastInsertRowid || 0)
            };

        },

        async get(...args) {
            const result = await tursoClient.execute({ sql, args });
            return result.rows[0];
        },

        async all(...args) {
            const result = await tursoClient.execute({ sql, args });
            return result.rows;
        }

    };

}

// Close the underlying database during graceful shutdown and tests.
// SQLite file handles must be released before Windows can delete the DB.
async function close() {
    if (rawDb) {
        rawDb.close();
        rawDb = null;
    }

    if (tursoClient) {
        await tursoClient.close();
        tursoClient = null;
    }

    initialized = false;
}

module.exports = { prepare, initDb, close };
