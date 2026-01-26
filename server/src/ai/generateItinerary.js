import OpenAI from "openai";
import { buildPrompt } from "./promptBuilder.js";
import { ItinerarySchema } from "./itineraryValidator.js";

export async function generateItinerary(trip, preferences) {
  // Ensure paid API key is set
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Must use a valid paid API key.",
    );
  }

  const client = new OpenAI({ apiKey });

  // Build the prompt dynamically based on real trip and preferences
  const prompt = buildPrompt(trip, preferences);

  try {
    // Call the paid OpenAI API
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

    // Extract JSON from code blocks if OpenAI includes markdown
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    // Parse JSON and validate with your schema
    const raw = JSON.parse(content);
    return ItinerarySchema.parse(raw);
  } catch (error) {
    console.error("Itinerary generation error:", error.message);
    throw new Error("Failed to generate itinerary using paid OpenAI API");
  }
}
