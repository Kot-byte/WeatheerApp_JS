const apiKey = '3f4db6795f020b17ba1872d2e03f9927';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=ru&q=';
const weatherIcon = document.querySelector('.weather-icon');
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');

const weatherIcons = {
    'Clouds': 'images/clouds.png',
    'Clear': 'images/clear.png',
    'Rain': 'images/rain.png',
    'Drizzle': 'images/drizzle.png',
    'Mist': 'images/mist.png',
    'Snow': 'images/snow.png'
};

async function checkWeather(city) {
    const response = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
        document.querySelector('.forecast').style.display = 'none';
        return;
    }

    const data = await response.json();

    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '&deg;c';
    document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('.wind').innerHTML = data.wind.speed + ' м/с';

    const weatherCondition = data.weather[0].main;
    weatherIcon.src = weatherIcons[weatherCondition] || '';

    document.querySelector('.error').style.display = 'none';
    document.querySelector('.weather').style.display = 'block';

    checkForecast(city);
}

async function checkForecast(city) {
    const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    const forecastElements = document.querySelectorAll('.forecast .day');
    const days = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    days.forEach((day, index) => {
        const forecastElement = forecastElements[index];
        const date = new Date(day.dt_txt).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });

        forecastElement.querySelector('.date').innerHTML = date;
        forecastElement.querySelector('.temp').innerHTML = Math.round(day.main.temp) + '&deg;c';
        forecastElement.querySelector('.forecast-icon').src = weatherIcons[day.weather[0].main] || '';
    });

    document.querySelector('.forecast').style.display = 'block';
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        checkWeather(searchBox.value);
    }
});
