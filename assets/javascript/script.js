// Starting elements: 
var apiKey = '58f675d2988b20481c43c86dc8a3070a';
var currentCity = '';
var previousCity = [];
if (localStorage.getItem('city')) {
    previousCity = localStorage.getItem('city').split(',');
}
console.log(previousCity);

// function to display weather content
function displayWeatherInfo() {
    var city = $('#location-input').val().trim();
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(queryURL).then(function (result) {
        console.log(result);
        return result.json();
    })
        .then(function (fiveDay) {
            console.log(fiveDay);

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${fiveDay.city.coord.lat}&lon=${fiveDay.city.coord.lon}&units=imperial&appid=${apiKey}`).then(function (body) {
                return body.json();
            }).then(function (oneCall) {
                console.log(oneCall);
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