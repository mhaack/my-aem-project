import { readBlockConfig } from '../../scripts/aem.js';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_ICONS = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Foggy
  48: '🌫️', // Depositing rime fog
  51: '🌧️', // Light drizzle
  53: '🌧️', // Moderate drizzle
  55: '🌧️', // Dense drizzle
  61: '🌧️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  71: '🌨️', // Slight snow
  73: '🌨️', // Moderate snow
  75: '🌨️', // Heavy snow
  77: '🌨️', // Snow grains
  80: '🌧️', // Slight rain showers
  81: '🌧️', // Moderate rain showers
  82: '🌧️', // Violent rain showers
  85: '🌨️', // Slight snow showers
  86: '🌨️', // Heavy snow showers
  95: '⛈️', // Thunderstorm
  96: '⛈️', // Thunderstorm with slight hail
  99: '⛈️', // Thunderstorm with heavy hail
};

function createTemperatureGraph(hourlyData) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 200;
  
  const ctx = canvas.getContext('2d');
  const temps = hourlyData.slice(0, 24);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Find min and max temps for scaling
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp;
  
  // Draw graph
  ctx.beginPath();
  ctx.moveTo(0, 200 - ((temps[0] - minTemp) / range * 160 + 20));
  temps.forEach((temp, i) => {
    const x = (i * (600 / 23));
    const y = 200 - ((temp - minTemp) / range * 160 + 20);
    ctx.lineTo(x, y);
  });
  
  // Style the line
  ctx.strokeStyle = '#0066cc';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Add hour labels
  ctx.font = '12px Arial';
  ctx.fillStyle = '#666';
  hours.forEach((hour, i) => {
    if (i % 3 === 0) {
      const x = (i * (600 / 23));
      ctx.fillText(`${hour}:00`, x - 15, 195);
    }
  });
  
  return canvas;
}

async function fetchWeatherData(city) {
  // Get coordinates first
  const geoResponse = await fetch(
    `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1`
  );
  const geoData = await geoResponse.json();
  
  if (!geoData.results?.length) {
    throw new Error('City not found');
  }
  
  const location = geoData.results[0];
  
  // Get weather data
  const weatherResponse = await fetch(
    `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}`
    + '&hourly=temperature_2m,weathercode'
    + '&daily=weathercode,temperature_2m_max,temperature_2m_min'
    + '&timezone=auto'
  );
  
  return weatherResponse.json();
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const city = config.city || 'London';
  
  try {
    const weatherData = await fetchWeatherData(city);
    
    // Create container
    const container = document.createElement('div');
    container.className = 'weather-container';
    
    // Add city name
    const cityTitle = document.createElement('h2');
    cityTitle.textContent = city;
    container.appendChild(cityTitle);
    
    // Add current weather
    const currentWeather = document.createElement('div');
    currentWeather.className = 'weather-current';
    const currentTemp = weatherData.hourly.temperature_2m[0];
    const currentCode = weatherData.hourly.weathercode[0];
    currentWeather.innerHTML = `
      <div class="weather-current-temp">
        ${Math.round(currentTemp)}°${weatherData.hourly_units.temperature_2m}
      </div>
      <div class="weather-current-icon">
        ${WEATHER_ICONS[currentCode] || '🌡️'}
      </div>
    `;
    container.appendChild(currentWeather);
    
    // Add temperature graph for today
    const graphContainer = document.createElement('div');
    graphContainer.className = 'weather-graph';
    graphContainer.appendChild(createTemperatureGraph(weatherData.hourly.temperature_2m));
    container.appendChild(graphContainer);
    
    // Add 5-day forecast table
    const table = document.createElement('table');
    table.className = 'weather-forecast';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Date</th>
          <th>Condition</th>
          <th>Min</th>
          <th>Max</th>
        </tr>
      </thead>
      <tbody>
        ${weatherData.daily.time.slice(0, 5).map((date, i) => `
          <tr>
            <td>${new Date(date).toLocaleDateString()}</td>
            <td class="weather-icon">
              ${WEATHER_ICONS[weatherData.daily.weathercode[i]] || '🌡️'}
            </td>
            <td>${Math.round(weatherData.daily.temperature_2m_min[i])}°${weatherData.daily_units.temperature_2m_min}</td>
            <td>${Math.round(weatherData.daily.temperature_2m_max[i])}°${weatherData.daily_units.temperature_2m_max}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    container.appendChild(table);
    
    // Replace block content
    block.textContent = '';
    block.appendChild(container);
    
  } catch (error) {
    block.innerHTML = `<div class="weather-error">Unable to load weather data for ${city}</div>`;
    console.error('Weather block error:', error);
  }
} 