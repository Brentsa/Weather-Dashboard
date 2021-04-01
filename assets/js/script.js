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
function searchCityByLonLat(longitude, latitude, City){

    //Determine the api url by feeding in the longitude and latitude
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ latitude +"&lon="+ longitude +"&units=metric&appid=c17008019bfc88b06737b4ffe4cba08b";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){

                //Current Conditions: name, date, current weather icon, temp, humidity, wind speed, UVI 
                var city = City;
                var date = moment().format("MM/DD/YYYY");
                var temp = Math.ceil(data.current.temp);
                var humidity = data.current.humidity;
                var windSpeed = data.current.wind_speed; 
                var icon = data.current.weather[0].icon;
                var uvi = data.current.uvi;
                console.log(city, date, temp, humidity, windSpeed, icon, uvi);

                //Future Conditions: date, icon, temp, wind, and humidity
                for(var day = 1; day < 6; day++){
                    var fDate = moment.unix(data.daily[day].dt).format("MM/DD/YYYY");
                    var fTemp = Math.ceil(data.daily[day].temp.max); 
                    var fHumidity = data.daily[day].humidity;
                    var fWindSpeed = data.daily[day].wind_speed;
                    var fIcon = data.daily[day].weather[0].icon;
                    console.log(fDate, fTemp, fHumidity, fWindSpeed, fIcon);
                }
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Error: Cannot connect to the server");
    });

}

//Display current and future conditions for a city

//Display current weather conditions
function displayCurrentWeather(name, date, icon, temp, humidity, windSpeed, uv){

    console.log("called");
    var currentContainter = $("<div>").addClass("row my-3").html("<div class='col-12'><div class='card'><div class='card-body'><h2 class='card-title display-4'>Current Forecast</h2></div></div></div>");
    currentContainter.appendTo(forecastContainerEl);
}

function displayFutureWeather(date, icon, temp, humidity, windSpeed){
    console.log("called");
    var futureContainter = $("<div>").addClass("row my-3").html("<div class='row'><h2 class='col-12 display-4'>5-Day Forecast</h2><div class='col'><div class='card bg-primary'><div class='card-body'><h5 class='card-title'>Forcast</h5></div></div></div><div class='col'><div class='card bg-primary'><div class='card-body'><h5 class='card-title'>Forcast</h5></div></div></div><div class='col'><div class='card bg-primary'><div class='card-body'><h5 class='card-title'>Forcast</h5></div></div></div><div class='col'><div class='card bg-primary'><div class='card-body'><h5 class='card-title'>Forcast</h5></div></div></div><div class='col'><div class='card bg-primary'><div class='card-body'><h5 class='card-title'>Forcast</h5></div></div></div></div>");
    futureContainter.appendTo(forecastContainerEl);
}

//When checking the UV change color based on favorable, moderate, or severe conditions

//Add city to search history

//Open the current and future conditions when clicking on search history

searchCityByName("Oakville");

displayCurrentWeather(1,1,1,1,1,1,1);
displayFutureWeather(1,1,1,1,1);