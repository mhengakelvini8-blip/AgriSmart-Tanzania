# AgriSmart Tanzania

A full-stack agricultural platform for Tanzanian farmers: soil analysis,
crop recommendations, market prices, farmer accounts, and an admin
panel — in English and Kiswahili.

This started as a class project. This version is built the way a real
small product is built: a layered backend, a real database, token-based
auth, input validation, automated tests, and security middleware.

## What changed from the previous version

| Before | Now |
|---|---|
| Data in flat `.json` files | Real SQL database — local SQLite for dev, [Turso](https://turso.tech) for free-tier hosting |
| One 1,400-line `server.js` | Layered: routes → controllers → models, like a real API |
| Admin "logged in" tracked in server memory (**wiped on every restart — this caused the "Admin authentication required" bug**) | Stateless JWTs — a restart no longer logs anyone out |
| No tests | 21 automated tests covering auth, validation, and admin permissions |
| No input validation layer | A real validation layer, consistent error responses |
| No rate limiting | Login/register/reset endpoints are rate-limited against brute-force |
| Plain-text admin password in a file | Every password (farmer and admin) is salted + hashed |

## Architecture

```
backend/
  server.js              entry point
  src/
    app.js                wires middleware + routes together
    config/
      env.js               loads .env, validates config
      db.js                database connection, schema, seeding —
                            see "Database: local vs. production" below
    lib/
      httpKit.js           see "About the framework choice" below
      jwt.js                JWT sign/verify (RFC 7519, HS256)
      password.js           password hashing (scrypt)
      validate.js            small validation helpers
    middleware/
      auth.js                requireFarmer / requireAdmin
      rateLimit.js            brute-force protection
      security.js             security headers, CORS, request logging
    models/                 one file per DB table — all SQL lives here
    controllers/            request handling + business logic
    routes/                 URL → controller mapping
  scripts/
    migrate-json-to-sqlite.js   one-time import of the old .json data
  tests/
    auth.test.js, marketPrices.test.js
```

This is the same shape as a production Express/Node API (routes,
controllers, models, middleware, config) — if you've used Express
before, this will look very familiar.

## About the framework choice

This was built in an environment with no internet access for `npm
install`, so instead of the `express` package, `src/lib/httpKit.js` is
a small hand-written layer that gives you the **same API**:
`app.get/post/put/delete`, `app.use`, `:params`, `req.body`,
`res.status().json()`. The rest of the codebase (routes, controllers,
middleware) is written exactly as it would be with real Express.

**If you want literal `express` in your `package.json`** (e.g. for a
course requirement or your CV), that's a very small change:
```
npm install express cors helmet
```
then in `src/app.js`, replace:
```js
const { createApp } = require("./lib/httpKit");
const app = createApp();
```
with:
```js
const express = require("express");
const app = express();
app.use(express.json());
```
and swap `require("./middleware/security")` for `require("cors")()` /
`require("helmet")()`. Every route and controller stays the same,
because they're already written to that API shape.

The same applies to `src/lib/jwt.js` (→ `jsonwebtoken`) and
`src/lib/password.js` (→ `bcryptjs`) if you'd rather depend on the
named packages. I built it dependency-free first so it runs instantly
and I could test every line myself — but it's designed to be swapped
out in minutes once you're on a machine with internet access.

## Database: local vs. production

`src/config/db.js` supports two backends behind one identical
interface, so nothing else in the app (models, controllers, routes)
needs to know or care which one is active:

- **Local development (default)**: a local SQLite file via Node's
  built-in `node:sqlite` — zero setup, zero network calls, fully
  synchronous, and what every automated test in this project runs
  against.
- **Production**: [Turso](https://turso.tech), a free hosted
  SQLite-compatible database — used automatically the moment
  `TURSO_DATABASE_URL` is set in `.env`. This matters because most
  free hosts (Render included) wipe local files every time your app
  restarts or redeploys; Turso doesn't, because it isn't on the same
  machine as your app.

You don't choose between them in code — just whether `TURSO_DATABASE_URL`
is set. See `DEPLOYMENT.md` for the full walkthrough of setting up Turso
and deploying for free.

## Setup (local development)

```bash
cd backend
npm install          # installs @libsql/client (only used if you set
                      # TURSO_DATABASE_URL — see "Database" above)
npm run migrate      # one-time: loads the sample market prices (and
                      # any accounts from the old data/*.json files)
                      # into the database
npm start
```

Then open `index.html` (e.g. via `python3 -m http.server 8000` in the
project root, or any static file server) — the frontend is unchanged
and talks to the API at `http://localhost:5000`.

For local development only, the backend seeds `admin` / `admin123` by default.
Do not deploy with these credentials. Production startup refuses to proceed
unless you configure a unique admin username, a password of at least 12
characters, a valid admin email, a strong JWT secret, and a specific CORS origin.
Set those environment variables before the production database is initialized.

## Running the tests

```bash
cd backend
npm test
```

21 tests, covering: registration/login validation, duplicate
farm-name/email rejection, authenticated profile access, the full
forgot/reset-password flow (including that a code only works once),
admin login, and — explicitly — that **a login token keeps working
after the server restarts**, which is the exact bug this rebuild fixes.

## Security notes

- Passwords are hashed with `scrypt` (Node's built-in, OWASP-recommended
  memory-hard KDF) — never stored in plain text, farmer or admin.
- Auth uses real JWTs: signed with HMAC-SHA256, inspectable on
  [jwt.io](https://jwt.io), expire after 7 days (`JWT_EXPIRES_IN_SECONDS`
  in `.env`).
- `JWT_SECRET` is auto-generated into `backend/.env` on first run in
  development. **In production you must set your own** (`.env.example`
  shows how) — the server refuses to start without one.
- Login, registration, and password-reset endpoints are rate-limited
  (30 requests/minute/IP by default) to slow down brute-force attempts.
- SQL is 100% parameterized (prepared statements) — no SQL injection
  surface, on either database backend.
- `data/*.sqlite*` and `.env` are git-ignored — never commit real
  credentials, your Turso auth token, or user data.

## Forgot password and email delivery

Password-reset codes are sent through the Resend email API in production.
Set `RESEND_API_KEY` and `EMAIL_FROM` in the backend environment, and
verify the sender domain with Resend before launch. The code expires in
10 minutes. Production API responses never include the code. Local
development returns a code to support local testing only. If email is not
configured in production, reset requests fail safely without exposing a code.
Never publish `data/admin-users.json`; it was removed from the deployable
frontend because it contained plaintext credentials. Configure a unique
admin username, a strong password (at least 12 characters), and a valid
admin email through environment variables before first production startup.

## Swahili / English

Unchanged from before — `js/language.js` on the frontend. Nothing
about this backend rebuild affects it.

## Deploying

See `DEPLOYMENT.md` for a full, free-tier walkthrough: Turso (database)
+ Render (backend) + Cloudflare Pages (frontend). The short version:
set `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`/`JWT_SECRET`/`CORS_ORIGIN`,
`DEFAULT_ADMIN_USERNAME`/`DEFAULT_ADMIN_PASSWORD`/`DEFAULT_ADMIN_EMAIL`,
and `RESEND_API_KEY`/`EMAIL_FROM` as real environment variables wherever you host the backend, and point
`js/config.js`'s `PRODUCTION_API_URL` at that backend's real URL —
that one line is the only frontend file that needs editing to deploy.

## Scaling up from here

- **PostgreSQL/MySQL**: only `src/config/db.js` and the files in
  `src/models/` touch SQL directly — swapping the database engine
  means rewriting those, not the controllers or routes. The same
  "one adapter file" pattern used for the Turso/SQLite split applies.
- **React frontend**: the API is a clean, versioned-ready REST API
  (JSON in, JSON out, JWT bearer auth) completely decoupled from the
  HTML/CSS/JS frontend — that separation is what makes a future React
  (or mobile app) frontend possible without touching the backend at all.
- **Real email**: see "Forgot password and email delivery" above.
- **Always-on hosting**: Render's free tier sleeps after inactivity
  (see `DEPLOYMENT.md`) — a paid tier, or a different host entirely,
  removes that once you need it.
