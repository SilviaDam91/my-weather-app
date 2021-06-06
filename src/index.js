let currentDate = new Date();
let weekDay = document.querySelector("#current-day");
let searchEngine = document.querySelector("#search-form");
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusTemperature = null;
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

function displayTemperature(response) {
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
  );

  celsiusTemperature = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = `${celsiusTemperature}`;
  precipitationElement.innerHTML = `Currently we have ${response.data.weather[0].description}`;
  umidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windElement.innerHTML = `Wind: ${response.data.wind.speed} km/h`;

  getForecast(response.data.coord);
}

function handleSubmit(event) {
  event.preventDefault();

  weekDay.innerHTML = `${getTimeDate(currentDate)}, in ${searchedInput.value}`;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedInput.value}&units=metric`;
  axios
    .get(`${apiUrl}&appid=${apiKey}`)
    .then(displayTemperature)
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

  return `${dayToday} ${hoursToday}:${minutesToday}`;
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
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayTemperature);
  weekDay.innerHTML = `${getTimeDate(currentDate)}, in ${city}`;
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  temperatureElement.innerHTML = celsiusTemperature;
}

function getForecast(coordinates) {
  let oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(oneCallApiUrl).then(displayForecast);
}

function displayForecast(response) {
  le;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  ///let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="row">
            <div class="col-6">
              <div class="weather-forecast-date">${day}</div>
              <img
                src="http://openweathermap.org/img/wn/50d@2x.png"
                alt=""
                width="42"
              />
              <div class="weather-forecast-temperatures">
                <span class="max_temperature"> 18° </span>
                <span class="min_temperature"> 12° </span>
              </div>
            </div>
          </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

currentWeatherButton.addEventListener("click", clickRetrievePosition);
searchEngine.addEventListener("submit", handleSubmit);

defaultCity("Amsterdam");

fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
celsiusLink.addEventListener("click", displayCelsiusTemperature);
