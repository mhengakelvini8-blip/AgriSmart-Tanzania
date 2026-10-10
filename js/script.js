// ========================================
// AGRISMART TANZANIA - SHARED UI SCRIPT
// Mobile menu + password show/hide.
// (Auth, dashboard, profile, market prices
// and crop logic live in app.js / regions.js /
// data/crop-recommendations.js)
// ========================================


// ========================================
// MOBILE MENU
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("active");
        });

    }

});


// ========================================
// PASSWORD SHOW / HIDE
// Works for any ".password-toggle" button
// placed next to a password input.
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const toggles = document.querySelectorAll(".password-toggle");

    toggles.forEach(function (button) {

        const wrapper = button.parentElement;
        const input = wrapper ? wrapper.querySelector("input") : null;

        if (!input) {
            return;
        }

        button.addEventListener("click", function () {

            if (input.type === "password") {
                input.type = "text";
                button.textContent = "🙈";
            } else {
                input.type = "password";
                button.textContent = "👁️";
            }

        });

    });

});
