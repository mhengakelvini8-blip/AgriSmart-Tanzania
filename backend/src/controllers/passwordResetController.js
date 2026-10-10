// ========================================
// PASSWORD RESET CONTROLLER
// Shared flow for both farmers and admin.
// Reset codes are emailed in production. Development-only responses
// may include the code to keep local testing convenient.
// ========================================

const farmerModel = require("../models/farmerModel");
const adminModel = require("../models/adminModel");
const resetCodeModel = require("../models/resetCodeModel");
const { hashPassword } = require("../lib/password");
const { validateEmail, minLength } = require("../lib/validate");
const config = require("../config/env");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../lib/email");

async function forgotPassword(req, res) {

    const email = String(req.body.email || "").trim().toLowerCase();
    const role = req.body.role === "admin" ? "admin" : "farmer";

    const emailError = validateEmail(email);

    if (emailError) {
        res.status(400).json({ message: emailError });
        return;
    }

    const account = role === "admin"
        ? await adminModel.findByEmail(email)
        : await farmerModel.findByEmail(email);

    // Use the same public response for unknown accounts to reduce account enumeration.
    const genericMessage = "If an account exists for that email, a reset code has been sent.";
    if (!account) {
        res.json({ message: genericMessage });
        return;
    }

    if (config.isProduction && (!config.RESEND_API_KEY || !config.EMAIL_FROM)) {
        console.error("Password reset requested but RESEND_API_KEY/EMAIL_FROM are not configured.");
        res.status(503).json({ message: "Password reset email service is temporarily unavailable. Please contact support." });
        return;
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const expiresAt = Date.now() + config.RESET_CODE_TTL_MS;

    try {
        await sendPasswordResetEmail(email, code, role);
    } catch (error) {
        console.error("Unable to send password reset email:", error.message);
        res.status(503).json({ message: "Password reset email could not be sent. Please try again later." });
        return;
    }

    await resetCodeModel.create(role, email, code, expiresAt);

    const payload = { message: genericMessage };
    // For local development and existing automated tests only. Never expose reset codes in production.
    if (!config.isProduction) {
        payload.code = code;
        payload.message = "Development reset code created. In production it is emailed to you. The code expires in 10 minutes.";
    }
    res.json(payload);

}

async function resetPassword(req, res) {

    const email = String(req.body.email || "").trim().toLowerCase();
    const role = req.body.role === "admin" ? "admin" : "farmer";
    const code = String(req.body.code || "").trim();
    const newPassword = String(req.body.newPassword || "");

    const passwordError = minLength(newPassword, 6, "Password");

    if (passwordError) {
        res.status(400).json({ message: passwordError });
        return;
    }

    const entry = await resetCodeModel.findLatest(role, email);

    if (!entry || entry.code !== code || Date.now() > entry.expires_at) {
        res.status(400).json({ message: "Invalid or expired reset code." });
        return;
    }

    if (role === "admin") {

        const admin = await adminModel.findByEmail(email);

        if (!admin) {
            res.status(404).json({ message: "Account not found." });
            return;
        }

        await adminModel.updatePassword(admin.id, hashPassword(newPassword));

    } else {

        const farmer = await farmerModel.findByEmail(email);

        if (!farmer) {
            res.status(404).json({ message: "Account not found." });
            return;
        }

        await farmerModel.updatePassword(farmer.id, hashPassword(newPassword));

    }

    await resetCodeModel.consume(role, email);

    res.json({ message: "Password reset successful. You can now log in." });

}

module.exports = { forgotPassword, resetPassword };
