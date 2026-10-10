# About these files

`agrismart.sqlite` (created here on first run) is the real database —
see `../README.md`.

`users.json`, `admin-users.json`, and `market-prices.json` are the
**old** data format, kept only so `backend/scripts/migrate-json-to-sqlite.js`
can import them once. After running `npm run migrate` (see
`../README.md`), the database is the source of truth and these files
are no longer read by the app. Safe to delete once you've migrated and
confirmed your data is in `agrismart.sqlite`.

`crop-recommendations.js` is **not** legacy — it's the live client-side
crop recommendation engine used by `soil-analysis.html` and
`crop-recommendations.html`. Keep it.
