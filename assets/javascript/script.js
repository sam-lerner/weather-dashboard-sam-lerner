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
function displayWeatherInfo(city) {
 
    // First, search for the city and get the five day forecast
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

                for (var i = 4; i < fiveDay.list.length; i += 8) {
                    var dayData = fiveDay.list[i];
                    var currentDate = dayjs.unix(dayData.dt).format('MM/D')
                    // console.log('date' + currentDate);
                    var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
                    // Only displaying mid-day forecasts

                    fiveDayHTML += `
        <div class="weather-card card bg-primary text-white m-2" style="width: 14rem;">
        <h4>${currentDate}</h4>
            <ul class="list-unstyled p-2">
                <li class="weather-icon"><img src="${iconURL}"></li>
                <li>Temp: ${dayData.main.temp}&#8457;</li>
                <br>
                <li>Wind: ${dayData.wind.speed} mph</li>
                <br>
                <li>Humidity: ${dayData.main.humidity}%</li>
            </ul>
        </div>`;

                    // Build the HTML template
             
                    // Append the five-day forecast
                    $('#five-day').html(fiveDayHTML);
                }
            })
        })
}

// Display previous searches
function displaySearches(cities) {
    $('#locations-view').empty();
    for (var i = 0; i < cities.length; i++) {
        var a = $('<button>')
        a.addClass('location-entry');
        a.attr('data-city', cities[i]);
        a.text(cities[i]);
        $('#locations-view').append(a);

    }

}

// Target the submit button
$('#location-search').on('click', function (event) {
    event.preventDefault();
    displayWeatherInfo($('#location-input').val().trim());
    // create a variable to store the input value
    var city = $('#location-input').val().trim();
    previousCity.push(city);
    // Remove duplicates
    var cityArr = previousCity.filter((c, index) => {
        return previousCity.indexOf(c) === index;
    });
    localStorage.setItem('city', cityArr);
    // console.log('previous ' + cityArr)
    displaySearches(cityArr);
    // $('#location-input').value = "";
    document.getElementById('location-input').value = '';
})

displaySearches(previousCity)

// Function for city name buttons
$('.location-entry').on('click', function (event) {
    event.preventDefault();
    // console.log(event.target.innerHTML)
    displayWeatherInfo(event.target.innerHTML);
})
