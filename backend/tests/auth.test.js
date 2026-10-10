// ========================================
// AUTH TESTS
// Run with:  npm test   (or: node --test)
// Uses Node's built-in test runner + built-in fetch
// — no Jest/Mocha/Supertest dependency needed.
// ========================================

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.DB_PATH = path.join(__dirname, "test-auth.sqlite");

// Start from a clean database for this test file.
[".sqlite", ".sqlite-shm", ".sqlite-wal"].forEach(function (ext) {
    const file = process.env.DB_PATH.replace(".sqlite", ext);
    if (fs.existsSync(file)) fs.unlinkSync(file);
});

const app = require("../src/app");

let server;
let baseUrl;

before(function () {
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = "http://localhost:" + port;
});

after(async function () {
    // Stop accepting requests and wait for the HTTP server to finish
    // before closing SQLite and deleting its files (required on Windows).
    if (server && server.listening) {
        await new Promise(function (resolve, reject) {
            server.close(function (error) {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    await require("../src/config/db").close();

    [".sqlite", ".sqlite-shm", ".sqlite-wal"].forEach(function (ext) {
        const file = process.env.DB_PATH.replace(".sqlite", ext);
        if (fs.existsSync(file)) fs.unlinkSync(file);
    });
});

async function postJson(pathname, body, token) {

    const headers = { "Content-Type": "application/json" };

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    const response = await fetch(baseUrl + pathname, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    return { status: response.status, data: await response.json() };

}

test("health check responds ok", async function () {
    const response = await fetch(baseUrl + "/api/health");
    assert.equal(response.status, 200);
});

test("register rejects a short password", async function () {

    const { status, data } = await postJson("/api/register", {
        farmName: "Test Farm",
        region: "Njombe",
        email: "test@example.com",
        password: "123"
    });

    assert.equal(status, 400);
    assert.match(data.message, /at least 6 characters/);

});

test("register rejects an invalid email", async function () {

    const { status, data } = await postJson("/api/register", {
        farmName: "Test Farm",
        region: "Njombe",
        email: "not-an-email",
        password: "secret6"
    });

    assert.equal(status, 400);
    assert.match(data.message, /valid email/);

});

test("register creates a farmer and returns a usable token", async function () {

    const { status, data } = await postJson("/api/register", {
        farmName: "Kelvini Farm",
        region: "Njombe",
        email: "kelvini@example.com",
        password: "secret6"
    });

    assert.equal(status, 201);
    assert.equal(data.user.farmName, "Kelvini Farm");
    assert.equal(data.user.region, "Njombe");
    assert.ok(data.token);
    assert.equal(data.user.password, undefined, "password must never be returned");

});

test("register rejects a duplicate farm name", async function () {

    const { status, data } = await postJson("/api/register", {
        farmName: "Kelvini Farm",
        region: "Mbeya",
        email: "someoneelse@example.com",
        password: "secret6"
    });

    assert.equal(status, 409);
    assert.match(data.message, /already taken/);

});

test("register rejects a duplicate email", async function () {

    const { status, data } = await postJson("/api/register", {
        farmName: "A Different Farm",
        region: "Mbeya",
        email: "kelvini@example.com",
        password: "secret6"
    });

    assert.equal(status, 409);
    assert.match(data.message, /already registered/);

});

test("login fails with the wrong password", async function () {

    const { status, data } = await postJson("/api/login", {
        farmName: "Kelvini Farm",
        password: "wrongpassword"
    });

    assert.equal(status, 401);
    assert.match(data.message, /Invalid farm name or password/);

});

test("login succeeds with the right password", async function () {

    const { status, data } = await postJson("/api/login", {
        farmName: "Kelvini Farm",
        password: "secret6"
    });

    assert.equal(status, 200);
    assert.ok(data.token);

});

test("profile requires authentication", async function () {

    const response = await fetch(baseUrl + "/api/profile");
    assert.equal(response.status, 401);

});

test("profile returns data for a valid token, and survives a fresh app instance (stateless JWT)", async function () {

    const login = await postJson("/api/login", { farmName: "Kelvini Farm", password: "secret6" });
    const token = login.data.token;

    // Re-require the app fresh, simulating a server restart. Because
    // JWTs are stateless (unlike the old in-memory session Set), the
    // same token must still work.
    delete require.cache[require.resolve("../src/app")];
    const restartedApp = require("../src/app");
    const restartedServer = restartedApp.listen(0);
    const restartedPort = restartedServer.address().port;

    const response = await fetch("http://localhost:" + restartedPort + "/api/profile", {
        headers: { Authorization: "Bearer " + token }
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.user.farmName, "Kelvini Farm");

    await new Promise(function (resolve, reject) {
        restartedServer.close(function (error) {
            if (error) reject(error);
            else resolve();
        });
    });

});

test("profile update rejects a taken email", async function () {

    await postJson("/api/register", {
        farmName: "Second Farm", region: "Mbeya",
        email: "second@example.com", password: "secret6"
    });

    const login = await postJson("/api/login", { farmName: "Kelvini Farm", password: "secret6" });

    const response = await fetch(baseUrl + "/api/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + login.data.token
        },
        body: JSON.stringify({ email: "second@example.com" })
    });

    const data = await response.json();

    assert.equal(response.status, 409);
    assert.match(data.message, /already registered/);

});

test("forgot-password issues a code, and reset-password with it changes the password", async function () {

    const forgot = await postJson("/api/forgot-password", {
        email: "kelvini@example.com",
        role: "farmer"
    });

    assert.equal(forgot.status, 200);
    assert.match(forgot.data.code, /^\d{6}$/);

    const badCode = await postJson("/api/reset-password", {
        email: "kelvini@example.com", role: "farmer",
        code: "000000", newPassword: "brandnew1"
    });

    assert.equal(badCode.status, 400);

    const reset = await postJson("/api/reset-password", {
        email: "kelvini@example.com", role: "farmer",
        code: forgot.data.code, newPassword: "brandnew1"
    });

    assert.equal(reset.status, 200);

    const oldLogin = await postJson("/api/login", { farmName: "Kelvini Farm", password: "secret6" });
    assert.equal(oldLogin.status, 401);

    const newLogin = await postJson("/api/login", { farmName: "Kelvini Farm", password: "brandnew1" });
    assert.equal(newLogin.status, 200);

    // The code should be single-use.
    const reused = await postJson("/api/reset-password", {
        email: "kelvini@example.com", role: "farmer",
        code: forgot.data.code, newPassword: "anotherone1"
    });

    assert.equal(reused.status, 400);

});

test("admin login works with the seeded default admin", async function () {

    const { status, data } = await postJson("/api/admin/login", {
        username: "admin",
        password: "admin123"
    });

    assert.equal(status, 200);
    assert.ok(data.token);
    assert.equal(data.user.role, "admin");

});

test("admin login fails with the wrong password", async function () {

    const { status } = await postJson("/api/admin/login", {
        username: "admin",
        password: "wrong"
    });

    assert.equal(status, 401);

});

test("a farmer token cannot access admin-only routes", async function () {

    const login = await postJson("/api/login", { farmName: "Kelvini Farm", password: "brandnew1" });

    const response = await fetch(baseUrl + "/api/market-prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + login.data.token
        },
        body: JSON.stringify({
            crop: "Rice", price: 1000, unit: "per kg",
            region: "Mbeya", market: "Mbeya Market", updated: "2026-09-30"
        })
    });

    assert.equal(response.status, 401);

});
