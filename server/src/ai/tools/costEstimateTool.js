import { tool } from "@langchain/core/tools";
import { CostEstimateInputSchema } from "../schemas/itinerarySchema.js";

const regionalMultipliers = {
  switzerland: 1.8,
  norway: 1.7,
  iceland: 1.6,
  denmark: 1.5,
  singapore: 1.4,
  "hong kong": 1.4,
  japan: 1.2,
  australia: 1.2,
  uk: 1.15,
  france: 1.1,
  germany: 1.05,
  netherlands: 1.1,
  italy: 1.0,
  usa: 1.0,
  canada: 0.95,
  spain: 0.85,
  portugal: 0.8,
  greece: 0.75,
  "south korea": 0.9,
  taiwan: 0.7,
  mexico: 0.5,
  thailand: 0.4,
  vietnam: 0.35,
  indonesia: 0.4,
  india: 0.3,
  morocco: 0.45,
  turkey: 0.5,
  poland: 0.55,
  "czech republic": 0.6,
  hungary: 0.5,
  brazil: 0.55,
  argentina: 0.45,
  colombia: 0.4,
  peru: 0.4,
};

const cityMultipliers = {
  "new york": 1.3,
  "san francisco": 1.25,
  london: 1.25,
  paris: 1.2,
  tokyo: 1.15,
  sydney: 1.2,
  dubai: 1.3,
  zurich: 1.4,
  geneva: 1.35,
  monaco: 1.5,
  venice: 1.15,
  amsterdam: 1.1,
  copenhagen: 1.2,
  stockholm: 1.15,
  oslo: 1.25,
  "los angeles": 1.1,
  miami: 1.05,
  chicago: 1.0,
  bangkok: 0.9,
  "ho chi minh": 0.85,
  bali: 0.95,
  "mexico city": 0.9,
  prague: 0.95,
  budapest: 0.9,
  barcelona: 1.05,
  rome: 1.05,
  berlin: 0.95,
};

const baseCosts = {
  meal_budget: 15,
  meal_moderate: 35,
  meal_expensive: 100,
  museum_entry: 20,
  transport: 15,
  nightlife: 50,
  shopping: 75,
  tour: 60,
};

function getMultiplier(location) {
  const normalized = location.toLowerCase();

  for (const [city, mult] of Object.entries(cityMultipliers)) {
    if (normalized.includes(city)) {
      let countryMult = 1.0;
      for (const [country, cMult] of Object.entries(regionalMultipliers)) {
        if (normalized.includes(country)) {
          countryMult = cMult;
          break;
        }
      }
      return countryMult * mult;
    }
  }

  for (const [region, mult] of Object.entries(regionalMultipliers)) {
    if (normalized.includes(region)) {
      return mult;
    }
  }

  return 1.0;
}

function estimateCost(location, activityType, numberOfPeople = 1) {
  const baseCost = baseCosts[activityType] || 30;
  const multiplier = getMultiplier(location);
  const estimatedCost = Math.round(baseCost * multiplier * numberOfPeople);

  const lowEstimate = Math.round(estimatedCost * 0.7);
  const highEstimate = Math.round(estimatedCost * 1.4);

  return {
    estimatedCost,
    range: { low: lowEstimate, high: highEstimate },
    currency: "USD",
    perPerson: Math.round(estimatedCost / numberOfPeople),
    note: getActivityNote(activityType, location),
  };
}

function getActivityNote(activityType, location) {
  const notes = {
    meal_budget: "Street food, fast food, or casual dining",
    meal_moderate: "Sit-down restaurant with table service",
    meal_expensive: "Upscale restaurant, may need reservations",
    museum_entry: "General admission, special exhibits may cost extra",
    transport: "Daily pass or typical transit costs",
    nightlife: "Cover charges, drinks, and entertainment",
    shopping: "Souvenirs and typical tourist shopping",
    tour: "Group tour price, private tours cost more",
  };
  return notes[activityType] || "Estimated activity cost";
}

export const costEstimateTool = tool(
  async ({ location, activityType, numberOfPeople }) => {
    const estimate = estimateCost(location, activityType, numberOfPeople || 1);
    return JSON.stringify({
      location,
      activityType,
      numberOfPeople: numberOfPeople || 1,
      ...estimate,
    });
  },
  {
    name: "estimate_cost",
    description:
      "Estimate the cost of an activity in a specific location. Returns cost in USD with a range estimate.",
    schema: CostEstimateInputSchema,
  }
);
