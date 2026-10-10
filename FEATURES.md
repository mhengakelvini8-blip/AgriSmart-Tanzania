# Frontend feature guide

For backend architecture, setup, and testing, see `README.md`. This
file is a quick walkthrough of what's on the frontend.

## Try it

1. Follow `README.md` to start the backend and serve the frontend.
2. **Register** a farmer account → you land on the dashboard.
3. **Soil Analysis** → fill in the form → get ranked crop suggestions
   with reasoning (pH, soil type, moisture, temperature all factored in).
4. **Crop Recommendations** → pick a region → see suggested crops for
   that agro-zone.
5. **Market Prices** → search, filter by region, sort by price — all
   live data from the backend.
6. **Profile** → update your farm name, region, email, or password.
7. Click **SW** in the top bar to switch to Kiswahili, **EN** to go back
   — the choice is remembered across pages.
8. **Forgot password**: reset codes are emailed through Resend in production. Local development can display a test code; never expose this endpoint in production without configuring email delivery.
9. **Admin panel**: `admin-login.html`, credentials configured with backend environment variables (development defaults only)
   — change this immediately (see `README.md` → Setup).

## Adding more Swahili text

All translations live in `js/language.js`. Add `data-i18n="my_key"` to
an element in the HTML, and a matching `my_key: "..."` line to the `SW`
dictionary in `js/language.js`.

## Region list

`js/regions.js` holds the single canonical list of all 31 Tanzania
regions (with coordinates, used for the dashboard weather widget) —
every region `<select>` across the site pulls from this one list, so
they can never drift out of sync again.
