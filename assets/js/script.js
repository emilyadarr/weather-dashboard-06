var searchEl = document.querySelector("#city-form");
var locationInputEl = document.querySelector("#location-input");
var weatherEl = document.querySelector("#weather");
var weatherHistoryEl = document.querySelector("#search-history");

// formSubmitHandler 
var locations = JSON.parse(window.localStorage.getItem("locations")) || [];
var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  const locationName = locationInputEl.value.trim();

  // push location name into locations array and save to local storage
  if (locationName) {
    getLocationWeather(locationName);
    locations.push(locationName);
    window.localStorage.setItem("locations", JSON.stringify(locations));
    locationInputEl.value = "";
    // add new button in search history
    var newLocationButton = document.createElement("button");
    newLocationButton.classList = "btn btn-secondary btn-block mt-2";
    newLocationButton.setAttribute("type", "submit");
    newLocationButton.innerText = locationName;
    weatherHistoryEl.appendChild(newLocationButton);
    newLocationButton.addEventListener("click", function() {
      getLocationWeather(locationName);
    });
  }
  else {
    alert("Please enter a location");
  }
};

// function to get weather information from Open Weather API
var getLocationWeather = function(location) {
  // format api url
  var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=5&appid=51c677018609a1c353939bc35d4c5730";
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(locationResponse) {
          var lat = locationResponse[0].lat;
          var lon = locationResponse[0].lon;

          var apiUrlLocation = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly,alerts&units=imperial&appid=51c677018609a1c353939bc35d4c5730";
          fetch(apiUrlLocation)
            .then(function(response) {
              if (response.ok) {
                response.json().then(function(data) {
                  displayWeather(data, location);
                  displayForecast(data);
                })
              }
              else {
                alert ("Error: Location not found");
              }
            })
            .catch(function(error) {
              alert("Unable to connect to Open Weather");
            });
        });
      }
      else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
};

// display current weather 
var displayWeather = function(data, location) {
  // clear old content
  weatherEl.textContent = "";

  var weatherTodayCard = document.createElement("div");
  var cardBody = document.createElement("div");
  var cityName = document.createElement("h4");
  var date = moment(data.current.dt *1000).format("M/D/YYYY");
  var currentIcon = data.current.weather[0].icon;
  var currentIconEl = document.createElement("span");
  var currentTemp = document.createElement("p");
  var currentWind = document.createElement("p");
  var currentHumidity = document.createElement("p");
  var currentUV = document.createElement("p");
  var currentUVEl = document.createElement("div");
  var UV = data.current.uvi;

  weatherTodayCard.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  cityName.setAttribute("class", "card-title");
  cityName.textContent = location + " (" + date +")";
  currentIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentIcon + ".png'>"
  currentTemp.textContent = "Temp: " + data.current.temp + "°F";
  currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
  currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
  currentUV.textContent = "UV Index: ";
  currentUV.classList = "d-flex flex-row";
  currentUVEl.textContent = UV;

  currentUV.appendChild(currentUVEl);
  cityName.appendChild(currentIconEl);
  cardBody.append(cityName, currentTemp, currentWind, currentHumidity, currentUV);
  weatherTodayCard.appendChild(cardBody);
  weatherEl.appendChild(weatherTodayCard);

  auditUV(currentUVEl, UV);
};

// check UV low, moderate or high conditions
var auditUV = function(currentUVEl, UV) {
  if (UV < 3) {
    $(currentUVEl).removeClass("uv-mod uv-high");
    $(currentUVEl).addClass("uv-low");
  }
  else if (UV >= 3 && UV < 8) {
    UV.removeClass("uv-low uv-high");
    UV.addClass("uv-mod");
  }
  else if (UV >= 8) {
    UV.removeClass("uv-mod uv-low");
    UV.addClass("uv-high");
  }
};

// display 5 day forecast
var displayForecast = function(data) {
  var forecastEl = document.createElement("div");
  var forecastTitle = document.createElement("h5");
  var forecastCardsEl = document.createElement("div");
  forecastTitle.textContent = "5-Day Forecast:";
  forecastTitle.setAttribute("class", "mt-3");
  forecastCardsEl.classList = "card-deck";
  forecastEl.appendChild(forecastTitle);
  weatherEl.appendChild(forecastEl);
  weatherEl.appendChild(forecastCardsEl);

  //loop over daily forecast
  for (var i=1; i < 6; i++) {
    var date = moment(data.daily[i].dt *1000).format("M/D/YYYY");

    //create a container for each day
    var dayCard = document.createElement("div");
    var dayCardBody = document.createElement("div");
    var dayCardDate = document.createElement("h5");
    var dayIcon = data.daily[i].weather[0].icon;
    var dayIconEl = document.createElement("span");
    var dayTemp = document.createElement("p");
    var dayWind = document.createElement("p");
    var dayHumidity = document.createElement("p");

    dayCard.classList = "card text-white bg-info mb-3";
    dayCardBody.classList = "card-body";
    dayCardDate.classList = "card-title";
    dayCardDate.textContent = date;
    dayIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + dayIcon + ".png'>"
    dayTemp.classList = "card-text";
    dayTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
    dayWind.classList = "card-text";
    dayWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    dayHumidity.classList = "card-text";
    dayHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";

    dayCardDate.appendChild(dayIconEl);
    dayCardBody.append(dayCardDate, dayTemp, dayWind, dayHumidity);
    dayCard.appendChild(dayCardBody);
    forecastCardsEl.appendChild(dayCard);
  }

};

// load saved locations
var loadWeatherHistory = function() {
  var savedWeatherHistory = JSON.parse(window.localStorage.getItem("locations")) || [];

  //create buttons 
  for (var i=0; i < savedWeatherHistory.length; i++) {
    var locationButton = document.createElement("button");
    locationButton.classList = "btn btn-secondary btn-block mt-2";
    locationButton.innerText = savedWeatherHistory[i];
    const locationText = savedWeatherHistory[i];
    weatherHistoryEl.appendChild(locationButton);
    locationButton.addEventListener("click", function() {
      getLocationWeather(locationText);
    });
  }
};

searchEl.addEventListener("submit", formSubmitHandler);

loadWeatherHistory();