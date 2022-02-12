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

var apiKey = "ddb78fb26a4a22cbdc0348544113b29a"
var htmlButton = $("#pastSearch")
$("#time").text(moment().format("MMMM Do YYYY"))

var pastSearch = JSON.parse(localStorage.getItem("city")) || []
    for (let i = 0; i < pastSearch.length; i++) {
        const pastSearchCity = pastSearch[i];
        var buttonEl = $("<button>")
        buttonEl.text(pastSearchCity)
        htmlButton.append(buttonEl)

    }

function handleFormSubmit(event) {
    event.preventDefault();
    var userInput = $(this);
    var city = userInput[0][0].value
    pastSearch.push(city)
    var buttonEl = $("<button>")
    buttonEl.text(city)
    htmlButton.append(buttonEl)
    localStorage.setItem("city", JSON.stringify(pastSearch))
    getLocation("", city);
};

function getLocation(event, city) {
    if (event) {
        city = $(this).text()
    }
    console.log(city)
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&appid=${apiKey}`
    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data);
        $("#city").text(city)
        getWeather(data[0].lat, data[0].lon)
    })
}

function getWeather(lat,lon) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data);
        var fiveDayRow = $(".row")
        var tempEl = $("#temp")
        var humidEl = $("#humid")
        var windEl = $("#wind")
        var uvindexEl = $("#uvindex")
        tempEl.text(data.current.temp)
        humidEl.text(data.current.humidity)
        windEl.text(data.current.wind_speed)
        uvindexEl.text(data.current.uvi)
        // jquery.style to change background for uvindexel //
        fiveDayRow.empty();
        for (let i = 1; i < 6; i++) {
            const element = data.daily[i];
            
            var fiveDayEl = `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="Card image cap">
            <div class="card-body">
              <p class="card-text">Temperature:${element.temp.max}</p>
              <p class="card-text">Humidity:${element.humidity}</p>
              <p class="card-text">Wind Speed:${element.wind_speed}</p>
              <p class="card-text">UV Index:${element.uvi}</p>
            </div>
          </div>`
          fiveDayRow.append(fiveDayEl)
        }

    })
}

$("#form").on("submit", handleFormSubmit)
htmlButton.on("click", "button", getLocation)




console.log("loaded");