// Starting elements: 
var apiKey = '58f675d2988b20481c43c86dc8a3070a';
var currentCity = '';
var previousCity = [];
if (localStorage.getItem('city')) {
    previousCity = localStorage.getItem('city').split(',');
}
console.log(previousCity);

// Function to get today's date
function currentDayJs() {
    var currentDay = dayjs().format('dddd MMM D, YYYY');
    $('#currentDay').text(currentDay);
    console.log(currentDay);
}

// function to display weather content
function displayWeatherInfo() {
    // First, search for the city and get the five day forecast
    var city = $('#location-input').val().trim();
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(queryURL).then(function (result) {
        console.log(result);
        return result.json();
    })

        .then(function (fiveDay) {
            console.log(fiveDay);
            // Next, use location data from the five day to find the current weather
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${fiveDay.city.coord.lat}&lon=${fiveDay.city.coord.lon}&units=imperial&appid=${apiKey}`).then(function (body) {
                return body.json();
            }).then(function (oneCall) {
                // Now render the results. First, current weather: 
                console.log(oneCall);
                // Set curent date, get weather icon.
                var currentDate = dayjs().format("MMM D, YYYY");
                var currentWeatherIcon = "https://openweathermap.org/img/w/" + oneCall.weather[0].icon + ".png";
                var currentHTML = `<h3>${oneCall.name} (${currentDate}) <img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${oneCall.main.temp}&#8457;</li>
                <br>
                <li>Wind: ${oneCall.wind.speed} mph</li>
                <br>
                <li>Humidity: ${oneCall.main.humidity}%</li>
            </ul>`;
                $("#current-weather").html(currentHTML);

            }).then(function (renderFive) {
                var fiveDayHTML = `<h2>5-Day Forecast:</h2>
<div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
                // Loop over the 5 day forecast and build the template HTML using UTC offset and Open Weather Map icon

                for (var i = 0; i < fiveDay.list.length; i++) {
                    var dayData = fiveDay.list[i];
                    var dayTime = dayData.dt_txt;
                    // var currentTime = dayjs().utcOffset(timeZoneOffsetHours);
                    console.log('time' + dayTime);
                    var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
                    // Only displaying mid-day forecasts
                    if (currentTime.format("HH:mm:ss") === "12:00:00") {
                        fiveDayHTML += `
        <div class="weather-card card m-2 p0">
            <ul class="list-unstyled p-3">
                <li class="weather-icon"><img src="${iconURL}"></li>
                <li>Temp: ${dayData.main.temp}&#8457;</li>
                <br>
                <li>Wind: ${dayData.wind.speed} mph</li>
                <br>
                <li>Humidity: ${dayData.main.humidity}%</li>
            </ul>
        </div>`;
                    }

                    // Build the HTML template
                    fiveDayHTML += `</div>`;
                    // Append the five-day forecast to the DOM
                    $('#five-day').html(fiveDayHTML);
                }
            })
        })

}


// Display previous searches
function displaySearches() {
    $('#locations-view').empty();
    for (var i = 0; i < previousCity.length; i++) {
        var a = $('<button>')
        a.addClass('location-entry');
        a.attr('data-city', previousCity[i]);
        a.text(previousCity[i]);
        $('#locations-view').append(a);
    }
}

// Target the submit button
$('#location-search').on('click', function (event) {
    event.preventDefault();
    displayWeatherInfo();
    // create a variable to store the input value
    var city = $('#location-input').val().trim();
    // console.log(city);
    previousCity.push(city);
    localStorage.setItem('city', `${previousCity}`);
    console.log('previous ' + previousCity)
    displaySearches();

})


displaySearches()