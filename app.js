function WeatherApp() {
  this.searchInput = document.getElementById("search-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherContainer = document.getElementById("weather-container");
  this.apiKey = "1a32acdcd4beaeb8f5220cb47579d176";
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
  this.weatherContainer.innerHTML = `
    <h2>Welcome to SkyFetch ☁️</h2>
    <p>Search for a city to see current weather and 5-day forecast</p>
  `;
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();
  if (!city) return;
  this.getWeather(city);
};

WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();

  try {
    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    this.displayWeather(currentData);

    const processedForecast = this.processForecastData(forecastData.list);
    this.displayForecast(processedForecast);

  } catch (error) {
    this.showError(error.message);
  }
};

WeatherApp.prototype.processForecastData = function (forecastList) {
  const daily = forecastList.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return daily.slice(0, 5);
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <div class="current-weather">
      <h2>${data.name}</h2>
      <h3>${data.main.temp}°C</h3>
      <p>${data.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    </div>
    <div id="forecast-container" class="forecast-grid"></div>
  `;
};

WeatherApp.prototype.displayForecast = function (forecastArray) {
  const container = document.getElementById("forecast-container");

  forecastArray.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    container.innerHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

WeatherApp.prototype.showLoading = function () {
  this.weatherContainer.innerHTML = "<p>Loading...</p>";
};

WeatherApp.prototype.showError = function (message) {
  this.weatherContainer.innerHTML = `
    <p style="color:red;">${message}</p>
  `;
};

const app = new WeatherApp();
app.init();