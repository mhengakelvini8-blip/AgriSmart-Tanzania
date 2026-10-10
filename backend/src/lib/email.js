// Transactional email delivery via Resend HTTP API (no extra dependency).
const config = require("../config/env");

async function sendPasswordResetEmail(to, code, role) {
    if (!config.RESEND_API_KEY || !config.EMAIL_FROM) {
        if (config.isProduction) {
            throw new Error("Password reset email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
        }
        return false;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + config.RESEND_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: config.EMAIL_FROM,
            to: [to],
            subject: "AgriSmart Tanzania password reset",
            text: "Your AgriSmart Tanzania " + role + " password reset code is " + code + ". It expires in 10 minutes. If you did not request this, ignore this email.",
            html: "<p>Your AgriSmart Tanzania password reset code is:</p><p style=\"font-size:28px;font-weight:bold;letter-spacing:5px\">" + code + "</p><p>This code expires in 10 minutes. If you did not request this, ignore this email.</p>"
        })
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("Password reset email provider error:", response.status, detail.slice(0, 300));
        throw new Error("Password reset email could not be sent.");
    }
    return true;
}

module.exports = { sendPasswordResetEmail };
