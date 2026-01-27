import OpenAI from "openai";
import { buildPrompt } from "./promptBuilder.js";
import { ItinerarySchema } from "./itineraryValidator.js";

export async function generateItinerary(trip, preferences) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Must use a valid paid API key.",
    );
  }

  const client = new OpenAI({ apiKey });

  const prompt = buildPrompt(trip, preferences);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.4,
    });

    console.log("OpenAI token usage:", response.usage);
    let content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty content");
    }

    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    const raw = JSON.parse(content);
    return ItinerarySchema.parse(raw);
  } catch (error) {
    console.error("Itinerary generation error:", error.message);
    throw new Error("Failed to generate itinerary using paid OpenAI API");
  }
}
