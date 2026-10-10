// ========================================
// AGRISMART TANZANIA - SHARED REGION DATA
// One canonical list of all 31 Tanzania regions
// (26 mainland + 5 Zanzibar), used everywhere so
// a farmer's region always matches across pages.
// ========================================

const TZ_REGIONS = [
    { name: "Arusha", lat: -3.3869, lon: 36.6830 },
    { name: "Dar es Salaam", lat: -6.7924, lon: 39.2083 },
    { name: "Dodoma", lat: -6.1630, lon: 35.7516 },
    { name: "Geita", lat: -2.8710, lon: 32.2350 },
    { name: "Iringa", lat: -7.7690, lon: 35.6980 },
    { name: "Kagera", lat: -1.3300, lon: 31.8100 },
    { name: "Katavi", lat: -6.3500, lon: 31.0700 },
    { name: "Kigoma", lat: -4.8760, lon: 29.6270 },
    { name: "Kilimanjaro", lat: -3.3500, lon: 37.3400 },
    { name: "Lindi", lat: -9.9970, lon: 39.7180 },
    { name: "Manyara", lat: -4.2130, lon: 35.7460 },
    { name: "Mara", lat: -1.5000, lon: 33.8000 },
    { name: "Mbeya", lat: -8.9094, lon: 33.4608 },
    { name: "Morogoro", lat: -6.8210, lon: 37.6600 },
    { name: "Mtwara", lat: -10.2700, lon: 40.1800 },
    { name: "Mwanza", lat: -2.5164, lon: 32.9175 },
    { name: "Njombe", lat: -9.3358, lon: 34.7719 },
    { name: "Pwani", lat: -6.8000, lon: 38.9000 },
    { name: "Rukwa", lat: -7.9670, lon: 31.6170 },
    { name: "Ruvuma", lat: -10.6820, lon: 35.6500 },
    { name: "Shinyanga", lat: -3.6600, lon: 33.4200 },
    { name: "Simiyu", lat: -2.8000, lon: 33.9800 },
    { name: "Singida", lat: -4.8180, lon: 34.7500 },
    { name: "Songwe", lat: -8.9700, lon: 32.6500 },
    { name: "Tabora", lat: -5.0160, lon: 32.8000 },
    { name: "Tanga", lat: -5.0690, lon: 39.0990 },
    { name: "Kaskazini Pemba", lat: -5.0500, lon: 39.7300 },
    { name: "Kusini Pemba", lat: -5.3500, lon: 39.6500 },
    { name: "Kaskazini Unguja", lat: -5.8800, lon: 39.2500 },
    { name: "Kusini Unguja", lat: -6.4000, lon: 39.5000 },
    { name: "Mjini Magharibi", lat: -6.1650, lon: 39.2020 }
];

function getRegionCoordinates(regionName) {

    const match = TZ_REGIONS.find(
        region => region.name === regionName
    );

    return match || null;

}

// Fill in any <select data-region-select> found on the page.
// data-region-select="filter" adds an "All Regions" option
// instead of the default "Select your region" placeholder.
document.addEventListener("DOMContentLoaded", function () {

    const selects = document.querySelectorAll(
        "select[data-region-select]"
    );

    selects.forEach(function (select) {

        const isFilter =
            select.dataset.regionSelect === "filter";

        const placeholder =
            document.createElement("option");

        placeholder.value = "";
        placeholder.textContent =
            isFilter ? "All Regions" : "Select your region";
        placeholder.setAttribute(
            "data-i18n",
            isFilter ? "all_regions" : "placeholder_region"
        );

        select.appendChild(placeholder);

        TZ_REGIONS.forEach(function (region) {

            const option =
                document.createElement("option");

            option.value = region.name;
            option.textContent = region.name;

            select.appendChild(option);

        });

    });

});
