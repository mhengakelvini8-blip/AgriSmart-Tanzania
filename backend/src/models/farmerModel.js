// ========================================
// FARMER MODEL
// All SQL for the farmers table lives here — the
// rest of the app never writes raw SQL directly.
// Prepared statements protect against SQL injection.
// ========================================

const db = require("../config/db");

const statements = {

    insert: db.prepare(
        `INSERT INTO farmers (farm_name, region, email, password_hash)
         VALUES (?, ?, ?, ?)`
    ),

    findByFarmName: db.prepare(
        "SELECT * FROM farmers WHERE farm_name = ? COLLATE NOCASE"
    ),

    findByEmail: db.prepare(
        "SELECT * FROM farmers WHERE email = ? COLLATE NOCASE"
    ),

    findById: db.prepare(
        "SELECT * FROM farmers WHERE id = ?"
    ),

    updateProfile: db.prepare(
        `UPDATE farmers
         SET farm_name = ?, region = ?, email = ?
         WHERE id = ?`
    ),

    updatePassword: db.prepare(
        "UPDATE farmers SET password_hash = ? WHERE id = ?"
    )

};

function toPublic(farmer) {

    if (!farmer) {
        return null;
    }

    return {
        id: farmer.id,
        farmName: farmer.farm_name,
        region: farmer.region,
        email: farmer.email
    };

}

module.exports = {

    async create(farmName, region, email, passwordHash) {
        const result = await statements.insert.run(farmName, region, email, passwordHash);
        return await statements.findById.get(result.lastInsertRowid);
    },

    async findByFarmName(farmName) {
        return await statements.findByFarmName.get(farmName);
    },

    async findByEmail(email) {
        return await statements.findByEmail.get(email);
    },

    async findById(id) {
        return await statements.findById.get(id);
    },

    async updateProfile(id, farmName, region, email) {
        await statements.updateProfile.run(farmName, region, email, id);
        return await statements.findById.get(id);
    },

    async updatePassword(id, passwordHash) {
        await statements.updatePassword.run(passwordHash, id);
    },

    toPublic

};
