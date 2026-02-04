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

async function fetchWeather(location, date) {
  const apiKey = process.env.WEATHER_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&dt=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        const day = data.forecast.forecastday[0].day;
        return {
          conditions: day.condition.text,
          highTemp: Math.round(day.maxtemp_f),
          lowTemp: Math.round(day.mintemp_f),
          rainChance: day.daily_chance_of_rain,
          recommendation: day.daily_chance_of_rain > 50
            ? "Bring an umbrella and plan indoor activities"
            : day.maxtemp_f > 85
            ? "Stay hydrated and seek shade during midday"
            : "Great weather for outdoor activities",
        };
      }
    } catch (error) {
      console.log("Weather API unavailable, using mock data");
    }
  }

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

  return {
    conditions,
    highTemp,
    lowTemp,
    rainChance,
    recommendation,
  };
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
