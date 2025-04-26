 // API details
const apiKey = '219e6d1471ef449b87c170656252102';
const apiUrl = 'http://api.weatherapi.com/v1/current.json';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const favoritesList = document.getElementById('favoritesList');

// Array to store favorite cities
let favorites = [];

// Initialize the app
function init() {
    // Load favorites from localStorage
    loadFavorites();
    
    // Add event listeners
    searchBtn.addEventListener('click', searchWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    // Display favorites list
    renderFavorites();
}

// Load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

// Add city to favorites
function addToFavorites(city) {
    // Check if city already exists in favorites
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveFavorites();
        renderFavorites();
    }
}

// Remove city from favorites
function removeFromFavorites(city) {
    const index = favorites.indexOf(city);
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites();
        renderFavorites();
    }
}

// Render favorites list
function renderFavorites() {
    favoritesList.innerHTML = '';
    
    favorites.forEach(city => {
        const li = document.createElement('li');
        
        // Create city name element
        const cityName = document.createElement('span');
        cityName.textContent = city;
        cityName.classList.add('city-name');
        cityName.addEventListener('click', () => {
            fetchWeather(city);
        });
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromFavorites(city);
        });
        
        li.appendChild(cityName);
        li.appendChild(removeBtn);
        favoritesList.appendChild(li);
    });
}

// Search for weather
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
}

// Fetch weather data from API
function fetchWeather(city) {
    // Show loading message
    weatherDisplay.innerHTML = '<p>Loading weather data...</p>';
    
    // Build the API URL
    const url = `${apiUrl}?key=${apiKey}&q=${city}&aqi=no`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            
            // Update input field with the current city
            cityInput.value = city;
            
            // Add button to add to favorites if not already in favorites
            if (!favorites.includes(city)) {
                const favoriteBtn = document.createElement('button');
                favoriteBtn.textContent = 'Add to Favorites';
                favoriteBtn.classList.add('favorite-btn');
                favoriteBtn.addEventListener('click', () => {
                    addToFavorites(city);
                });
                weatherDisplay.appendChild(favoriteBtn);
            }
        })
        .catch(error => {
            weatherDisplay.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Display weather data
function displayWeather(data) {
    const location = data.location;
    const current = data.current;
    
    const weatherHTML = `
        <h2>${location.name}, ${location.country}</h2>
        <div class="weather-info">
            <div class="weather-main">
                <img src="${current.condition.icon}" alt="${current.condition.text}">
                <p class="condition">${current.condition.text}</p>
            </div>
            <div class="weather-details">
                <p class="temp">${current.temp_c}°C / ${current.temp_f}°F</p>
                <p>Feels like: ${current.feelslike_c}°C / ${current.feelslike_f}°F</p>
                <p>Humidity: ${current.humidity}%</p>
                <p>Wind: ${current.wind_kph} km/h, ${current.wind_dir}</p>
            </div>
        </div>
        <p class="updated">Last updated: ${current.last_updated}</p>
    `;
    
    weatherDisplay.innerHTML = weatherHTML;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
