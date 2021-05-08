function displayCurrentDate() {
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

function displayCurrentTime() {
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

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `
  <div class="col-md-7">
          <h3>In the next days</h3>
          <div class="card">
            <ul class="list-group list-group-flush">
  `;
  let nextDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  nextDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
            <li class="list-group-item">
                <div class="row">
                  <div class="col-1">
                    <img src="https://openweathermap.org/img/wn/04d@2x.png" alt="Next days weather icon" class="next-days-icon" />
                  </div>
                  <div class="col-auto col-sm-4">
                    <p class="next-days">${day}</p>
                  </div>
                  <div class="col-sm-7">
                    <p class="next-days-temperature">
                      Min. 6°C - Max. <strong>13°C</strong>
                    </p>
                  </div>
                </div>
              </li>
  `;
  });
  forecastHTML =
    forecastHTML +
    `
            </ul>
          </div>
        </div>
  `;

  forecastElement.innerHTML = forecastHTML;
}

function displayCityWeather(response) {
  let city = document.querySelector("#city");
  let todayIcon = document.querySelector("#today-icon");
  let todayTemperature = document.querySelector("#today-temperature");
  let celsius = document.querySelector("#celsius");
  let farenheit = document.querySelector("#farenheit");
  let todayWeather = document.querySelector("#today-weather");
  let todayHumidity = document.querySelector("#today-humidity");
  let todayWind = document.querySelector("#today-wind");
  let celsiusTemperature = Math.round(response.data.main.temp);
  let todayIconCode = response.data.weather[0].icon;
  todayIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${todayIconCode}@2x.png`
  );
  city.innerHTML = response.data.name;
  todayTemperature.innerHTML = `${celsiusTemperature}`;
  todayWeather.innerHTML = response.data.weather[0].main;
  todayHumidity.innerHTML = response.data.main.humidity;
  todayWind.innerHTML = Math.round(response.data.wind.speed);

  celsius.addEventListener("click", displayCelsiusTemperature);
  farenheit.addEventListener("click", displayFarenheitTemperature);

  function displayCelsiusTemperature(event) {
    event.preventDefault();
    farenheit.classList.remove("active");
    celsius.classList.add("active");
    todayTemperature.innerHTML = `${celsiusTemperature}`;
  }

  function displayFarenheitTemperature(event) {
    event.preventDefault();
    celsius.classList.remove("active");
    farenheit.classList.add("active");
    let farenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
    todayTemperature.innerHTML = `${farenheitTemperature}`;
  }
}

function searchCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-input");
  let apiKey = "16073f8f6b40b775cda17f1c04c67e04";
  let units = "metric";
  let apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity.value}&units=${units}&appid=${apiKey}`;
  axios.get(apiCityUrl).then(displayCityWeather);
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

let now = new Date();
let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = displayCurrentDate(now);

let currentTime = document.querySelector("#current-time");
currentTime.innerHTML = displayCurrentTime(now);

displayForecast();
