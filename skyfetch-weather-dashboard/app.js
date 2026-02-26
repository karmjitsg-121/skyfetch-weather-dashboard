const apiKey = "1a32acdcd4beaeb8f5220cb47579d176";
const city = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
    .then(function(response) {
        console.log(response.data);

        const cityName = response.data.name;
        const temp = response.data.main.temp;
        const description = response.data.weather[0].description;
        const iconCode = response.data.weather[0].icon;

        document.getElementById("city").textContent = cityName;
        document.getElementById("temperature").textContent = `Temperature: ${temp}°C`;
        document.getElementById("description").textContent = description;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById("icon").src = iconUrl;
    })
    .catch(function(error) {
        console.error("Error fetching weather data:", error);
    });