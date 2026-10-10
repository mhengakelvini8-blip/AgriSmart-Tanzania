// ========================================
// MARKET PRICE MODEL
// ========================================

const db = require("../config/db");

const statements = {

    all: db.prepare("SELECT * FROM market_prices ORDER BY id DESC"),

    findById: db.prepare("SELECT * FROM market_prices WHERE id = ?"),

    insert: db.prepare(
        `INSERT INTO market_prices (crop, price, unit, region, market, updated)
         VALUES (?, ?, ?, ?, ?, ?)`
    ),

    update: db.prepare(
        `UPDATE market_prices
         SET crop = ?, price = ?, unit = ?, region = ?, market = ?, updated = ?
         WHERE id = ?`
    ),

    remove: db.prepare("DELETE FROM market_prices WHERE id = ?")

};

module.exports = {

    async all() {
        return await statements.all.all();
    },

    async findById(id) {
        return await statements.findById.get(id);
    },

    async create(data) {
        const result = await statements.insert.run(
            data.crop, data.price, data.unit, data.region, data.market, data.updated
        );
        return await statements.findById.get(result.lastInsertRowid);
    },

    async update(id, data) {
        await statements.update.run(
            data.crop, data.price, data.unit, data.region, data.market, data.updated, id
        );
        return await statements.findById.get(id);
    },

    async remove(id) {
        const result = await statements.remove.run(id);
        return result.changes > 0;
    }

};
