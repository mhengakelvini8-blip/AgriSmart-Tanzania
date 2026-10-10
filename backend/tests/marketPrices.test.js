// ========================================
// MARKET PRICE TESTS
// ========================================

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.DB_PATH = path.join(__dirname, "test-prices.sqlite");

[".sqlite", ".sqlite-shm", ".sqlite-wal"].forEach(function (ext) {
    const file = process.env.DB_PATH.replace(".sqlite", ext);
    if (fs.existsSync(file)) fs.unlinkSync(file);
});

delete require.cache[require.resolve("../src/app")];
const app = require("../src/app");

let server;
let baseUrl;
let adminToken;

before(async function () {

    server = app.listen(0);
    baseUrl = "http://localhost:" + server.address().port;

    const login = await fetch(baseUrl + "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "admin123" })
    });

    adminToken = (await login.json()).token;

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

test("market prices list is public and starts empty", async function () {

    const response = await fetch(baseUrl + "/api/market-prices");
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data, []);

});

test("creating a price requires admin auth", async function () {

    const response = await fetch(baseUrl + "/api/market-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            crop: "Maize", price: 1200, unit: "per kg",
            region: "Njombe", market: "Njombe Market", updated: "2026-09-30"
        })
    });

    assert.equal(response.status, 401);

});

test("admin can create, update, and delete a market price", async function () {

    const create = await fetch(baseUrl + "/api/market-prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + adminToken
        },
        body: JSON.stringify({
            crop: "Maize", price: 1200, unit: "per kg",
            region: "Njombe", market: "Njombe Market", updated: "2026-09-30"
        })
    });

    const created = await create.json();

    assert.equal(create.status, 201);
    assert.equal(created.data.crop, "Maize");

    const id = created.data.id;

    const update = await fetch(baseUrl + "/api/market-prices/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + adminToken
        },
        body: JSON.stringify({
            crop: "Maize", price: 1350, unit: "per kg",
            region: "Njombe", market: "Njombe Market", updated: "2026-10-01"
        })
    });

    const updated = await update.json();

    assert.equal(update.status, 200);
    assert.equal(updated.data.price, 1350);

    const list = await (await fetch(baseUrl + "/api/market-prices")).json();
    assert.equal(list.length, 1);

    const del = await fetch(baseUrl + "/api/market-prices/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + adminToken }
    });

    assert.equal(del.status, 200);

    const listAfter = await (await fetch(baseUrl + "/api/market-prices")).json();
    assert.equal(listAfter.length, 0);

});

test("creating a price validates required fields", async function () {

    const response = await fetch(baseUrl + "/api/market-prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + adminToken
        },
        body: JSON.stringify({ crop: "Maize" })
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.ok(data.message);

});

test("updating a non-existent price returns 404", async function () {

    const response = await fetch(baseUrl + "/api/market-prices/99999", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + adminToken
        },
        body: JSON.stringify({
            crop: "Rice", price: 1000, unit: "per kg",
            region: "Mbeya", market: "Mbeya Market", updated: "2026-09-30"
        })
    });

    assert.equal(response.status, 404);

});

test("an expired/garbage admin token is rejected", async function () {

    const response = await fetch(baseUrl + "/api/market-prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer this.is.garbage"
        },
        body: JSON.stringify({
            crop: "Rice", price: 1000, unit: "per kg",
            region: "Mbeya", market: "Mbeya Market", updated: "2026-09-30"
        })
    });

    assert.equal(response.status, 401);

});
