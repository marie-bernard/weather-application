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
    todayTemperature.innerHTML = `${celsiusTemperature}`;
  }

  function displayFarenheitTemperature(event) {
    event.preventDefault();
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
