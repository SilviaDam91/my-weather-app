let currentDate = new Date();
let weekDay = document.querySelector("#current-day");
let searchEngine = document.querySelector("#search-form");
let nowCelsius = document.querySelector("#celsius");
let nowFahrenheit = document.querySelector("#fahrenheit");
let apiKey = "968e9119f2237b959ae20b2dab5f8100";
let currentWeatherButton = document.querySelector(
  "#search-currentPositionWeather"
);
let temperatureElement = document.querySelector("#now-temperature");
let precipitationElement = document.querySelector("#current-weather");
let umidityElement = document.querySelector("#current-umidity");
let windElement = document.querySelector("#current-wind");
let searchedCity = document.querySelector("#city");
let searchedInput = document.querySelector("#search-input");
let resetButton = document.querySelector("#reset");
let iconElement = document.querySelector("#icon");

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
  );

  temperatureElement.innerHTML = `${temperature}°C`;
  precipitationElement.innerHTML = `Currently we have ${response.data.weather[0].description}`;
  umidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windElement.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
}

function getCurrentTemperatureonTypedCity(event) {
  event.preventDefault();

  weekDay.innerHTML = `${getTimeDate(currentDate)}, in ${searchedInput.value}`;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedInput.value}&units=metric`;
  axios
    .get(`${apiUrl}&appid=${apiKey}`)
    .then(showTemperature)
    .catch(function (err) {
      weekDay.innerHTML = null;
      temperatureElement.innerHTML = null;
      precipitationElement.innerHTML = null;
      umidityElement.innerHTML = null;
      windElement.innerHTML = null;
      alert("Please, type a valid city.");
    });
}

function getTimeDate(date) {
  let hoursToday = currentDate.getHours();
  if (hoursToday < 10) {
    hoursToday = `0${hoursToday}`;
  }
  let minutesToday = currentDate.getMinutes();
  if (minutesToday < 10) {
    minutesToday = `0${minutesToday}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayToday = days[currentDate.getDay()];

  return `${dayToday} ${hoursToday}:${minutesToday} `;
}

function showWeather(response) {
  let currentTemperatureInCurrentLocation = Math.round(response.data.main.temp);
  weekDay.innerHTML = `${getTimeDate(currentDate)}, in ${response.data.name}, ${
    response.data.sys.country
  }`;
  temperatureElement.innerHTML = `${currentTemperatureInCurrentLocation}°C `;
  precipitationElement.innerHTML = `Currently we have ${response.data.weather[0].description}`;
  umidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windElement.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
}

function retrievePosition(position) {
  let urlLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  axios.get(urlLocation).then(showWeather);
}

function clickRetrievePosition() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function defaultCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  weekDay.innerHTML = `${getTimeDate(currentDate)}, in ${city}`;
}

currentWeatherButton.addEventListener("click", clickRetrievePosition);
searchEngine.addEventListener("submit", getCurrentTemperatureonTypedCity);

defaultCity("Amsterdam");
