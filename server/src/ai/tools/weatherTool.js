import { tool } from "@langchain/core/tools";
import { WeatherInputSchema } from "../schemas/itinerarySchema.js";

const weatherPatterns = {
  tropical: { temp: [75, 90], conditions: ["Sunny", "Partly Cloudy", "Scattered Showers"], rainChance: 40 },
  mediterranean: { temp: [60, 85], conditions: ["Sunny", "Clear", "Warm"], rainChance: 15 },
  temperate: { temp: [45, 75], conditions: ["Partly Cloudy", "Mild", "Variable"], rainChance: 30 },
  continental: { temp: [30, 80], conditions: ["Variable", "Clear", "Cloudy"], rainChance: 25 },
  desert: { temp: [65, 105], conditions: ["Hot", "Sunny", "Dry"], rainChance: 5 },
  polar: { temp: [10, 45], conditions: ["Cold", "Overcast", "Snowy"], rainChance: 35 },
};

const locationClimate = {
  tokyo: "temperate",
  bangkok: "tropical",
  singapore: "tropical",
  dubai: "desert",
  mumbai: "tropical",
  beijing: "continental",
  paris: "temperate",
  london: "temperate",
  rome: "mediterranean",
  barcelona: "mediterranean",
  amsterdam: "temperate",
  berlin: "continental",
  athens: "mediterranean",
  "new york": "continental",
  "los angeles": "mediterranean",
  miami: "tropical",
  "mexico city": "temperate",
  "rio de janeiro": "tropical",
  vancouver: "temperate",
  sydney: "temperate",
  auckland: "temperate",
  cairo: "desert",
  "cape town": "mediterranean",
  marrakech: "desert",
};

function getClimateZone(location) {
  const normalized = location.toLowerCase();
  for (const [city, zone] of Object.entries(locationClimate)) {
    if (normalized.includes(city)) return zone;
  }
  return "temperate";
}

function getSeasonMultiplier(date) {
  const month = new Date(date).getMonth();
  if (month >= 5 && month <= 8) return { temp: 1.1, rain: 0.8 };
  if (month >= 11 || month <= 1) return { temp: 0.7, rain: 1.2 };
  return { temp: 1.0, rain: 1.0 };
}

// WMO Weather interpretation codes
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

async function getCoordinates(location) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return { lat: data.results[0].latitude, lon: data.results[0].longitude };
      }
    }
  } catch (error) {
    console.log("Geocoding failed:", error.message);
  }
  return null;
}

function getMockWeather(location, date) {
  const climate = getClimateZone(location);
  const pattern = weatherPatterns[climate];
  const season = getSeasonMultiplier(date);

  const baseTemp = (pattern.temp[0] + pattern.temp[1]) / 2;
  const tempRange = pattern.temp[1] - pattern.temp[0];
  const highTemp = Math.round((baseTemp + tempRange * 0.3) * season.temp);
  const lowTemp = Math.round((baseTemp - tempRange * 0.3) * season.temp);
  const rainChance = Math.round(pattern.rainChance * season.rain);
  const conditions = pattern.conditions[Math.floor(Math.random() * pattern.conditions.length)];

  let recommendation;
  if (rainChance > 50) {
    recommendation = "Bring an umbrella and plan some indoor activities as backup";
  } else if (highTemp > 85) {
    recommendation = "Hot weather expected - stay hydrated and plan outdoor activities for morning/evening";
  } else if (lowTemp < 40) {
    recommendation = "Cold weather expected - pack warm layers and consider indoor activities";
  } else {
    recommendation = "Pleasant weather expected - great for outdoor sightseeing";
  }

  return { conditions, highTemp, lowTemp, rainChance, recommendation };
}

async function fetchWeather(location, date) {
  try {
    const coords = await getCoordinates(location);
    if (!coords) {
      console.log("Could not geocode location, using mock data");
      return getMockWeather(location, date);
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&start_date=${date}&end_date=${date}`
    );

    if (response.ok) {
      const data = await response.json();
      const daily = data.daily;

      if (daily && daily.time && daily.time.length > 0) {
        const weatherCode = daily.weather_code[0];
        const conditions = weatherCodes[weatherCode] || "Variable";
        const highTemp = Math.round(daily.temperature_2m_max[0]);
        const lowTemp = Math.round(daily.temperature_2m_min[0]);
        const rainChance = daily.precipitation_probability_max[0] || 0;

        return {
          conditions,
          highTemp,
          lowTemp,
          rainChance,
          recommendation: rainChance > 50
            ? "Bring an umbrella and plan indoor activities"
            : highTemp > 85
            ? "Stay hydrated and seek shade during midday"
            : "Great weather for outdoor activities",
        };
      }
    } else {
      console.log("Open-Meteo API error:", response.status);
    }
  } catch (error) {
    console.log("Weather API unavailable, using mock data:", error.message);
  }

  return getMockWeather(location, date);
}

export const weatherTool = tool(
  async ({ location, date }) => {
    const weather = await fetchWeather(location, date);
    return JSON.stringify({
      location,
      date,
      ...weather,
    });
  },
  {
    name: "get_weather",
    description:
      "Get weather forecast for a specific location and date. Returns temperature, conditions, rain chance, and activity recommendations.",
    schema: WeatherInputSchema,
  }
);
