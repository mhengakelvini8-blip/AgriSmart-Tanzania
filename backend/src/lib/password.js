// ========================================
// PASSWORD HASHING
// Uses scrypt (via Node's built-in crypto module).
// scrypt is a memory-hard KDF explicitly recommended
// by OWASP as an alternative to bcrypt — this gives
// bcrypt-equivalent security with zero dependencies.
// ========================================

const crypto = require("crypto");

const KEY_LENGTH = 64;

function hashPassword(plainPassword) {

    const salt = crypto.randomBytes(16).toString("hex");

    const derivedKey = crypto.scryptSync(plainPassword, salt, KEY_LENGTH);

    return salt + ":" + derivedKey.toString("hex");

}

function verifyPassword(plainPassword, storedHash) {

    if (!storedHash || storedHash.indexOf(":") === -1) {
        return false;
    }

    const [salt, originalHashHex] = storedHash.split(":");

    const derivedKey = crypto.scryptSync(plainPassword, salt, KEY_LENGTH);
    const originalHash = Buffer.from(originalHashHex, "hex");

    if (derivedKey.length !== originalHash.length) {
        return false;
    }

    // Constant-time comparison to avoid timing attacks.
    return crypto.timingSafeEqual(derivedKey, originalHash);

}

module.exports = { hashPassword, verifyPassword };
