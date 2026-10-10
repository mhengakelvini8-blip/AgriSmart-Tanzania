// ========================================
// JWT (JSON Web Tokens) — HS256
// A minimal, standards-correct implementation of
// RFC 7519, built on Node's crypto module. This is
// what libraries like "jsonwebtoken" do internally.
//
// Why JWTs instead of an in-memory session Set:
// a JWT's validity is proven by its signature, not
// by the server remembering it — so restarting the
// server no longer logs everyone out.
// ========================================

const crypto = require("crypto");
const config = require("../config/env");

function base64url(input) {

    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

}

function base64urlDecode(input) {

    const padded = input
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");

    return Buffer.from(padded, "base64").toString("utf8");

}

function sign(payload, expiresInSeconds) {

    const header = { alg: "HS256", typ: "JWT" };

    const nowSeconds = Math.floor(Date.now() / 1000);

    const fullPayload = Object.assign({}, payload, {
        iat: nowSeconds,
        exp: nowSeconds + (expiresInSeconds || config.JWT_EXPIRES_IN_SECONDS)
    });

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(fullPayload));

    const signature = crypto
        .createHmac("sha256", config.JWT_SECRET)
        .update(encodedHeader + "." + encodedPayload)
        .digest();

    const encodedSignature = base64url(signature);

    return encodedHeader + "." + encodedPayload + "." + encodedSignature;

}

function verify(token) {

    if (typeof token !== "string" || token.split(".").length !== 3) {
        return null;
    }

    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

    const expectedSignature = base64url(
        crypto
            .createHmac("sha256", config.JWT_SECRET)
            .update(encodedHeader + "." + encodedPayload)
            .digest()
    );

    const signatureBuffer = Buffer.from(encodedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        return null;
    }

    let payload;

    try {
        payload = JSON.parse(base64urlDecode(encodedPayload));
    } catch (error) {
        return null;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === "number" && nowSeconds >= payload.exp) {
        return null; // expired
    }

    return payload;

}

module.exports = { sign, verify };
