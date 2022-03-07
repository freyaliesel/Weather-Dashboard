// Expected behaviour:
// search cities via form, perform data fetch
// city's current weather is displayed in main card
// 5 day forecast displayed in cards below
// city is added to search history
// when city is clicked in history, perform data fetch again

// global variables
var alert = document.getElementById("search-alert");

const APIurl = "https://api.openweathermap.org/data/2.5/";
const APIkey = "&appid=5a1140fa35f8197c27125cdd0d68a102";

// found this as a snippet
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

// function definitions

// collect search parameters from user
function collectUserInput(event) {
    event.preventDefault();
    let inputEl = document.getElementById("search-field");
    let city = inputEl.value.trim();
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
    let searchParam;
    let name;
    // if there's a comma, assume correct useage
    // needs its own further conditions to handle spaces in city name
    // then join them back together into the search parameters to call the function
    if (input.includes(",")) {
        let state = input.slice(input.indexOf(",") + 1).trim();
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
    // var search = [{name: name, param: param}];
    // searchHistory = searchHistory.concat(search);
    let searchHistory = [{ name: name, param: param }];
    let savedSearches = JSON.parse(localStorage.getItem("searchHistory"));

    if (savedSearches !== null) {
        searchHistory = searchHistory.concat(savedSearches);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    } else {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}

function displaySearchHistory() {
    console.log("displaying search history");
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    let parentEl = document.getElementById("search-history");
    if (searchHistory !== null) {
        // if (parentEl.hasChildNodes()) {
        emptyElement(parentEl);
        // }
    } else {
        return;
    }
    populateButtons(searchHistory, parentEl);
}

function emptyElement(pEl) {
    let elements = pEl.children.length;
    // console.log(pEl.children);
    if (pEl.hasChildNodes()) {
        for (i = 0; i < elements; i++) {
            pEl.removeChild(pEl.children[0]);
        }
    } else {
        return;
    }
}

function populateButtons(history, parentEl) {
    history.forEach((element) => {
        var buttonEl = document.createElement("button");
        buttonEl.className = "button is-info m-1 history-btn";
        buttonEl.innerHTML = element.name;
        buttonEl.value = element.param;
        parentEl.appendChild(buttonEl);
    });
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
    console.log("getting current weather");
    fetch(APIurl + "weather?q=" + location + "&units=imperial" + APIkey, {
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
    console.log("getting forecast")
        const PARAM = "&units=imperial&exclude=minutely,hourly";
        var lat = "lat=" + coords.lat;
        var lon = "&lon=" + coords.lon;
        console.log(`lat: ${lat}\nlon: ${lon}`);
        fetch(APIurl + "onecall?" + lat + lon + PARAM + APIkey, {
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

function displayCurrentWeather(data) {
    console.log("displaying current weather");
    // first, clear the elements
    let headerEl = document.getElementById("weather-header");
    emptyElement(headerEl);

    // icon for weather conditions
    let iconCode = data.weather[0].icon;
    let iconEl = document.createElement("img");
    iconEl.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    );
    iconEl.setAttribute("alt", data.weather[0].description);
    iconEl.style.display = "inline";
    iconEl.className = "image is-64x64 is-rounded";
    headerEl.append(iconEl);

    // City Name & date
    let nameEl = document.createElement("p");
    nameEl.className = "card-header-title";
    nameEl.textContent = `${data.name} - ${dayjs().format("MMM D, YYYY")}`;
    headerEl.append(nameEl);

    // current weather
    // temperature
    let listEl = document.createElement("ul");
    listEl.style.listStyle = "none";
    let cardEl = document.getElementById("weather-info")
    cardEl.append(listEl);
    let li = document.createElement("li");
    li.textContent =(`Temp: ${data.main.temp}°F`);
    listEl.append(li);
    
    // wind speed
      li = document.createElement("li");
      li.textContent = (`Wind: ${data.wind.speed} MPH`);
      listEl.append(li);

    // humidity
    li = document.createElement("li");
      li.textContent = (`Humidity: ${data}`)

    // uv index with color coding for favorable/moderate/severe
}

window.onload = function () {
    displaySearchHistory();
};

document
    .getElementById("search-hub")
    .addEventListener("click", function (event) {
        let target = event.target;
        if (target.id == "search-btn") {
            //  console.log("search button")
            collectUserInput(event);
        } else if (target.className.includes("history-btn")) {
            //  console.log(target)
            getWeatherInfo(target.value);
        }
    });

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
