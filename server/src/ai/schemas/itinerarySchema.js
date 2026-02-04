import { z } from "zod";

export const WeatherSchema = z.object({
  conditions: z.string(),
  highTemp: z.number(),
  lowTemp: z.number(),
  rainChance: z.number().optional(),
});

export const DaySchema = z.object({
  day: z.number(),
  date: z.string().optional(),
  weather: WeatherSchema.optional(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  estimatedCost: z.number(),
});

export const ItinerarySchema = z.array(DaySchema);

export const WeatherInputSchema = z.object({
  location: z.string().describe("The city or location to get weather for"),
  date: z.string().describe("The date to get weather for (YYYY-MM-DD format)"),
});

export const AttractionsInputSchema = z.object({
  location: z.string().describe("The city or location to search attractions in"),
  category: z
    .enum(["museums", "restaurants", "outdoor", "nightlife", "shopping", "historical", "entertainment"])
    .describe("The category of attractions to search for"),
  priceLevel: z
    .enum(["budget", "moderate", "expensive"])
    .optional()
    .describe("The price level filter (optional)"),
});

export const CostEstimateInputSchema = z.object({
  location: z.string().describe("The city or location for cost estimation"),
  activityType: z
    .enum(["meal_budget", "meal_moderate", "meal_expensive", "museum_entry", "transport", "nightlife", "shopping", "tour"])
    .describe("The type of activity to estimate cost for"),
  numberOfPeople: z.number().optional().describe("Number of people (defaults to 1)"),
});
