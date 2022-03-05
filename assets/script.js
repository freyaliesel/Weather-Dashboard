// Expected behaviour:
// search cities via form, perform data fetch
// city's current weather is displayed in main card
// 5 day forecast displayed in cards below
// city is added to search history
// when city is clicked in history, perform data fetch again

// OpenWeather API Key
const APIkey = "&appid=5a1140fa35f8197c27125cdd0d68a102";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// var city = "Chicago";

function collectUserInput(event) {
    event.preventDefault();
    var inputEl = document.getElementById("search-field");
    var city = inputEl.value.trim();
    console.log(city.length);
    if (city.length > 0) {
        //do something
    }

}

function displayWeather(data) {
    // current weather
    // City Name & date
    // icon for weather conditions
    // temperature
    // humidity
    // wind speed
    // uv index with color coding for favorable/moderate/severe
    // 5-day forecast handles:
    // date
    // icon for weather conditions
    // temperature
    // wind speed
    // humidity
}

function getWeatherInfo(city) {
    fetch(apiURL + city + APIkey, {
        method: "GET", //GET is the default.
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayWeather(data);
        });
}

function getForecast() {
    const URL = "https://api.openweathermap.org/data/2.5/onecall?";
    const PARAM = "&units=imperial&exclude=minutely,hourly";
    var lat = "lat=41.85";
    var lon = "&lon=-87.65";

    fetch(URL + lat + lon + PARAM + APIkey, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayWeather(data);
        });
}

document
    .getElementById("search-btn")
    .addEventListener("click", collectUserInput);

//     document.getElementById("search-help").addEventListener("click", function (){
//         function openModal(element) {
//             element.classList.add('is-active')
//         }


//     })


document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      console.log($target);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });