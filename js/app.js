// ========================================
// AGRISMART TANZANIA - FARMER APP LOGIC
// Handles registration, login, logout, the
// farmer dashboard, profile page, and the
// public market prices page.
// ========================================

// API_BASE now comes from js/config.js (loaded before this file).


// ----------------------------------------
// SESSION HELPERS
// ----------------------------------------

function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    } catch (error) {

        return null;

    }

}

function setLoggedInUser(user) {

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );

}

// Redirect away from a page unless the farmer is logged in.
function requireFarmerLogin() {

    const user = getLoggedInUser();

    if (!user || !user.token) {

        window.location.href = "login.html";
        return null;

    }

    return user;

}

// Bind any #logoutButton on the page (button or <a>) to sign out.
document.addEventListener("DOMContentLoaded", function () {

    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", async function (event) {

        event.preventDefault();

        const user = getLoggedInUser();

        if (user && user.token) {

            try {

                await fetch(API_BASE + "/api/logout", {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + user.token }
                });

            } catch (error) {
                // Ignore network errors on logout — clear locally anyway.
            }

        }

        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";

    });

});


// ----------------------------------------
// REGISTER
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const farmName = document.getElementById("farmName").value.trim();
        const region = document.getElementById("region").value;
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            registerMessage.textContent = t("msg_passwords_mismatch");
            return;
        }

        registerMessage.textContent = t("msg_creating_account");

        try {

            const response = await fetch(API_BASE + "/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ farmName, region, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                registerMessage.textContent =
                    data.message ? tServer(data.message) : t("msg_unable_create");
                return;
            }

            setLoggedInUser({
                id: data.user.id,
                farmName: data.user.farmName,
                region: data.user.region,
                email: data.user.email,
                token: data.token
            });

            registerMessage.textContent = t("msg_account_created");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {

            registerMessage.textContent = t("msg_connect_error");

        }

    });

});


// ----------------------------------------
// LOGIN
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const farmName = document.getElementById("loginFarmName").value.trim();
        const password = document.getElementById("loginPassword").value;

        loginMessage.textContent = t("msg_logging_in");

        try {

            const response = await fetch(API_BASE + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ farmName, password })
            });

            const data = await response.json();

            if (!response.ok) {
                loginMessage.textContent =
                    data.message ? tServer(data.message) : t("msg_invalid_login");
                return;
            }

            setLoggedInUser({
                id: data.user.id,
                farmName: data.user.farmName,
                region: data.user.region,
                email: data.user.email,
                token: data.token
            });

            loginMessage.textContent = t("msg_login_success");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {

            loginMessage.textContent = t("msg_connect_error");

        }

    });

});


// ----------------------------------------
// DASHBOARD
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const dashboardName = document.getElementById("dashboardFarmerName");

    // Only run on dashboard.html
    if (!dashboardName) {
        return;
    }

    const user = requireFarmerLogin();

    if (!user) {
        return;
    }

    document.getElementById("dashboardFarmerName").textContent = user.farmName;
    document.getElementById("dashboardFarmerRegion").textContent = user.region;
    document.getElementById("overviewFarmerName").textContent = user.farmName;
    document.getElementById("overviewRegion").textContent = user.region;

    const statRegion = document.getElementById("statRegion");
    if (statRegion) statRegion.textContent = user.region;

    loadDashboardWeather(user.region);

    const refreshWeatherButton = document.getElementById("refreshWeatherButton");
    if (refreshWeatherButton) {
        refreshWeatherButton.addEventListener("click", function () {
            loadDashboardWeather(user.region);
        });
    }

});

async function loadDashboardWeather(region) {

    const weatherRegion = document.getElementById("weatherRegion");
    const weatherResults = document.getElementById("weatherResults");

    if (!weatherResults) {
        return;
    }

    const coordinates = getRegionCoordinates(region);

    if (weatherRegion) {
        weatherRegion.textContent = region || "Tanzania";
    }

    if (!coordinates) {
        weatherResults.innerHTML = "<p>" + t("msg_weather_no_region") + "</p>";
        return;
    }

    weatherResults.innerHTML = "<p>" + t("msg_weather_loading") + "</p>";

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            coordinates.lat + "&longitude=" + coordinates.lon +
            "&current=temperature_2m,relative_humidity_2m,weather_code"
        );

        const data = await response.json();
        const current = data.current;

        weatherResults.innerHTML =
            "<p><strong>" + current.temperature_2m + "°C</strong> &middot; " +
            t("weather_humidity") + ": " + current.relative_humidity_2m + "%</p>";

    } catch (error) {

        weatherResults.innerHTML = "<p>" + t("msg_weather_unavailable") + "</p>";

    }

}


// ----------------------------------------
// PROFILE
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    if (!profileForm) {
        return;
    }

    const user = requireFarmerLogin();

    if (!user) {
        return;
    }

    document.getElementById("profileFarmName").value = user.farmName;
    document.getElementById("profileRegion").value = user.region;

    const profileEmail = document.getElementById("profileEmail");
    if (profileEmail) profileEmail.value = user.email || "";

    profileForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const farmName = document.getElementById("profileFarmName").value.trim();
        const region = document.getElementById("profileRegion").value;
        const email = profileEmail ? profileEmail.value.trim() : user.email;
        const password = document.getElementById("profilePassword").value;

        profileMessage.textContent = t("msg_saving");

        try {

            const response = await fetch(API_BASE + "/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify({
                    farmName,
                    region,
                    email,
                    password: password || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                profileMessage.textContent =
                    data.message ? tServer(data.message) : t("msg_unable_save");
                return;
            }

            setLoggedInUser({
                id: data.user.id,
                farmName: data.user.farmName,
                region: data.user.region,
                email: data.user.email,
                token: user.token
            });

            document.getElementById("profilePassword").value = "";
            profileMessage.textContent = t("msg_profile_updated");

        } catch (error) {

            profileMessage.textContent = t("msg_connect_error");

        }

    });

});


// ----------------------------------------
// PUBLIC MARKET PRICES PAGE
// ----------------------------------------

let allMarketPrices = [];

document.addEventListener("DOMContentLoaded", function () {

    const marketResults = document.getElementById("marketResults");

    if (!marketResults) {
        return;
    }

    loadMarketPrices();

    const searchButton = document.getElementById("searchMarketButton");
    const refreshButton = document.getElementById("refreshMarketButton");
    const cropSearch = document.getElementById("cropSearch");
    const marketRegion = document.getElementById("marketRegion");
    const sortSelect = document.getElementById("sortMarketPrices");

    if (searchButton) searchButton.addEventListener("click", renderMarketPrices);
    if (refreshButton) refreshButton.addEventListener("click", loadMarketPrices);
    if (cropSearch) cropSearch.addEventListener("input", renderMarketPrices);
    if (marketRegion) marketRegion.addEventListener("change", renderMarketPrices);
    if (sortSelect) sortSelect.addEventListener("change", renderMarketPrices);

});

async function loadMarketPrices() {

    const marketResults = document.getElementById("marketResults");
    marketResults.innerHTML = "<p class=\"loading-message\">" + t("msg_loading_prices") + "</p>";

    try {

        const response = await fetch(API_BASE + "/api/market-prices");
        allMarketPrices = await response.json();
        renderMarketPrices();

    } catch (error) {

        marketResults.innerHTML =
            "<p id=\"errorMessage\">" + t("msg_prices_error") + "</p>";

    }

}

function renderMarketPrices() {

    const marketResults = document.getElementById("marketResults");
    const cropSearch = document.getElementById("cropSearch");
    const marketRegion = document.getElementById("marketRegion");
    const sortSelect = document.getElementById("sortMarketPrices");

    const search = cropSearch ? cropSearch.value.toLowerCase().trim() : "";
    const region = marketRegion ? marketRegion.value : "";
    const sort = sortSelect ? sortSelect.value : "";

    let prices = allMarketPrices.filter(function (item) {

        const matchesSearch =
            !search ||
            item.crop.toLowerCase().includes(search) ||
            tCrop(item.crop).toLowerCase().includes(search);

        const matchesRegion =
            !region || item.region === region;

        return matchesSearch && matchesRegion;

    });

    if (sort === "low") {
        prices = prices.slice().sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        prices = prices.slice().sort((a, b) => b.price - a.price);
    }

    if (prices.length === 0) {
        marketResults.innerHTML = "<p>" + t("msg_no_prices") + "</p>";
        return;
    }

    const rows = prices.map(function (item) {

        return "<tr>" +
            "<td>" + tCrop(item.crop) + "</td>" +
            "<td>" + item.price.toLocaleString() + " TZS " + translateUnit(item.unit) + "</td>" +
            "<td>" + item.region + "</td>" +
            "<td>" + item.market + "</td>" +
            "<td>" + item.updated + "</td>" +
            "</tr>";

    }).join("");

    marketResults.innerHTML =
        "<table class=\"market-table\">" +
        "<thead><tr>" +
        "<th>" + t("tbl_crop") + "</th><th>" + t("tbl_price") + "</th><th>" + t("tbl_region") + "</th><th>" + t("tbl_market") + "</th><th>" + t("tbl_updated") + "</th>" +
        "</tr></thead>" +
        "<tbody>" + rows + "</tbody>" +
        "</table>";

}


function translateUnit(unit) {

    if (unit === "per kg") return t("unit_per_kg");
    if (unit === "per bag") return t("unit_per_bag");

    return unit;

}

// Re-draw dynamic content when the language is switched.
document.addEventListener("languagechange", function () {

    if (document.getElementById("marketResults") && allMarketPrices.length > 0) {
        renderMarketPrices();
    }

    const user = getLoggedInUser();

    if (document.getElementById("dashboardFarmerName") && user) {
        loadDashboardWeather(user.region);
    }

});
