// ========================================
// AGRISMART TANZANIA - LANGUAGE SUPPORT
// English (default) + Kiswahili
//
// How it works:
//  - Any element with data-i18n="key" is translated.
//    The English text already written in the HTML is
//    remembered, so switching back to English restores it.
//  - data-i18n-placeholder="key" translates input placeholders.
//  - Buttons with data-lang-btn="en" / "sw" switch language.
//  - Scripts use t("key"), tCrop("Maize"), tServer(message)
//    for text they create dynamically.
//  - The choice is saved in localStorage ("language").
// ========================================

const FARMER_EMOJI = "\uD83D\uDC68\u200D\uD83C\uDF3E";

// ----------------------------------------
// KISWAHILI TRANSLATIONS
// ----------------------------------------

const SW = {

    // ----- Navigation -----
    nav_home: "Nyumbani",
    nav_services: "Huduma",
    nav_about: "Kuhusu Sisi",
    nav_contact: "Wasiliana",
    nav_register: "Jisajili",
    nav_login: "Ingia",
    nav_logout: "Toka",
    nav_dashboard: "Dashibodi",
    nav_soil: "Uchambuzi wa Udongo",
    nav_crops: "Mapendekezo ya Mazao",
    nav_market: "Bei za Soko",
    nav_profile: "Wasifu",
    nav_dashboard_icon: "🏠 Dashibodi",
    nav_soil_icon: "🌱 Uchambuzi wa Udongo",
    nav_crops_icon: "🌾 Mapendekezo ya Mazao",
    nav_market_icon: "💰 Bei za Soko",
    nav_profile_icon: "👤 Wasifu",

    // ----- Home page -----
    hero_title: "Kilimo cha Kisasa kwa Maisha Bora 🌱",
    hero_desc: "Karibu AgriSmart Tanzania. Tunawasaidia wakulima kufanya maamuzi bora ya kilimo kupitia teknolojia na taarifa.",
    hero_btn_register: "Jisajili kama Mkulima",
    hero_btn_login: "Ingia kama Mkulima",

    stat_farmers_label: "Wakulima Waliosaidiwa",
    stat_regions_label: "Mikoa ya Tanzania",
    stat_weather_label: "Taarifa za Hali ya Hewa",

    how_title: "Jinsi AgriSmart Inavyofanya Kazi",
    how_intro: "Fuata hatua hizi rahisi kupata taarifa za kilimo na kuboresha maamuzi yako ya kilimo.",
    step1_title: FARMER_EMOJI + " Jisajili",
    step1_desc: "Fungua akaunti yako ya mkulima kwa kutoa jina la shamba lako na mkoa.",
    step2_title: "🌱 Chambua Udongo",
    step2_desc: "Weka taarifa za udongo wako ili upate mapendekezo ya awali ya mazao.",
    step3_title: "🌾 Pata Mapendekezo",
    step3_desc: "Angalia mapendekezo ya mazao kulingana na mkoa uliouchagua.",
    step4_title: "📊 Angalia Bei",
    step4_desc: "Ona taarifa za bei za mazao sokoni zilizopo.",

    benefits_title: "Kwa Nini Utumie AgriSmart Tanzania?",
    benefit1_title: "🌱 Maamuzi Bora ya Kilimo",
    benefit1_desc: "Pata taarifa muhimu za kilimo zitakazokusaidia kufanya maamuzi yako.",
    benefit2_title: "🌾 Mwongozo wa Mazao",
    benefit2_desc: "Angalia mapendekezo ya awali ya mazao kulingana na mkoa na taarifa za udongo wako.",
    benefit3_title: "📊 Taarifa za Soko",
    benefit3_desc: "Ona bei za mazao sokoni zilizopo katika jukwaa moja rahisi.",
    benefit4_title: "📱 Urahisi wa Kufikia",
    benefit4_desc: "Tumia AgriSmart Tanzania kwenye simu au kompyuta yako.",

    about_title: "Kuhusu AgriSmart Tanzania",
    about_desc: "AgriSmart Tanzania ni jukwaa la kidijitali la kilimo lililoundwa kusaidia wakulima kwa taarifa muhimu kuhusu uchambuzi wa udongo, mapendekezo ya mazao, hali ya hewa, na bei za mazao sokoni.",

    services_title: "Huduma Zetu",
    service1_desc: "Weka taarifa za udongo na upate mapendekezo ya awali ya mazao.",
    service1_link: "Angalia Uchambuzi wa Udongo",
    service2_desc: "Gundua mapendekezo ya mazao kulingana na mkoa uliouchagua.",
    service2_link: "Ona Mapendekezo",
    service3_desc: "Ona taarifa za bei za mazao sokoni zilizopo.",
    service3_link: "Ona Bei za Soko",

    contact_title: "Wasiliana Nasi",
    contact_desc: "Una maswali au unahitaji msaada wa kilimo? Wasiliana na AgriSmart Tanzania.",
    contact_phone: "📞 Simu: +255 700 000 000",
    contact_email: "📧 Barua pepe: info@agrismart.co.tz",
    contact_location: "📍 Mahali: Tanzania",
    contact_btn: "Tutumie Barua Pepe",

    faq_title: "Maswali Yanayoulizwa Mara kwa Mara",
    faq_q1: "AgriSmart Tanzania ni nini?",
    faq_a1: "AgriSmart Tanzania ni jukwaa la kilimo linalotoa mwongozo wa uchambuzi wa udongo, mapendekezo ya mazao, taarifa za hali ya hewa, na bei za soko.",
    faq_q2: "Ninawezaje kujisajili kama mkulima?",
    faq_a2: "Bonyeza kitufe cha Jisajili na ujaze fomu ya usajili.",
    faq_q3: "Naweza kuangalia bei za mazao sokoni?",
    faq_a3: "Ndiyo. Tembelea ukurasa wa Bei za Soko kuona taarifa zilizopo.",
    faq_q4: "Naweza kutumia AgriSmart kwenye simu yangu?",
    faq_a4: "Ndiyo. Tovuti imeundwa kufanya kazi kwenye simu na kompyuta.",

    footer_text: "© 2026 AgriSmart Tanzania. Haki zote zimehifadhiwa.",
    footer_tagline: "Tunawasaidia wakulima kupitia teknolojia 🌱",
    footer_tagline_market: "Taarifa za kilimo na huduma za kilimo cha kidijitali.",

    // ----- Register / Login / Forgot password -----
    register_heading: "Fungua Akaunti Yako ya Mkulima",
    register_desc: "Jisajili ili kupata taarifa za kilimo na huduma za kilimo cha kisasa.",
    label_farmname: "Jina la Shamba / Jina la Mtumiaji",
    placeholder_farmname: "Weka jina la shamba au jina la mtumiaji",
    label_region: "Chagua Mkoa Wako",
    placeholder_region: "Chagua mkoa wako",
    label_email: "Anwani ya Barua Pepe",
    email_hint: "Hutumika tu kurejesha akaunti (umesahau nywila).",
    email_hint_profile: "Hutumika kurejesha akaunti (umesahau nywila).",
    label_password: "Nywila",
    password_hint: "Nywila lazima iwe na angalau herufi 6.",
    label_confirm_password: "Thibitisha Nywila",
    btn_create_account: "Fungua Akaunti",
    already_have_account: "Una akaunti tayari?",
    login_here: "Ingia hapa",
    back_home: "← Rudi Nyumbani",

    login_heading: "Karibu Tena, Mkulima!",
    login_desc: "Ingia ili kufikia dashibodi yako ya kilimo na huduma za kilimo.",
    btn_login: "Ingia kwenye Dashibodi",
    forgot_password_link: "Umesahau nywila?",
    no_account: "Huna akaunti?",
    register_here: "Jisajili hapa",

    forgot_heading: "Weka Upya Nywila Yako",
    forgot_desc: "Weka barua pepe iliyounganishwa na akaunti yako. Kwa kuwa mfumo wa kutuma barua pepe bado haujaunganishwa, tutakuonyesha nambari yako ya kurejesha hapa badala ya kukutumia barua pepe.",
    label_account_type: "Aina ya Akaunti",
    option_farmer: "Mkulima",
    option_admin: "Msimamizi",
    btn_send_code: "Tuma Nambari ya Kurejesha",
    label_reset_code: "Nambari ya Kurejesha",
    label_new_password: "Nywila Mpya",
    btn_reset_password: "Weka Upya Nywila",
    back_to_login: "← Rudi kwenye Kuingia",
    back_to_admin_login: "← Rudi kwenye Kuingia kwa Msimamizi",

    // ----- Dashboard -----
    dash_welcome: "Karibu",
    dash_region_label: "Mkoa",
    dash_intro: "Simamia shughuli zako za kilimo, taarifa za mazao, na fursa za soko mahali pamoja.",
    dash_stat_status: "🌱 Hali ya Shamba",
    dash_active: "Inatumika",
    dash_stat_advice: "🌾 Ushauri wa Mazao",
    dash_available: "Inapatikana",
    dash_stat_location: "📍 Mahali",
    dash_overview_title: "🌱 Muhtasari wa Shamba",
    dash_overview_desc: "Pitia taarifa zako za kilimo ulizosajili.",
    dash_farmer_name: "Jina la Mkulima",
    dash_account_type: "Aina ya Akaunti",
    dash_platform: "Jukwaa",
    dash_services_title: "🚜 Huduma za Kilimo",
    dash_services_desc: "Chagua huduma ili kuendelea.",
    dash_soil_desc: "Chambua udongo wako na upate mapendekezo ya awali ya mazao.",
    dash_crops_desc: "Pata mazao yanayofaa mkoa wako.",
    dash_market_desc: "Ona bei za mazao sokoni zilizopo.",
    dash_profile_desc: "Ona na simamia taarifa za wasifu wako.",
    dash_weather_title: "🌦️ Taarifa za Hali ya Hewa",
    dash_weather_for: "Hali ya hewa ya:",
    dash_refresh_weather: "🔄 Onyesha Upya Hali ya Hewa",

    // ----- Profile -----
    back_to_dashboard: "← Dashibodi",
    profile_heading: "👤 Wasifu wa Mkulima",
    profile_desc: "Simamia taarifa za akaunti yako ya kilimo.",
    label_new_password_optional: "Nywila Mpya (Si Lazima)",
    placeholder_keep_password: "Acha wazi ili kubaki na nywila ya sasa",
    btn_save_changes: "💾 Hifadhi Mabadiliko",

    // ----- Soil analysis page -----
    soil_page_title: "🌱 Uchambuzi wa Udongo",
    soil_page_desc1: "Weka taarifa za udongo wako ili upate mapendekezo ya awali ya mazao.",
    soil_page_desc2: "Taarifa sahihi za udongo zinaweza kuwasaidia wakulima kufanya maamuzi bora ya kupanga mazao.",
    soil_form_title: "🔬 Weka Taarifa za Udongo",
    soil_form_desc: "Tafadhali toa taarifa zilizo hapa chini kwa usahihi iwezekanavyo.",
    label_region_icon: "📍 Mkoa",
    label_soil_type: "🪨 Aina ya Udongo",
    option_select_soil_type: "Chagua aina ya udongo",
    option_sandy: "Udongo wa Kichanga",
    option_clay: "Udongo wa Mfinyanzi",
    option_loamy: "Udongo Tifutifu",
    option_silty: "Udongo wa Matope Laini",
    label_soil_ph: "🧪 Kiwango cha pH ya Udongo",
    hint_ph_range: "pH ya udongo kwa kawaida ni kati ya 0 na 14.",
    label_soil_moisture: "💧 Unyevu wa Udongo (%)",
    hint_moisture: "Weka kiwango cha takriban cha unyevu wa udongo wako.",
    label_soil_temp: "🌡️ Joto la Udongo (°C)",
    btn_analyze_soil: "🔍 Chambua Udongo",
    soil_about_title: "ℹ️ Kuhusu Uchambuzi wa Udongo",
    soil_about_desc1: "AgriSmart hutumia taarifa unazotoa kutengeneza mapendekezo ya awali ya mazao kulingana na mkoa, aina ya udongo, pH, unyevu, na joto.",
    soil_about_desc2: "Matokeo haya ni mwongozo wa jumla na hayapaswi kuchukua nafasi ya upimaji wa kitaalamu wa udongo au ushauri wa afisa ugani wa kilimo.",

    // ----- Crop recommendations page -----
    crops_page_title: "🌾 Mapendekezo ya Mazao",
    crops_page_desc1: "Chagua mkoa wako kuona mazao yanayopendekezwa kwa eneo hilo.",
    crops_page_desc2: "Mapendekezo haya yanatoa mwongozo wa jumla wa kilimo kwa wakulima.",
    crops_select_title: "📍 Chagua Mkoa Wako",
    crops_select_desc: "Chagua mkoa wako hapa chini kuona mazao yanayopendekezwa.",
    btn_show_crops: "🌾 Onyesha Mazao Yanayopendekezwa",
    crops_about_title: "ℹ️ Kuhusu Mapendekezo ya Mazao",
    crops_about_desc1: "AgriSmart hutoa mapendekezo ya jumla ya mazao kulingana na mkoa uliochaguliwa.",
    crops_about_desc2: "Kufaa kwa zao pia hutegemea sifa za udongo, mvua, joto, mbinu za kilimo, aina za mbegu, na hali nyingine za eneo.",
    crops_about_desc3: "Kwa maamuzi muhimu ya kupanda, wakulima wanapaswa pia kushauriana na afisa ugani wa kilimo aliyehitimu.",

    // ----- Market prices page -----
    market_page_title: "🌾 Bei za Mazao Sokoni",
    market_page_desc: "Angalia bei za sasa za mazao sokoni ili zikusaidie kufanya maamuzi bora kuhusu wapi na lini kuuza mazao yako.",
    label_select_region: "Chagua Mkoa",
    all_regions: "Mikoa Yote",
    label_search_crop: "Tafuta Zao",
    placeholder_search_crop: "mf. Mahindi, Mchele, Maharage",
    label_sort_price: "Panga kwa Bei",
    sort_default: "Kawaida",
    sort_low: "Bei ya Chini Zaidi",
    sort_high: "Bei ya Juu Zaidi",
    btn_search: "🔍 Tafuta",
    btn_refresh: "🔄 Onyesha Upya",
    market_available_title: "Bei za Sokoni Zilizopo",
    market_available_desc: "Bei zinaonyeshwa kulingana na data ya soko iliyopo.",
    market_info1_title: "💡 Kwa Nini Uangalie Bei za Soko?",
    market_info1_desc: "Taarifa za soko zinaweza kusaidia wakulima kulinganisha bei kati ya mikoa na kufanya maamuzi bora ya kuuza.",
    market_info2_title: "📊 Linganisha Masoko",
    market_info2_desc: "Tumia kichujio cha mkoa na utafutaji wa zao kulinganisha bei zilizopo.",
    market_info3_title: "🔄 Endelea Kupata Taarifa Mpya",
    market_info3_desc: "Bei za soko zinaweza kubadilika mara kwa mara. Kila mara angalia taarifa za hivi karibuni kabla ya kufanya maamuzi muhimu ya kuuza.",

    // ----- Dynamic text (created by scripts) -----
    tbl_crop: "Zao",
    tbl_price: "Bei",
    tbl_region: "Mkoa",
    tbl_market: "Soko",
    tbl_updated: "Imesasishwa",
    unit_per_kg: "kwa kilo",
    unit_per_bag: "kwa gunia",
    msg_loading_prices: "Inapakia bei za soko...",
    msg_prices_error: "Imeshindwa kupakia bei za soko. Hakikisha seva (backend) inafanya kazi.",
    msg_no_prices: "Hakuna bei za soko zinazolingana na utafutaji wako.",

    res_recommended_crops: "🌾 Mazao Yanayopendekezwa",
    res_soil_insights: "🔎 Maelezo ya Udongo",
    res_recommended_for: "🌾 Mazao Yanayopendekezwa kwa",
    res_select_region_first: "Tafadhali chagua mkoa kwanza.",
    res_no_data: "Bado hakuna data ya mkoa huu.",

    note_ph_acidic: "Udongo wenye asidi — mzuri kwa chai, nanasi na viazi mviringo; chokaa kinaweza kusaidia mazao mengine mengi.",
    note_ph_neutral: "Udongo wenye pH ya wastani — unafaa kwa mazao mengi ya chakula.",
    note_ph_alkaline: "Udongo wenye alkali — unafaa nafaka zinazostahimili ukame na mazao ya mafuta.",
    note_soil_sandy: "Udongo wa kichanga hupitisha maji haraka — ongeza mbolea za asili na umwagilie mara kwa mara.",
    note_soil_clay: "Udongo wa mfinyanzi huhifadhi maji vizuri lakini unaweza kujaa maji — hakikisha una mifereji mizuri.",
    note_soil_loamy: "Udongo tifutifu — una uwiano mzuri na unafaa karibu mazao yote.",
    note_soil_silty: "Udongo wa matope laini una rutuba na huhifadhi unyevu vizuri.",
    note_moist_low: "Unyevu mdogo — chagua mazao yanayostahimili ukame au panga umwagiliaji.",
    note_moist_mid: "Unyevu wa wastani — mzuri kwa mazao mengi ya shambani.",
    note_moist_high: "Unyevu mwingi — unafaa mazao yanayopenda maji.",
    note_temp_cool: "Joto baridi la nyanda za juu — bora kwa chai, ngano na viazi mviringo.",
    note_temp_mid: "Joto la wastani — bora kwa mahindi, maharage na kahawa.",
    note_temp_warm: "Joto la juu — linafaa mpunga, muhogo, pamba na korosho.",

    msg_passwords_mismatch: "Nywila hazifanani.",
    msg_creating_account: "Inafungua akaunti yako...",
    msg_account_created: "Akaunti imefunguliwa! Inakupeleka kwenye dashibodi...",
    msg_unable_create: "Imeshindwa kufungua akaunti.",
    msg_connect_error: "Imeshindwa kuunganishwa na seva. Hakikisha seva (backend) inafanya kazi.",
    msg_logging_in: "Inaingia...",
    msg_login_success: "Umefanikiwa kuingia. Inakupeleka...",
    msg_invalid_login: "Jina la shamba au nywila si sahihi.",
    msg_saving: "Inahifadhi mabadiliko...",
    msg_profile_updated: "Wasifu umesasishwa kikamilifu.",
    msg_unable_save: "Imeshindwa kuhifadhi mabadiliko.",

    msg_weather_loading: "Inapakia taarifa za hali ya hewa...",
    msg_weather_no_region: "Hali ya hewa haipatikani kwa mkoa huu.",
    msg_weather_unavailable: "Hali ya hewa haipatikani kwa sasa.",
    weather_humidity: "Unyevu",

    msg_requesting_code: "Inaomba nambari ya kurejesha...",
    msg_unable_request_code: "Imeshindwa kuomba nambari ya kurejesha.",
    msg_your_code: "Nambari yako ya kurejesha ni:",
    msg_code_note: "(Katika toleo halisi, hii ingetumwa kwa barua pepe yako.)",
    msg_resetting: "Inaweka upya nywila...",
    msg_unable_reset: "Imeshindwa kuweka upya nywila.",
    msg_redirecting_login: "Inakupeleka kwenye kuingia..."

};


// ----------------------------------------
// ENGLISH TEXT FOR DYNAMIC STRINGS
// (static page text is read from the HTML itself)
// ----------------------------------------

const EN_DYNAMIC = {

    tbl_crop: "Crop",
    tbl_price: "Price",
    tbl_region: "Region",
    tbl_market: "Market",
    tbl_updated: "Updated",
    unit_per_kg: "per kg",
    unit_per_bag: "per bag",
    msg_loading_prices: "Loading market prices...",
    msg_prices_error: "Unable to load market prices. Make sure the backend is running.",
    msg_no_prices: "No market prices match your search.",

    res_recommended_crops: "🌾 Recommended Crops",
    res_soil_insights: "🔎 Soil Insights",
    res_recommended_for: "🌾 Recommended Crops for",
    res_select_region_first: "Please select a region first.",
    res_no_data: "No data available for this region yet.",

    note_ph_acidic: "Acidic soil — good for tea, pineapple and Irish potatoes; liming can help most other crops.",
    note_ph_neutral: "Near-neutral soil — suitable for most staple crops.",
    note_ph_alkaline: "Alkaline soil — favours drought-tolerant grains and oilseeds.",
    note_soil_sandy: "Sandy soil drains quickly — add organic matter and irrigate more often.",
    note_soil_clay: "Clay soil holds water well but can become waterlogged — ensure good drainage.",
    note_soil_loamy: "Loamy soil — well-balanced and suitable for nearly all crops.",
    note_soil_silty: "Silty soil is fertile and holds moisture well.",
    note_moist_low: "Low moisture — favour drought-tolerant crops or plan for irrigation.",
    note_moist_mid: "Moderate moisture — good for most field crops.",
    note_moist_high: "High moisture — well suited to water-loving crops.",
    note_temp_cool: "Cool highland temperatures — ideal for tea, wheat and Irish potatoes.",
    note_temp_mid: "Moderate temperatures — ideal for maize, beans and coffee.",
    note_temp_warm: "Warm temperatures — suited to rice, cassava, cotton and cashew.",

    msg_passwords_mismatch: "Passwords do not match.",
    msg_creating_account: "Creating your account...",
    msg_account_created: "Account created! Redirecting to your dashboard...",
    msg_unable_create: "Unable to create account.",
    msg_connect_error: "Unable to connect to the server. Make sure the backend is running.",
    msg_logging_in: "Logging in...",
    msg_login_success: "Login successful. Redirecting...",
    msg_invalid_login: "Invalid farm name or password.",
    msg_saving: "Saving changes...",
    msg_profile_updated: "Profile updated successfully.",
    msg_unable_save: "Unable to save changes.",

    msg_weather_loading: "Loading weather information...",
    msg_weather_no_region: "Weather unavailable for this region.",
    msg_weather_unavailable: "Weather unavailable right now.",
    weather_humidity: "Humidity",

    msg_requesting_code: "Requesting reset code...",
    msg_unable_request_code: "Unable to request a reset code.",
    msg_your_code: "Your reset code is:",
    msg_code_note: "(In a production version this would be emailed to you instead.)",
    msg_resetting: "Resetting password...",
    msg_unable_reset: "Unable to reset password.",
    msg_redirecting_login: "Redirecting to login..."

};


// ----------------------------------------
// CROP NAMES (data files store them in English)
// ----------------------------------------

const CROPS_SW = {
    "Maize": "Mahindi",
    "Irish Potatoes": "Viazi Mviringo",
    "Potatoes": "Viazi",
    "Sweet Potatoes": "Viazi Vitamu",
    "Beans": "Maharage",
    "Avocado": "Parachichi",
    "Tea": "Chai",
    "Coffee": "Kahawa",
    "Bananas": "Ndizi",
    "Banana": "Ndizi",
    "Wheat": "Ngano",
    "Sunflower": "Alizeti",
    "Groundnuts": "Karanga",
    "Sorghum": "Mtama",
    "Millet": "Ulezi",
    "Grapes": "Zabibu",
    "Cotton": "Pamba",
    "Cassava": "Muhogo",
    "Rice": "Mchele",
    "Coconut": "Nazi",
    "Sugarcane": "Miwa",
    "Vegetables": "Mboga",
    "Cashew Nuts": "Korosho",
    "Sesame": "Ufuta",
    "Cloves": "Karafuu",
    "Seaweed": "Mwani",
    "Pineapple": "Nanasi",
    "Watermelon": "Tikiti Maji",
    "Tomatoes": "Nyanya",
    "Taro": "Magimbi",
    "Pyrethrum": "Pareto"
};


// ----------------------------------------
// MESSAGES RETURNED BY THE BACKEND
// ----------------------------------------

const SERVER_SW = {
    "Account created successfully": "Akaunti imefunguliwa kikamilifu",
    "Account not found.": "Akaunti haijapatikana.",
    "Authentication required.": "Unahitaji kuingia kwanza.",
    "Development reset code created. In production it is emailed to you. The code expires in 10 minutes.": "Nambari ya majaribio imetengenezwa. Kwenye mfumo halisi itatumwa kwa barua pepe. Inaisha baada ya dakika 10.",
    "If an account exists for that email, a reset code has been sent.": "Ikiwa akaunti yenye barua pepe hiyo ipo, nambari ya kurejesha imetumwa.",
    "Password reset email service is temporarily unavailable. Please contact support.": "Huduma ya barua pepe ya kurejesha nywila haipatikani kwa sasa. Tafadhali wasiliana na msaada.",
    "Password reset email could not be sent. Please try again later.": "Barua pepe ya kurejesha nywila haikutumwa. Tafadhali jaribu tena baadaye.",
    "Farm name / username must be at least 3 characters.": "Jina la shamba / mtumiaji lazima liwe na angalau herufi 3.",
    "Invalid farm name or password.": "Jina la shamba au nywila si sahihi.",
    "Invalid login data.": "Taarifa za kuingia si sahihi.",
    "Invalid or expired reset code.": "Nambari ya kurejesha si sahihi au muda wake umeisha.",
    "Invalid profile data.": "Taarifa za wasifu si sahihi.",
    "Invalid registration data.": "Taarifa za usajili si sahihi.",
    "Invalid request.": "Ombi si sahihi.",
    "Logged out.": "Umetoka.",
    "Login successful": "Umefanikiwa kuingia",
    "No account found with that email.": "Hakuna akaunti yenye barua pepe hiyo.",
    "Password must be at least 6 characters.": "Nywila lazima iwe na angalau herufi 6.",
    "Password reset successful. You can now log in.": "Nywila imewekwa upya kikamilifu. Sasa unaweza kuingia.",
    "Please enter a valid email address.": "Tafadhali weka barua pepe sahihi.",
    "Please select a region.": "Tafadhali chagua mkoa.",
    "Profile updated successfully": "Wasifu umesasishwa kikamilifu",
    "That email is already registered.": "Barua pepe hiyo tayari imesajiliwa.",
    "That farm name / username is already taken.": "Jina hilo la shamba / mtumiaji tayari limechukuliwa.",
    "User not found.": "Mtumiaji hajapatikana."
};


// ----------------------------------------
// HELPERS FOR OTHER SCRIPTS
// ----------------------------------------

function getLanguage() {
    return localStorage.getItem("language") === "sw" ? "sw" : "en";
}

// Translate a dynamic-text key.
function t(key) {

    const dictionary = getLanguage() === "sw" ? SW : EN_DYNAMIC;

    if (dictionary[key] !== undefined) {
        return dictionary[key];
    }

    return EN_DYNAMIC[key] !== undefined ? EN_DYNAMIC[key] : key;

}

function tCrop(name) {

    return getLanguage() === "sw" && CROPS_SW[name]
        ? CROPS_SW[name]
        : name;

}

function tServer(message) {

    return getLanguage() === "sw" && SERVER_SW[message]
        ? SERVER_SW[message]
        : message;

}


// ----------------------------------------
// APPLY A LANGUAGE TO THE PAGE
// ----------------------------------------

function applyLanguage(lang) {

    localStorage.setItem("language", lang);
    document.documentElement.lang = lang === "sw" ? "sw" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (element) {

        if (element.children.length > 0) {
            return;
        }

        // Remember the original English text the first time.
        if (element.dataset.i18nEn === undefined) {
            element.dataset.i18nEn = element.textContent;
        }

        const key = element.dataset.i18n;

        if (lang === "sw" && SW[key] !== undefined) {
            element.textContent = SW[key];
        } else {
            element.textContent = element.dataset.i18nEn;
        }

    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {

        if (element.dataset.i18nEnPlaceholder === undefined) {
            element.dataset.i18nEnPlaceholder = element.placeholder;
        }

        const key = element.dataset.i18nPlaceholder;

        element.placeholder =
            lang === "sw" && SW[key] !== undefined
                ? SW[key]
                : element.dataset.i18nEnPlaceholder;

    });

    document.querySelectorAll("[data-lang-btn]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.langBtn === lang);
    });

    // Let other scripts re-render dynamic content.
    document.dispatchEvent(
        new CustomEvent("languagechange", { detail: { lang: lang } })
    );

}

document.addEventListener("DOMContentLoaded", function () {

    applyLanguage(getLanguage());

    document.querySelectorAll("[data-lang-btn]").forEach(function (button) {

        button.addEventListener("click", function () {
            applyLanguage(button.dataset.langBtn);
        });

    });

});
