// ========================================
// ADMIN AUTH CONTROLLER
// ========================================

const adminModel = require("../models/adminModel");
const { verifyPassword } = require("../lib/password");
const jwt = require("../lib/jwt");

async function login(req, res) {

    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    const admin = await adminModel.findByUsername(username);

    if (!admin || !verifyPassword(password, admin.password_hash)) {
        res.status(401).json({ message: "Invalid admin username or password." });
        return;
    }

    const token = jwt.sign({ sub: admin.id, role: "admin" });

    res.json({
        message: "Admin login successful",
        token: token,
        user: adminModel.toPublic(admin)
    });

}

module.exports = { login };
