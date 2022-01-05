var searchEl = document.querySelector("#city-form");
var locationInputEl = document.querySelector("#location-input");

var formSubmitHandler = function(event) {
  event.preventDefault();
  //get value form input element
  var locationName = locationInputEl.value.trim();

  if (locationName) {
    getLocationWeather(locationName);
    locationInputEl.value = "";
  }
  else {
    alert("Please enter a location");
  }
  console.log(locationName);
};

var getLocationWeather = function(location) {
  //format api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=51c677018609a1c353939bc35d4c5730";

  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data, location);
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

searchEl.addEventListener("submit", formSubmitHandler);
//getLocationWeather();

// User Story
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// Acceptance Criteria
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city