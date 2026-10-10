// ========================================
// PASSWORD RESET CODE MODEL
// Persisted to the database (not just an in-memory
// Map) so a reset code survives a server restart
// during its 10-minute lifetime, same as everything
// else in this app now.
// ========================================

const db = require("../config/db");

const statements = {

    insert: db.prepare(
        `INSERT INTO password_reset_codes (account_type, email, code, expires_at)
         VALUES (?, ?, ?, ?)`
    ),

    findLatest: db.prepare(
        `SELECT * FROM password_reset_codes
         WHERE account_type = ? AND email = ? COLLATE NOCASE
         ORDER BY id DESC LIMIT 1`
    ),

    deleteForEmail: db.prepare(
        `DELETE FROM password_reset_codes
         WHERE account_type = ? AND email = ? COLLATE NOCASE`
    ),

    deleteExpired: db.prepare(
        "DELETE FROM password_reset_codes WHERE expires_at < ?"
    )

};

module.exports = {

    async create(accountType, email, code, expiresAt) {
        // Only one active code per account at a time.
        await statements.deleteForEmail.run(accountType, email);
        await statements.insert.run(accountType, email, code, expiresAt);
    },

    async findLatest(accountType, email) {
        return await statements.findLatest.get(accountType, email);
    },

    async consume(accountType, email) {
        await statements.deleteForEmail.run(accountType, email);
    },

    async clearExpired() {
        await statements.deleteExpired.run(Date.now());
    }

};
