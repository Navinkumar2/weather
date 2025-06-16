import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin, FiWind, FiSun, FiCloud } from "react-icons/fi";

const API_KEY = "7ac468be1e0bced04b854fe977c51ec2";

const getAQIDescription = (aqi) => {
  const levels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const colors = [
    "",
    "bg-green-500",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-red-500",
    "bg-purple-700",
  ];
  return { label: levels[aqi], color: colors[aqi] };
};

const Dashboard = ({ darkMode }) => {
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [city, setCity] = useState("Chennai");
  const [input, setInput] = useState("");

  useEffect(() => {
    getCityData(city);
  }, [city]);

  const getCityData = async (cityName) => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const { coord } = weatherRes.data;
      setWeather(weatherRes.data);

      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
      );
      setAqi(aqiRes.data.list[0]);
    } catch (err) {
      alert("City not found. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setCity(input);
      setInput("");
    }
  };

  const aqiInfo = aqi ? getAQIDescription(aqi.main.aqi) : null;

  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-3xl shadow-xl space-y-4 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white/10 backdrop-blur-md text-white"
      }`}
    >
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city..."
          className={`w-full p-3 rounded-xl border-none focus:outline-none ${
            darkMode
              ? "bg-gray-700 placeholder-gray-300 text-white"
              : "bg-white/20 placeholder-white text-white"
          }`}
        />
      </form>
      {weather && (
        <div className="space-y-3">
          <h2 className="text-3xl font-bold flex items-center">
            <FiMapPin className="mr-2" /> {weather.name}
          </h2>
          <div className="text-lg flex items-center gap-2">
            <FiSun /> Temp: {weather.main.temp}°C
          </div>
          <div className="text-lg flex items-center gap-2">
            <FiWind /> Wind: {weather.wind.speed} m/s
          </div>
          <div className="text-lg flex items-center gap-2">
            <FiCloud /> {weather.weather[0].description}
          </div>
        </div>
      )}
      {aqi && (
        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-xl">Air Quality Index</h3>
          <p
            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${aqiInfo.color}`}
          >
            {aqiInfo.label} (AQI: {aqi.main.aqi})
          </p>
          <p className="text-sm opacity-80">CO: {aqi.components.co} μg/m³</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
