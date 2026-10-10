# Deploying AgriSmart Tanzania for free

This deploys the backend to **Render**, the database to **Turso**, and
the frontend to **Cloudflare Pages** — all free tiers. Do these in
order; each step needs something from the one before it.

## 1. Create your Turso database (the data layer)

Render's free tier wipes local files whenever your app restarts or
redeploys, so the database needs to live somewhere else. Turso is a
free, hosted, SQLite-compatible database — this project already
speaks to it natively (see `backend/src/config/db.js`).

1. Go to [turso.tech](https://turso.tech) and sign up (free).
2. Install their CLI and log in (their site gives you the exact
   command for your OS).
3. Create a database and get its connection details:
   ```
   turso db create agrismart-tanzania
   turso db show agrismart-tanzania --url
   turso db tokens create agrismart-tanzania
   ```
4. Keep the URL (starts with `libsql://...`) and the token somewhere
   safe — you'll paste them into Render in step 2.

## 2. Deploy the backend to Render

1. Push this project to a GitHub repository (Render deploys from Git).
2. On [render.com](https://render.com), click **New → Web Service**
   and connect your repository.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Under **Environment**, add these variables:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | a long random string — generate one locally with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste the result |
   | `TURSO_DATABASE_URL` | the `libsql://...` URL from step 1 |
   | `TURSO_AUTH_TOKEN` | the token from step 1 |
   | `DEFAULT_ADMIN_USERNAME` | a unique administrator username |
   | `DEFAULT_ADMIN_PASSWORD` | a unique password of at least 12 characters |
   | `DEFAULT_ADMIN_EMAIL` | the administrator email address |
   | `CORS_ORIGIN` | the exact HTTPS frontend origin (set after step 3) |
   | `RESEND_API_KEY` | API key from your Resend account |
   | `EMAIL_FROM` | sender address on a domain verified with Resend |
5. Deploy. Render gives you a URL like
   `https://agrismart-tanzania.onrender.com` — copy it.
6. **Load your data**: Render's free tier doesn't give you a shell by
   default, so run the migration from your own machine instead, pointed
   at your new Turso database:
   ```
   cd backend
   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run migrate
   ```
   This reads your local `data/market-prices.json` etc. and writes them
   into Turso — the same database your deployed backend now uses.

**Free-tier behavior to expect:** Render's free web services "spin
down" after 15 minutes of no traffic, and the first request after that
takes 30–60 seconds to wake back up. That's normal — it's not broken.
Because your data lives in Turso now (not on Render's disk), **this
spin-down no longer loses any data** — that's the whole point of step 1.

## 3. Deploy the frontend to Cloudflare Pages

1. First, edit **one line** in `js/config.js`:
   ```js
   const PRODUCTION_API_URL = "https://agrismart-tanzania.onrender.com";
   ```
   (use your actual Render URL from step 2). This is the only file
   that needs editing — every page reads from it.
2. On [pages.cloudflare.com](https://pages.cloudflare.com), either:
   - connect your GitHub repo (set the build output directory to the
     project root — there's no build step, it's static files), or
   - use "Upload assets" and drag in the project folder directly.
3. Cloudflare gives you a URL like `https://agrismart-tanzania.pages.dev`.

## 4. Lock down CORS

Now that you know your real frontend URL, go back to Render →
Environment and set:
```
CORS_ORIGIN=https://agrismart-tanzania.pages.dev
```
This stops other websites from calling your API using a logged-in
user's browser. Redeploy for it to take effect (Render does this
automatically when you save an environment variable).

## 5. Verify it actually works

- Visit your Cloudflare Pages URL, register a farmer account, log in.
- Visit `/admin-login.html`, log in with your real admin password, add
  a market price.
- Wait 20+ minutes (so Render spins down), then try again — this is
  the exact scenario that used to break (see `README.md` — the
  original "Admin authentication required" bug). It should now just
  work, after the 30–60 second cold-start wake-up.

## Before announcing the public launch

- Verify your sender domain in Resend and test password recovery for both farmer and admin accounts. Production never returns reset codes in API responses.
- Configure the production admin username, strong password, and real email before the first production database is initialized. The first admin account is seeded only when the admins table is empty; changing environment variables later does not automatically change an existing admin password.
- Confirm `CORS_ORIGIN` is the exact frontend origin, not `*`.
- The frontend API URL in `js/config.js` must be updated to your actual Render URL before publishing.

## Later: outgrowing the free tier

- Render's free tier sleeping is the main limitation — a paid instance
  ($7/mo as of writing) stays always-on.
- Turso's free tier is generous (500 databases, far more reads/writes
  than a small app needs) — you're unlikely to outgrow it quickly.
- Cloudflare Pages' free tier has no realistic limit for a site this
  size.
