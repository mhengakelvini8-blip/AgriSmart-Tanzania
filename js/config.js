// ========================================
// API CONFIGURATION
// ONE place to point the frontend at your backend.
// Every page loads this file before any other script,
// so changing PRODUCTION_API_URL here updates the
// whole site at once.
//
// Local development (localhost / 127.0.0.1) always
// uses the local backend automatically — you only
// need to edit the line below when you deploy.
// ========================================

const PRODUCTION_API_URL = "https://YOUR-RENDER-APP.onrender.com";

// Replace the placeholder above with your deployed backend URL before publishing.
const API_CONFIGURED = PRODUCTION_API_URL.indexOf("YOUR-RENDER-APP") === -1;

const API_BASE = (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
)
    ? "http://localhost:5000"
    : PRODUCTION_API_URL;

if (!API_CONFIGURED && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    console.error("AgriSmart API is not configured. Update PRODUCTION_API_URL in js/config.js before deployment.");
}
