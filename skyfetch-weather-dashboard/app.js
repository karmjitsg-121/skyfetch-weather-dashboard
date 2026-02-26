const apiKey = "5adafef3f09b4f1217c06f9b8c7ea51a"; // Replace with your OpenWeatherMap API key

// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("icon");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error-message");

// Show loading
function showLoading() {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    cityEl.textContent = "";
    tempEl.textContent = "";
    descEl.textContent = "";
    iconEl.src = "";
}

// Hide loading
function hideLoading() {
    loadingEl.classList.add("hidden");
}

// Show error message
function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

// Fetch weather
async function getWeather(city) {
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);

        const data = response.data;

        cityEl.textContent = data.name;
        tempEl.textContent = `Temperature: ${data.main.temp}°C`;
        descEl.textContent = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        hideLoading();
    } catch (error) {
        hideLoading();
        showError("City not found or API error.");
        console.error(error);
    }
}

// Event listener for button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    getWeather(city);
    cityInput.value = "";
});

// Event listener for Enter key
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Load default city (London) on page load
window.addEventListener("DOMContentLoaded", () => {
    getWeather("London");
});