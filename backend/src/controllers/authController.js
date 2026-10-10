// ========================================
// FARMER AUTH CONTROLLER
// ========================================

const farmerModel = require("../models/farmerModel");
const { hashPassword, verifyPassword } = require("../lib/password");
const jwt = require("../lib/jwt");
const { required, minLength, validateEmail, firstError } = require("../lib/validate");

function issueToken(farmer) {
    return jwt.sign({ sub: farmer.id, role: "farmer" });
}

async function register(req, res) {

    const farmName = String(req.body.farmName || "").trim();
    const region = String(req.body.region || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const error = firstError([
        () => required(farmName, "Farm name / username") || minLength(farmName, 3, "Farm name / username"),
        () => required(region, "Region"),
        () => validateEmail(email),
        () => minLength(password, 6, "Password")
    ]);

    if (error) {
        res.status(400).json({ message: error });
        return;
    }

    if (await farmerModel.findByFarmName(farmName)) {
        res.status(409).json({ message: "That farm name / username is already taken." });
        return;
    }

    if (await farmerModel.findByEmail(email)) {
        res.status(409).json({ message: "That email is already registered." });
        return;
    }

    const farmer = await farmerModel.create(farmName, region, email, hashPassword(password));

    res.status(201).json({
        message: "Account created successfully",
        token: issueToken(farmer),
        user: farmerModel.toPublic(farmer)
    });

}

async function login(req, res) {

    const farmName = String(req.body.farmName || "").trim();
    const password = String(req.body.password || "");

    const farmer = await farmerModel.findByFarmName(farmName);

    if (!farmer || !verifyPassword(password, farmer.password_hash)) {
        res.status(401).json({ message: "Invalid farm name or password." });
        return;
    }

    res.json({
        message: "Login successful",
        token: issueToken(farmer),
        user: farmerModel.toPublic(farmer)
    });

}

async function getProfile(req, res) {

    const farmer = await farmerModel.findById(req.user.sub);

    if (!farmer) {
        res.status(404).json({ message: "User not found." });
        return;
    }

    res.json({ user: farmerModel.toPublic(farmer) });

}

async function updateProfile(req, res) {

    const current = await farmerModel.findById(req.user.sub);

    if (!current) {
        res.status(404).json({ message: "User not found." });
        return;
    }

    const farmName = req.body.farmName ? String(req.body.farmName).trim() : current.farm_name;
    const region = req.body.region ? String(req.body.region).trim() : current.region;
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : current.email;

    const error = firstError([
        () => minLength(farmName, 3, "Farm name / username"),
        () => validateEmail(email)
    ]);

    if (error) {
        res.status(400).json({ message: error });
        return;
    }

    const farmNameTaken = await farmerModel.findByFarmName(farmName);
    if (farmNameTaken && farmNameTaken.id !== current.id) {
        res.status(409).json({ message: "That farm name / username is already taken." });
        return;
    }

    const emailTaken = await farmerModel.findByEmail(email);
    if (emailTaken && emailTaken.id !== current.id) {
        res.status(409).json({ message: "That email is already registered." });
        return;
    }

    const updated = await farmerModel.updateProfile(current.id, farmName, region, email);

    if (req.body.password) {

        const passwordError = minLength(req.body.password, 6, "Password");

        if (passwordError) {
            res.status(400).json({ message: passwordError });
            return;
        }

        await farmerModel.updatePassword(current.id, hashPassword(String(req.body.password)));

    }

    res.json({
        message: "Profile updated successfully",
        user: farmerModel.toPublic(updated)
    });

}

module.exports = { register, login, getProfile, updateProfile };
