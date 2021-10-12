let apiKey = "73ec3c14d0ddba3c07e64b0cf4a26c48";
let selectedCity = document.querySelector("input");
let searchButton = document.querySelector("button");
let body = document.querySelector("body");
let city = "";
let mainCity = document.getElementById("main-title");
let mainTemp = document.getElementById("main-temp");
let mainLowTemp = document.getElementById("main-low-temp");
let mainWind = document.getElementById("main-wind");
let mainHumidity = document.getElementById("main-humidity");
let mainUV = document.getElementById("main-uv");

let displayData = function (cityData) {
    // display todays data differently then the rest
    // Get the correctly formatted date
    let d = new Date(cityData[0].dt * 1000);
    let formatedDate =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

    let iconEl = document.createElement("img");

    // Modify Elements
    iconEl.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${cityData[0].weather[0].icon}@2x.png`
    );
    mainCity.textContent = city + "(" + formatedDate + ")";
    mainTemp.textContent = "Min Temp: " + cityData[0].temp.min + "°F";
    mainLowTemp.textContent = "Max Temp: " + cityData[0].temp.max + "°F";
    mainWind.textContent = "Wind: " + cityData[0].wind_speed + " MPH";
    mainHumidity.textContent = "Humidity: " + cityData[0].humidity + "%";
    mainUV.textContent = "UV Index: " + cityData[0].uvi;

    mainCity.appendChild(iconEl);

    // Loop through data to create cards for 5 days except the current day
    for (let i = 1; i < 6; i++) {
        // Get the correctly formatted date
        let d = new Date(cityData[i].dt * 1000);
        let formatedDate =
            d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

        // Create Elements
        let containerEl = document.createElement("div");
        let dateEl = document.createElement("h1");
        let iconEl = document.createElement("img");
        let tempMinEl = document.createElement("p");
        let tempMaxEl = document.createElement("p");
        let windEl = document.createElement("p");
        let humidityEl = document.createElement("p");
        let uvEl = document.createElement("p");

        // Modify Elements
        iconEl.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${cityData[i].weather[0].icon}@2x.png`
        );
        dateEl.textContent = formatedDate;
        tempMinEl.textContent = "Min Temp: " + cityData[i].temp.min + "°F";
        tempMaxEl.textContent = "Max Temp: " + cityData[i].temp.max + "°F";
        windEl.textContent = "Wind: " + cityData[i].wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + cityData[i].humidity + "%";
        uvEl.textContent = "UV Index: " + cityData[i].uvi;
        // adding a class so I can clear them out on function call if they exist
        containerEl.setAttribute("class", "remove");

        // Append Elements
        containerEl.appendChild(dateEl);
        containerEl.appendChild(iconEl);
        containerEl.appendChild(tempMinEl);
        containerEl.appendChild(tempMaxEl);
        containerEl.appendChild(windEl);
        containerEl.appendChild(humidityEl);
        containerEl.appendChild(uvEl);
        body.appendChild(containerEl);
    }
};

// Gets the 5 day weather forecast + current day`s weather
let oneCall = function (latitude, longitude) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
    )
        .then((response) => response.json())
        .then((data) => {
            displayData(data.daily);
        });
};

// Gets the Lat and Long of the selected city and passes it to oneCall()
let getLatAndLonCall = function (event) {
    event.preventDefault();
    let cityName = selectedCity.value;
    city = cityName;
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    )
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    let clearPrevData = document.getElementsByClassName("remove");
                    if (clearPrevData.length > 0) {
                        for (let i = 0; i < clearPrevData.length; i++) {
                            clearPrevData[i].innerHTML = "";
                        }
                    }
                    let latitude = data.coord.lat;
                    let longitude = data.coord.lon;
                    oneCall(latitude, longitude);
                });
            } else {
                alert(
                    "Error: Please ensure your spelling is correct or select another city"
                );
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

// Initiates the weather search
if (searchButton) {
    searchButton.addEventListener("click", getLatAndLonCall);
}

