// Expected behaviour:
// search cities via form, perform data fetch
// city's current weather is displayed in main card
// 5 day forecast displayed in cards below
// city is added to search history
// when city is clicked in history, perform data fetch again

// global variables
var alert = document.getElementById("search-alert");
const apiURL = "https://api.openweathermap.org/data/2.5/";
const APIkey = "&appid=5a1140fa35f8197c27125cdd0d68a102";
// found this as a snippet
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

// function definitions

// collect search parameters from user
function collectUserInput(event) {
    event.preventDefault();
    var inputEl = document.getElementById("search-field");
    var city = inputEl.value.trim();
    console.log(city.length);
    if (city.length > 0) {
        console.log(`original string: "${city}"`);
        parseUserInput(city);
        alert.style.display = "none";
    } else {
        alert.style.display = "inline";
    }
}

// parse user input for search parameters
// THIS NEEDS MORE FINE TUNING FOR USER FRIENDLY EXPERIENCE
function parseUserInput(input) {
    var searchParam;
    var name;
    // if there's a comma, assume correct useage
    // needs its own further conditions to handle spaces in city name
    // then join them back together into the search parameters to call the function
    if (input.includes(",")) {
        var state = input.slice(input.indexOf(",") + 1).trim();
        console.log(`string after slice: "${input}"\n new string: "${state}"`);
    }
    // if inner spaces, replace inner spaces with '+'
    else if (input.includes(" ")) {
        searchParam = input.replace(/ /g, "+");
        console.log("search parameters: " + searchParam);
    }
    // if just alphabetic, send it through unchanged
    else if (isAlpha(input)) {
        searchParam = input;
        name = input;
    }
    // if includes non-alphabetic characters other than spaces or commas, reject
    else {
        alert.style.display = "inline";
        return;
    }
    getWeatherInfo(searchParam);
    saveSearch(name, searchParam);
}

function saveSearch(name, param) {
    var search = {
        name: name,
        param: param,
    };
    var searchHistory = [search];

    var savedSearches = JSON.parse(localStorage.getItem(searchHistory));
    if (savedSearches !== null) {
        console.log(savedSearches);
        searchHistory = searchHistory.concat(savedSearches);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory(searchHistory);
    } else {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory(searchHistory);
    }
}

function displaySearchHistory(searchHistory) {
  console.log("displaying search history")
  // array.forEach(element => {
  //   var document.createElement
    
  // });
}

function displayCurrentWeather(data) {
    console.log("displaying current weather");
    // current weather
    // City Name & date
    // icon for weather conditions
    // temperature
    // humidity
    // wind speed
    // uv index with color coding for favorable/moderate/severe
}

function displayForecast(data) {
    console.log("displaying Forecast");
    // 5-day forecast handles:
    // date
    // icon for weather conditions
    // temperature
    // wind speed
    // humidity
}

function getWeatherInfo(location) {
    fetch(apiURL + "weather?q=" + location + "&units=imperial" + APIkey, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayCurrentWeather(data);
            // call function getting forecast information
            getForecast(data.coord);
        });
}

function getForecast(coords) {
    const PARAM = "&units=imperial&exclude=minutely,hourly";
    var lat = "lat=" + coords.lat;
    var lon = "&lon=" + coords.lon;
    console.log(`lat: ${lat}\nlon: ${lon}`);

    fetch(apiURL + "onecall?" + lat + lon + PARAM + APIkey, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayForecast(data);
        });
}

document
    .getElementById("search-btn")
    .addEventListener("click", collectUserInput);

// script from Bulma for handling the modal
document.addEventListener("DOMContentLoaded", () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add("is-active");
    }

    function closeModal($el) {
        $el.classList.remove("is-active");
    }

    function closeAllModals() {
        (document.querySelectorAll(".modal") || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll(".modal-trigger") || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        // console.log($target);

        $trigger.addEventListener("click", () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (
        document.querySelectorAll(
            ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
        ) || []
    ).forEach(($close) => {
        const $target = $close.closest(".modal");

        $close.addEventListener("click", () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener("keydown", (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) {
            // Escape key
            closeAllModals();
        }
    });
});
