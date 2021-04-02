var forecastContainerEl = $("#forecast");

//Init an array to contain the city search history
var searchHistory = [];

//Search current weather for a city
function searchCityByName(cityName){

    //Determine the api url by feeding in the city name
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&units=metric&appid=c17008019bfc88b06737b4ffe4cba08b";

    //Fetch the data from OpenWeater
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //Take the coordinates from the search and query one call weather API
                searchCityByLonLat(data.coord.lon, data.coord.lat, data.name);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Error: Cannot connect to the server");
    });
}

//Search weather by longitude and latitude
function searchCityByLonLat(longitude, latitude, city){

    //Determine the api url by feeding in the longitude and latitude
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ latitude +"&lon="+ longitude +"&units=metric&appid=c17008019bfc88b06737b4ffe4cba08b";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){

                console.log(data);

                displayCurrentWeather(data, city);
                displayFutureWeather(data);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Error: Cannot connect to the server");
    });

}

//Display current weather conditions
function displayCurrentWeather(data, cityName){

    var city = cityName;
    var date = moment().format("MM/DD/YYYY");
    var temperature = Math.ceil(data.current.temp);
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed; 
    var icon = data.current.weather[0].icon;
    var uvi = data.current.uvi;
    console.log(city, date, temperature, humidity, windSpeed, icon, uvi);

    var currentContainter = $("<div>").addClass("row my-3").html("<div class='col-12'><div class='card'><div class='card-body'><h2 class='card-title display-4'></h2></div></div></div>");
    currentContainter.find(".card-title").html(city + " " + date + " <img src='http://openweathermap.org/img/wn/"+ icon +"@4x.png'></img>");
    $("<p>").text("Temperature: " + temperature + " C").appendTo(currentContainter.find(".card-body"));
    $("<p>").text("Wind Speed: " + windSpeed + " Km/h").appendTo(currentContainter.find(".card-body"));
    $("<p>").text("Humidity: " + humidity + " %").appendTo(currentContainter.find(".card-body"));
    $("<p>").text("UV Index: " + uvi).appendTo(currentContainter.find(".card-body"));

    currentContainter.appendTo(forecastContainerEl);
}

//Display future conditions for a city
function displayFutureWeather(data){

    var futureContainter = $("<div>").addClass("row").html("<h2 class='col-12 display-4'>5-Day Forecast</h2>");

    for(var day = 1; day < 6; day++){
        var fDate = moment.unix(data.daily[day].dt).format("MM/DD/YYYY");
        var fTemp = Math.ceil(data.daily[day].temp.max); 
        var fHumidity = data.daily[day].humidity;
        var fWindSpeed = data.daily[day].wind_speed;
        var fIcon = data.daily[day].weather[0].icon;
        console.log(fDate, fTemp, fHumidity, fWindSpeed, fIcon);

        var forecastBox = $("<div>").addClass("col").html("<div class='card bg-primary'><div class='card-body'></div></div>");

        $("<h3>").addClass("card-title").text(fDate).appendTo($(forecastBox).find(".card-body"));
        $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ fIcon +"@2x.png").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Temperature: " + fTemp + " C").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Wind Speed: " + fWindSpeed + " Km/h").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Humidity: " + fHumidity + " %").appendTo($(forecastBox).find(".card-body"));

        forecastBox.appendTo(futureContainter);
    }

    futureContainter.appendTo(forecastContainerEl);    
}

//When checking the UV change color based on favorable, moderate, or severe conditions

//Add city to search history

//Open the current and future conditions when clicking on search history

searchCityByName("Oakville");
