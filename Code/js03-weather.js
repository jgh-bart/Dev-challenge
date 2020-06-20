var latitude;
var longitude;

//HTML Geolocation API (promise to access)
var geolocationPromise = new Promise(function(resolve, reject) {
	navigator.geolocation.getCurrentPosition(function(position) {
		latitude  = position.coords.latitude;
		longitude = position.coords.longitude;
		resolve();
	}, function(error) {
		console.log(error);
		reject(Error("COORDINATES NOT SET"))
	})
})

geolocationPromise.then(function() {
	setWeather(latitude, longitude);
}, function() {
	// if Geolocation fails, use hard-coded coordinates for London
	setWeather(51.5074, -0.1278);
})

// function to set weather display by accessing OpenWeatherMap API
function setWeather(latitude, longitude) {
	var apiURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d0a10211ea3d36b0a6423a104782130e`;
	$.ajax({
		url: apiURL,
		type: "GET",
		datatype: "json",
		success: function (result) {
			var temp = result.main.temp - 273.15; // Kelvin to Celsius -273.15
			var city = result.name;
			var icon = result.weather[0].icon;
			console.log("TEMP", temp, "CITY", city, "ICON", icon, getIcon(icon));
			// temp and city
			$("#weather-temp").html(temp.toFixed(0)); // temp to 0 decimal places
			$("#weather-city").html(city);
			// weather icon
			var projectIcon = getIcon(icon);
			$("#weather-icon").attr("src",`Assets/${projectIcon}_icon.png`);
			$("#weather-icon").attr("alt", projectIcon);
		},
		error: function (error) {
			console.log(error);
		}
	})
}

// map API icon to one of "Sun", "Clouds", "Rain"
function getIcon(apiIcon) {
	var iconDict = {
		"01d":"Sun", "01n":"Sun", "02d":"Sun", "02n":"Sun", "03d":"Clouds", "03n":"Clouds", "04d":"Clouds", "04n":"Clouds", "50d":"Clouds", "50n":"Clouds", "09d":"Rain", "09n":"Rain", "10d":"Rain", "10n":"Rain", "11d":"Rain", "11n":"Rain", "13d":"Rain", "13n":"Rain"
	};
	if (iconDict.hasOwnProperty(apiIcon)) {
		return iconDict[apiIcon];
	} else {
		throw "Invalid OpenWeatherMap icon";
	}
}