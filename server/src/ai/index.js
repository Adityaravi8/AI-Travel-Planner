import { runTravelAgent } from "./agent/travelAgent.js";
import { ItinerarySchema } from "./schemas/itinerarySchema.js";

async function fetchWeatherForDate(location, date) {
  const apiKey = process.env.WEATHER_API_KEY;

  if (apiKey) {
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&dt=${date}`;
      console.log("Fetching weather from:", url.replace(apiKey, "***"));

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const day = data.forecast?.forecastday?.[0]?.day;
        if (day) {
          return {
            conditions: day.condition?.text || "Clear",
            highTemp: Math.round(day.maxtemp_f),
            lowTemp: Math.round(day.mintemp_f),
            rainChance: day.daily_chance_of_rain || 0,
          };
        }
      } else {
        console.log("Weather API error:", response.status, await response.text());
      }
    } catch (error) {
      console.log("Weather fetch failed:", error.message);
    }
  }

  console.log("Using fallback weather for", location);
  return {
    conditions: "Partly Cloudy",
    highTemp: 75,
    lowTemp: 58,
    rainChance: 20,
  };
}

export async function generateItinerary(trip, preferences) {
  try {
    console.log("=== GENERATING ITINERARY ===");
    console.log("Trip:", trip.destination, "for", trip.days, "days");
    console.log("Start date:", trip.startDate);

    const agentResponse = await runTravelAgent(trip, preferences);

    let content = agentResponse;

    if (Array.isArray(content)) {
      content = content.map((c) => (typeof c === "object" ? c.text || JSON.stringify(c) : c)).join("");
    }

    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      content = arrayMatch[0];
    }

    const raw = JSON.parse(content);
    console.log("Parsed", raw.length, "days from AI response");

    const startDate = new Date(trip.startDate);
    const dates = [];
    for (let i = 0; i < trip.days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    console.log("Trip dates:", dates);

    const enrichedItinerary = await Promise.all(
      raw.map(async (day, index) => {
        const date = dates[index] || day.date;
        console.log(`Processing day ${day.day}, date: ${date}`);

        const weather = day.weather || await fetchWeatherForDate(trip.destination, date);
        console.log(`Day ${day.day} weather:`, weather);

        return {
          ...day,
          date,
          weather,
        };
      })
    );

    const validated = ItinerarySchema.parse(enrichedItinerary);
    console.log("=== ITINERARY COMPLETE ===");
    console.log("First day:", JSON.stringify(validated[0], null, 2));

    return validated;
  } catch (error) {
    console.error("Itinerary generation error:", error.message);
    console.error(error.stack);

    if (error.message.includes("API key")) {
      throw new Error("OpenAI API key is invalid or not configured");
    }
    if (error.message.includes("JSON")) {
      throw new Error("Failed to parse itinerary response from AI agent");
    }
    if (error.name === "ZodError") {
      throw new Error("AI agent returned invalid itinerary format");
    }

    throw new Error("Failed to generate itinerary: " + error.message);
  }
}
