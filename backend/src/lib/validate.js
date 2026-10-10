// ========================================
// VALIDATION HELPERS
// Small, explicit validators — the same idea as
// "express-validator" but with zero dependencies.
// Each function returns an error string, or null
// if the value is valid.
// ========================================

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value, label) {
    if (value === undefined || value === null || String(value).trim() === "") {
        return label + " is required.";
    }
    return null;
}

function minLength(value, min, label) {
    if (String(value || "").trim().length < min) {
        return label + " must be at least " + min + " characters.";
    }
    return null;
}

function isEmail(value) {
    return EMAIL_PATTERN.test(String(value || "").trim());
}

function validateEmail(value, label) {
    if (!isEmail(value)) {
        return (label || "Email") + " must be a valid email address.";
    }
    return null;
}

// Runs a list of [value, ...validators] checks and returns the
// first error found, or null if everything passes.
function firstError(checks) {

    for (const check of checks) {

        const error = check();

        if (error) {
            return error;
        }

    }

    return null;

}

module.exports = {
    required,
    minLength,
    isEmail,
    validateEmail,
    firstError
};
