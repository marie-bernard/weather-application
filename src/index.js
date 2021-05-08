function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `
          <h3>Next days</h3>
          <div class="card">
            <ul class="list-group list-group-flush">
  `;
  forecast.shift();
  forecast.forEach(function (nextDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
            <li class="list-group-item">
                <div class="row">
                  <div class="col-1">
                    <img src="https://openweathermap.org/img/wn/${
                      nextDay.weather[0].icon
                    }@2x.png" alt="Next days weather icon" class="next-days-icon" />
                  </div>
                  <div class="col-auto col-sm-4">
                    <p class="next-days">${formatDay(nextDay.dt)}</p>
                  </div>
                  <div class="col-sm-7">
                    <p class="next-days-temperature">
                      Min. ${Math.round(
                        nextDay.temp.min
                      )}°C | Max. <strong>${Math.round(
          nextDay.temp.max
        )}°C</strong>
                    </p>
                  </div>
                </div>
              </li>
  `;
    }
  });
  forecastHTML =
    forecastHTML +
    `
            </ul>
          </div>
  `;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `16073f8f6b40b775cda17f1c04c67e04`;
  let apiForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,minutely,current,alert&units=metric&appid=${apiKey}`;
  axios.get(apiForecastURL).then(displayForecast);
}

function displayCurrentTime() {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  if (hour < 10) {
    hour = `0${now.getHours()}`;
  }
  if (minutes < 10) {
    minutes = `0${now.getMinutes()}`;
  }
  return `${hour}:${minutes}`;
}

function displayCurrentDate() {
  let now = new Date();
  let date = now.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  return `${day} ${month} ${date}`;
}

function displayCityWeather(response) {
  console.log(response.data);

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let todayIconCode = response.data.weather[0].icon;
  let todayTemperature = Math.round(response.data.main.temp);
  let todayWeather = response.data.weather[0].main;
  let todayHumidity = response.data.main.humidity;
  let todayWind = Math.round(response.data.wind.speed);

  let currentElement = document.querySelector("#current");
  let currentHTML = `
    <h3>
      <strong>Now</strong>
    </h3>

    <div class="card">
      <div class="card-body">
        <p class="today-date">
          ${displayCurrentDate()} - ${displayCurrentTime()}
        </p>
        <img
          src="https://openweathermap.org/img/wn/${todayIconCode}@2x.png"
          alt="Today weather icon"
          class="today-icon"
        />
        <p>
          <span class="today-temperature">
            ${todayTemperature}</span>
          <span class="celsius">°C
            </span>
        </p>
        <p class="today-weather">${todayWeather}</p>
        <p class="today-details">
          Humidity: ${todayHumidity}%
          <br />
          Wind: ${todayWind} km/h
        </p>
      </div>
    </div>`;

  currentElement.innerHTML = currentHTML;

  getForecast(response.data.coord);
}

function searchCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-input");
  let apiKey = "16073f8f6b40b775cda17f1c04c67e04";
  let units = "metric";
  let apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity.value}&units=${units}&appid=${apiKey}`;
  axios
    .get(apiCityUrl)
    .then(displayCityWeather)
    .catch((error) => {
      alert("This city does not exist. Please try to enter another city name.");
    });
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "16073f8f6b40b775cda17f1c04c67e04";
  let units = "metric";
  let apiCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiCurrentUrl).then(displayCityWeather);
}

function displayCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let searchCityForm = document.querySelector("#city-search-form");
searchCityForm.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", displayCurrentLocationWeather);
