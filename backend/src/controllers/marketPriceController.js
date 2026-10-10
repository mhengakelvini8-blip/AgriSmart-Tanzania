// ========================================
// MARKET PRICE CONTROLLER
// ========================================

const marketPriceModel = require("../models/marketPriceModel");
const { required, firstError } = require("../lib/validate");

function toPublic(row) {

    return {
        id: row.id,
        crop: row.crop,
        price: row.price,
        unit: row.unit,
        region: row.region,
        market: row.market,
        updated: row.updated
    };

}

async function list(req, res) {
    const rows = await marketPriceModel.all();
    res.json(rows.map(toPublic));
}

function validateBody(body) {

    return firstError([
        () => required(body.crop, "Crop"),
        () => required(body.price, "Price"),
        () => (isNaN(parseFloat(body.price)) ? "Price must be a number." : null),
        () => required(body.unit, "Unit"),
        () => required(body.region, "Region"),
        () => required(body.market, "Market"),
        () => required(body.updated, "Updated date")
    ]);

}

async function create(req, res) {

    const error = validateBody(req.body);

    if (error) {
        res.status(400).json({ message: error });
        return;
    }

    const row = await marketPriceModel.create({
        crop: String(req.body.crop).trim(),
        price: parseFloat(req.body.price),
        unit: String(req.body.unit).trim(),
        region: String(req.body.region).trim(),
        market: String(req.body.market).trim(),
        updated: String(req.body.updated).trim()
    });

    res.status(201).json({
        message: "Market price added successfully",
        data: toPublic(row)
    });

}

async function update(req, res) {

    const id = parseInt(req.params.id, 10);
    const existing = await marketPriceModel.findById(id);

    if (!existing) {
        res.status(404).json({ message: "Market price not found." });
        return;
    }

    const error = validateBody(req.body);

    if (error) {
        res.status(400).json({ message: error });
        return;
    }

    const row = await marketPriceModel.update(id, {
        crop: String(req.body.crop).trim(),
        price: parseFloat(req.body.price),
        unit: String(req.body.unit).trim(),
        region: String(req.body.region).trim(),
        market: String(req.body.market).trim(),
        updated: String(req.body.updated).trim()
    });

    res.json({
        message: "Market price updated successfully",
        data: toPublic(row)
    });

}

async function remove(req, res) {

    const id = parseInt(req.params.id, 10);
    const deleted = await marketPriceModel.remove(id);

    if (!deleted) {
        res.status(404).json({ message: "Market price not found." });
        return;
    }

    res.json({ message: "Market price deleted." });

}

module.exports = { list, create, update, remove };
