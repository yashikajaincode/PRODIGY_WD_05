// script.js
const fetchWeatherBtn = document.getElementById('fetch-weather-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const locationInput = document.getElementById('location-input');
const weatherInfo = document.getElementById('weather-info');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const conditions = document.getElementById('conditions');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const errorMessage = document.getElementById('error-message');

const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; 

fetchWeatherBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherData(location);
    } else {
        showError('Please enter a location.');
    }
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(null, latitude, longitude);
        }, () => {
            showError('Unable to retrieve your location.');
        });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});

async function fetchWeatherData(location, lat = null, lon = null) {
    let url = '';
    if (location) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    } else if (lat !== null && lon !== null) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeatherData(data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
    }
}

function displayWeatherData(data) {
    locationName.textContent = data.name;
    temperature.textContent = data.main.temp;
    conditions.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;

    weatherInfo.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}
