// control objects
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");

// Load default weather data for Cairo on page load
window.addEventListener("DOMContentLoaded", () => {
  getWeather("Cairo");
});

// API key for WeatherAPI
const apiKey = "43a317a985364dab9b4225308252906";
// Add event listener to search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Function to fetch weather data
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
    );
    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    weatherCards.innerHTML = `<div class="text-danger">City not found.</div>`;
  }
}

//function for real time search suggestions
const suggestionsList = document.getElementById("suggestions");

// Clear suggestions when input is empty
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
    );
    const cities = await res.json();

    suggestionsList.innerHTML = cities
      .map(
        (city) => `
      <li class="list-group-item list-group-item-action" style="cursor:pointer">
        ${city.name}, ${city.country}
      </li>
    `
      )
      .join("");

    document.querySelectorAll("#suggestions li").forEach((item) => {
      item.addEventListener("click", () => {
        cityInput.value = item.innerText;
        suggestionsList.innerHTML = "";
        getWeather(cityInput.value);
      });
    });
  } catch (error) {
    console.error("Live search error:", error);
    suggestionsList.innerHTML = "";
  }
});
// Prevent form submission on Enter key
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
      suggestionsList.innerHTML = "";
    }
  }
});

// Add event listener to search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    suggestionsList.innerHTML = "";
  }
});

// Function to display weather data
function displayWeather(data) {
  document.getElementById("cityName").innerText = data.location.name;
  weatherCards.innerHTML = "";
  data.forecast.forecastday.forEach((day) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const card = `
      <div class="col-md-4">
        <div class="weather-card">
          <h5 class="fw-semibold">${dayName}</h5>
          <small class="text-white">${day.date}</small>
          <img
            src="https:${day.day.condition.icon}"
            class="weather-icon"
            alt="weather-icon"
          />
          <h2 class="fw-bold">${day.day.maxtemp_c}°C</h2>
          <p class="text-blue">${day.day.condition.text}</p>
          <div class="d-flex justify-content-around mt-3 weather-info">
            <div><img src="images/imgi_3_icon-umberella.png" /> ${day.day.avghumidity}%</div>
            <div><img src="images/imgi_4_icon-wind.png" /> ${day.day.maxwind_kph}km/h</div>
            <div><img src="images/imgi_5_icon-compass.png" /> ${data.current.wind_dir}</div>
          </div>
        </div>
      </div>
    `;
    weatherCards.innerHTML += card;
  });
}
