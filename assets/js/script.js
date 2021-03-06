//Init our city forecast container
var forecastContainerEl = $("#forecast");

//Init an array to contain the city search history
var searchHistory = [];

//Init a switch that tells the search function to save the user search
var bSaveSearch = true;

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
                //Display one call weather data based on the logitude and latitude
                displayWeather(data, city);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Error: Cannot connect to the server");
    });

}

//Display both current and future weather
function displayWeather(data, cityName){

    //Clear any prior weather data and display new search data
    forecastContainerEl.html("");
    displayCurrentWeather(data, cityName);
    displayFutureWeather(data);
}

//Display current weather conditions
function displayCurrentWeather(data, cityName){

    //Initialize all the weather variables
    var city = cityName;
    var date = moment().format("MM/DD/YYYY");
    var temperature = Math.ceil(data.current.temp);
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed; 
    var icon = data.current.weather[0].icon;
    var uvi = data.current.uvi;

    //Add the city to the search history
    addCityToHistory(city);

    //Dynamically create the html that displays the key weather metrics
    var currentContainter = $("<div>").addClass("row my-3 font-bold").html("<div class='col-12'><div class='card'><div class='row'><div class='col-8'><div class='card-body'><h2 class='card-title title-header'></h2></div></div><div class='col-4'></div></div></div></div>");
    currentContainter.find(".card-title").html(city + "  (" + date + ")"); //+ " <img src='http://openweathermap.org/img/wn/"+ icon +"@4x.png'></img>");
    currentContainter.find(".col-4").html("<img src='http://openweathermap.org/img/wn/"+ icon +"@4x.png' width=50%></img>");
    $("<p>").text("Temperature: " + temperature + " C").appendTo(currentContainter.find(".card-body"));
    $("<p>").text("Wind Speed: " + windSpeed + " Km/h").appendTo(currentContainter.find(".card-body"));
    $("<p>").text("Humidity: " + humidity + " %").appendTo(currentContainter.find(".card-body"));

    //When checking the UV change color based on favorable, moderate, or severe conditions
    var uviData = $("<p>").html("UV Index: <span class='py-1 px-3 rounded'>" + uvi + "</span>").appendTo(currentContainter.find(".card-body"));
    modifyUVColor(uviData, uvi);

    currentContainter.appendTo(forecastContainerEl);
}

//Display future conditions for a city
function displayFutureWeather(data){

    //Create a container to hold all of the 5 day forecast cards
    var futureContainter = $("<div>").addClass("row").html("<h2 class='col-12 title-header'>5-Day Forecast</h2>");

    for(var day = 1; day < 6; day++){
        //Initialize all the weather variables
        var fDate = moment.unix(data.daily[day].dt).format("MM/DD/YYYY");
        var fTemp = Math.ceil(data.daily[day].temp.max); 
        var fHumidity = data.daily[day].humidity;
        var fWindSpeed = data.daily[day].wind_speed;
        var fIcon = data.daily[day].weather[0].icon;

        //Dynamically create the html that displays the key weather metrics
        var forecastBox = $("<div>").addClass("col-auto mb-3").html("<div class='card bg-dark-blue'><div class='card-body'></div></div>");

        $("<h3>").addClass("card-title").text(fDate).appendTo($(forecastBox).find(".card-body"));
        $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ fIcon +"@2x.png").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Temperature: " + fTemp + " C").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Wind Speed: " + fWindSpeed + " Km/h").appendTo($(forecastBox).find(".card-body"));
        $("<p>").addClass("").text("Humidity: " + fHumidity + " %").appendTo($(forecastBox).find(".card-body"));

        forecastBox.appendTo(futureContainter);
    }

    //Add the 5 day forecast elements to the main container
    futureContainter.appendTo(forecastContainerEl);    
}

//Called when the user clicks the search button
function handleUserSearch(event){
    event.preventDefault();

    //Initialize a variable with the queried city name and then delete from the search box
    var cityName = $("#search-bar").val().trim();
    $("#search-bar").val("");

    //Search the city by the name previously queried
    searchCityByName(cityName);
}

function handleSearchHistory(event){

    //Acquire the city name to search from the list item
    var cityName = $(this).text().trim();

    //Flip the save search switch so that it is not saved into the search history again
    bSaveSearch = false;

    //Search the city by the name previously queried
    searchCityByName(cityName);
}

//Add city to search history
function addCityToHistory(city){

    //If the value was searched save it to the history otherwise do not save it to search history
    if(bSaveSearch){
        $("<button>").addClass("list-group-item list-group-item-action overflow-hidden").text(city).prependTo($("#search-history"));

        //Add the city to our search array to be saved.
        searchHistory.push(city);
        saveHistory();
    }
    
    //Return the switch to true so that new searches will be saved
    bSaveSearch = true;
}

//Draw the search history to the screen
function initCityHistory(cityArray){

    $("#search-history").html("");

    //If the value was searched save it to the history otherwise do not save it to search history
    for(var i = 0; i < cityArray.length; i++){
        $("<button>").addClass("list-group-item list-group-item-action overflow-hidden").text(cityArray[i]).prependTo($("#search-history"));
    }
}

//Change color of the UV
function modifyUVColor(uviContainer, uvIndex){

    //Change the color of the UVI container depending on the UV index value
    if(uvIndex <= 3){
        uviContainer.find("span").addClass("bg-success");
    }
    else if(uvIndex <= 5){
        uviContainer.find("span").addClass("bg-warning");
    }
    else{
        uviContainer.find("span").addClass("bg-danger");
    }
}

//Save the search history
function saveHistory(){
    //Save our search history array to local storage
    localStorage.setItem("history", JSON.stringify(searchHistory));
}

//Load and display prior search history
function loadHistory(){
    //Retrieve our save history from local storage
    var savedHistory = JSON.parse(localStorage.getItem("history"));

    //If there is history set our history array otherwise reset our search array
    if(savedHistory){
        searchHistory = savedHistory;
    }
    else{
        searchHistory = [];
    }

    //Build the search history html for each saved city in the array
    initCityHistory(searchHistory);
}

//resets the search history and clears the on screen history
function resetHistory(event){
    searchHistory = [];
    saveHistory();
    loadHistory();
}

//Take the user city search input and display weather conditions
$("#search-button").on("click", handleUserSearch);

//Open the current and future conditions when clicking on search history
$("#search-history").on("click", "button", handleSearchHistory);

//Resets the user's search history
$("#reset-btn").on("click", resetHistory)

//Disable enter key
$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });

loadHistory();