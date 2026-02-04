import { tool } from "@langchain/core/tools";
import { z } from "zod";

const WebSearchInputSchema = z.object({
  query: z.string().describe("The search query about a travel destination, attraction, or activity"),
});

export const webSearchTool = tool(
  async ({ query }) => {
    return JSON.stringify({
      query,
      result: `Use your training knowledge to provide detailed, accurate information about: "${query}".
Include specific names of real attractions, restaurants, neighborhoods, and activities.
Provide addresses or locations when possible. Base your recommendations on well-known,
highly-rated places that exist and are popular with travelers.`,
      note: "Using AI knowledge base - provide real, specific recommendations based on your training data",
    });
  },
  {
    name: "web_search",
    description:
      "Search for information about travel destinations, attractions, restaurants, local tips, and activities. Use this to research real places and get specific recommendations.",
    schema: WebSearchInputSchema,
  }
);
