// ========================================
// ADMIN MODEL
// ========================================

const db = require("../config/db");

const statements = {

    findByUsername: db.prepare(
        "SELECT * FROM admins WHERE username = ? COLLATE NOCASE"
    ),

    findByEmail: db.prepare(
        "SELECT * FROM admins WHERE email = ? COLLATE NOCASE"
    ),

    findById: db.prepare(
        "SELECT * FROM admins WHERE id = ?"
    ),

    updatePassword: db.prepare(
        "UPDATE admins SET password_hash = ? WHERE id = ?"
    )

};

function toPublic(admin) {

    if (!admin) {
        return null;
    }

    return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: "admin"
    };

}

module.exports = {

    async findByUsername(username) {
        return await statements.findByUsername.get(username);
    },

    async findByEmail(email) {
        return await statements.findByEmail.get(email);
    },

    async findById(id) {
        return await statements.findById.get(id);
    },

    async updatePassword(id, passwordHash) {
        await statements.updatePassword.run(passwordHash, id);
    },

    toPublic

};
