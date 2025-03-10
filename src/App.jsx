import React, { useState } from "react";
import axios from "axios";import { TiWeatherPartlySunny } from "react-icons/ti";

import { WiHumidity, WiStrongWind, WiBarometer, WiDayFog, WiDayCloudy, WiDaySunny, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

const API_KEY = "f186f929e2d51dcb3f72e845b74293a3";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      const weatherRes = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      });

      const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      });

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list.slice(0, 5));
      setError(null);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clouds": return <WiDayCloudy size={50} />;
      case "Clear": return <WiDaySunny size={50} />;
      case "Rain": return <WiRain size={50} />;
      case "Snow": return <WiSnow size={50} />;
      case "Thunderstorm": return <WiThunderstorm size={50} />;
      default: return <WiDayFog size={50} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-500 to-blue-400 text-white p-8">
      <div className="flex justify-between gap-4 items-center">
      <TiWeatherPartlySunny  className="text-5xl mb-6 text-green-500"/>
      <h1 className="text-4xl font-extrabold mb-6 tracking-wide"> Weather Explorer</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-lg">
        <input
          type="text"
          className="w-full p-3 rounded-lg text-gray-700 outline-none border bg-gray-300 border-gray-400 shadow-md"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>
      {error && <p className="text-orange-400 font-semibold">{error}</p>}
      {weather && (
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-2">{weather.name}, {weather.sys.country}</h2>
          <p className="text-lg italic text-gray-600 mb-4">{weather.weather[0].description.toUpperCase()}</p>
          <div className="flex justify-center mb-4">{getWeatherIcon(weather.weather[0].main)}</div>
          <p className="text-5xl font-extrabold text-blue-600">{Math.round(weather.main.temp)}°C</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-lg">
            <p className="border p-3 rounded-lg bg-gray-200 flex items-center gap-2"><WiHumidity size={24} /> Humidity: {weather.main.humidity}%</p>
            <p className="border p-3 rounded-lg bg-gray-200 flex items-center gap-2"><WiStrongWind size={24} /> Wind: {weather.wind.speed} m/s</p>
            <p className="border p-3 rounded-lg bg-gray-200 flex items-center gap-2"><WiBarometer size={24} /> Pressure: {weather.main.pressure} hPa</p>
            <p className="border p-3 rounded-lg bg-gray-200 flex items-center gap-2"><WiDayFog size={24} /> Visibility: {weather.visibility / 1000} km</p>
          </div>
        </div>
      )}
      {forecast.length > 0 && (
        <div className="mt-8 bg-white text-gray-900 p-6 rounded-xl shadow-lg w-full max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {forecast.map((day, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-lg text-center flex flex-col items-center">
                <p className="text-lg font-semibold">{new Date(day.dt_txt).toLocaleDateString()}</p>
                <div className="text-blue-500">{getWeatherIcon(day.weather[0].main)}</div>
                <p className="text-xl font-bold text-blue-700">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm text-gray-700">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;