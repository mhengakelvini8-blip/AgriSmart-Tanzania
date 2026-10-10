// ========================================
// AGRISMART TANZANIA - CROP RECOMMENDATION ENGINE
// Powers both crop-recommendations.html (by region)
// and soil-analysis.html (by soil conditions).
// ========================================

// ----------------------------------------
// REGION -> AGRO-ZONE -> CROPS
// ----------------------------------------

const ZONE_CROPS = {

    southernHighlands: [
        "Maize", "Irish Potatoes", "Beans", "Avocado", "Tea"
    ],

    northernHighlands: [
        "Coffee", "Maize", "Beans", "Bananas", "Wheat"
    ],

    central: [
        "Sunflower", "Groundnuts", "Sorghum", "Grapes"
    ],

    lakeZone: [
        "Cotton", "Cassava", "Rice", "Sweet Potatoes", "Maize"
    ],

    coastal: [
        "Rice", "Coconut", "Maize", "Sugarcane", "Vegetables"
    ],

    southEast: [
        "Cashew Nuts", "Cassava", "Sesame", "Maize"
    ],

    zanzibar: [
        "Cloves", "Coconut", "Cassava", "Seaweed", "Banana"
    ]

};

const REGION_ZONE = {
    "Mbeya": "southernHighlands",
    "Njombe": "southernHighlands",
    "Iringa": "southernHighlands",
    "Songwe": "southernHighlands",
    "Rukwa": "southernHighlands",
    "Katavi": "southernHighlands",

    "Arusha": "northernHighlands",
    "Kilimanjaro": "northernHighlands",
    "Manyara": "northernHighlands",

    "Dodoma": "central",
    "Singida": "central",

    "Mwanza": "lakeZone",
    "Shinyanga": "lakeZone",
    "Simiyu": "lakeZone",
    "Geita": "lakeZone",
    "Mara": "lakeZone",
    "Kagera": "lakeZone",
    "Tabora": "lakeZone",
    "Kigoma": "lakeZone",

    "Tanga": "coastal",
    "Morogoro": "coastal",
    "Pwani": "coastal",
    "Dar es Salaam": "coastal",

    "Lindi": "southEast",
    "Mtwara": "southEast",
    "Ruvuma": "southEast",

    "Kaskazini Pemba": "zanzibar",
    "Kusini Pemba": "zanzibar",
    "Kaskazini Unguja": "zanzibar",
    "Kusini Unguja": "zanzibar",
    "Mjini Magharibi": "zanzibar"
};

function getCropsForRegion(regionName) {

    const zone = REGION_ZONE[regionName];

    return zone ? ZONE_CROPS[zone] : [];

}


// ----------------------------------------
// SOIL ANALYSIS SCORING
// ----------------------------------------

function scoreCropsFromSoil({ soilType, ph, moisture, temperature, region }) {

    const scores = {};

    function addScore(crops, weight) {

        crops.forEach(function (crop) {
            scores[crop] = (scores[crop] || 0) + weight;
        });

    }

    // --- pH ---
    let phNote;

    if (ph < 5.5) {
        phNote = "note_ph_acidic";
        addScore(["Tea", "Irish Potatoes", "Pineapple"], 2);
    } else if (ph <= 7.0) {
        phNote = "note_ph_neutral";
        addScore(["Maize", "Beans", "Vegetables", "Coffee"], 2);
    } else {
        phNote = "note_ph_alkaline";
        addScore(["Sorghum", "Millet", "Cotton", "Sunflower"], 2);
    }

    // --- Soil type ---
    let soilNote;

    if (soilType === "Sandy") {
        soilNote = "note_soil_sandy";
        addScore(["Cassava", "Groundnuts", "Watermelon", "Sweet Potatoes"], 1.5);
    } else if (soilType === "Clay") {
        soilNote = "note_soil_clay";
        addScore(["Rice", "Sugarcane", "Bananas"], 1.5);
    } else if (soilType === "Loamy") {
        soilNote = "note_soil_loamy";
        addScore(["Maize", "Beans", "Vegetables", "Coffee", "Tomatoes"], 1.5);
    } else {
        soilNote = "note_soil_silty";
        addScore(["Vegetables", "Maize", "Wheat"], 1.5);
    }

    // --- Moisture ---
    let moistureNote;

    if (moisture < 30) {
        moistureNote = "note_moist_low";
        addScore(["Sorghum", "Millet", "Cassava", "Sunflower"], 2);
    } else if (moisture <= 60) {
        moistureNote = "note_moist_mid";
        addScore(["Maize", "Beans", "Groundnuts"], 2);
    } else {
        moistureNote = "note_moist_high";
        addScore(["Rice", "Sugarcane", "Taro"], 2);
    }

    // --- Temperature ---
    let temperatureNote;

    if (temperature < 15) {
        temperatureNote = "note_temp_cool";
        addScore(["Tea", "Wheat", "Irish Potatoes", "Pyrethrum"], 2);
    } else if (temperature <= 25) {
        temperatureNote = "note_temp_mid";
        addScore(["Maize", "Beans", "Coffee"], 2);
    } else {
        temperatureNote = "note_temp_warm";
        addScore(["Rice", "Cassava", "Cotton", "Cashew Nuts"], 2);
    }

    // --- Region crops get a small boost so local relevance counts ---
    addScore(getCropsForRegion(region), 1);

    const ranked = Object.keys(scores)
        .sort((a, b) => scores[b] - scores[a])
        .slice(0, 5);

    return {
        topCrops: ranked,
        notes: [phNote, soilNote, moistureNote, temperatureNote]
    };

}


// ----------------------------------------
// PAGE WIRING: SOIL ANALYSIS
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const soilForm = document.getElementById("soilForm");
    const soilResult = document.getElementById("soilResult");

    if (!soilForm || !soilResult) {
        return;
    }

    let lastSoilAnalysis = null;

    function renderSoilResult() {

        if (!lastSoilAnalysis) {
            return;
        }

        const { topCrops, notes } = lastSoilAnalysis;

        soilResult.innerHTML =
            "<h3>" + t("res_recommended_crops") + "</h3>" +
            "<p>" + topCrops.map(tCrop).join(", ") + "</p>" +
            "<h3>" + t("res_soil_insights") + "</h3>" +
            "<ul>" +
            notes.map(note => "<li>" + t(note) + "</li>").join("") +
            "</ul>";

        soilResult.style.display = "block";

    }

    soilForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const region = document.getElementById("soilRegion").value;
        const soilType = document.getElementById("soilType").value;
        const ph = parseFloat(document.getElementById("soilPH").value);
        const moisture = parseFloat(document.getElementById("soilMoisture").value);
        const temperature = parseFloat(document.getElementById("soilTemperature").value);

        lastSoilAnalysis = scoreCropsFromSoil({
            soilType, ph, moisture, temperature, region
        });

        renderSoilResult();
        soilResult.scrollIntoView({ behavior: "smooth", block: "nearest" });

    });

    document.addEventListener("languagechange", renderSoilResult);

});


// ----------------------------------------
// PAGE WIRING: CROP RECOMMENDATIONS BY REGION
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const showCropsButton = document.getElementById("showCropsButton");
    const cropResults = document.getElementById("cropResults");
    const recommendationRegion = document.getElementById("recommendationRegion");

    if (!showCropsButton || !cropResults || !recommendationRegion) {
        return;
    }

    let lastRegion = null;

    function renderCropResults() {

        if (lastRegion === null) {
            return;
        }

        if (!lastRegion) {
            cropResults.innerHTML =
                "<p>" + t("res_select_region_first") + "</p>";
            cropResults.style.display = "block";
            return;
        }

        const crops = getCropsForRegion(lastRegion);

        cropResults.innerHTML =
            "<h3>" + t("res_recommended_for") + " " + lastRegion + "</h3>" +
            (crops.length
                ? "<ul>" + crops.map(crop => "<li>" + tCrop(crop) + "</li>").join("") + "</ul>"
                : "<p>" + t("res_no_data") + "</p>");

        cropResults.style.display = "block";

    }

    showCropsButton.addEventListener("click", function () {

        lastRegion = recommendationRegion.value;
        renderCropResults();

    });

    document.addEventListener("languagechange", renderCropResults);

});
