import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  weatherTool,
  attractionsTool,
  costEstimateTool,
  webSearchTool,
} from "../tools/index.js";
import {
  TRAVEL_AGENT_SYSTEM_PROMPT,
  buildTravelAgentPrompt,
} from "./prompts.js";

const tools = [webSearchTool, weatherTool, attractionsTool, costEstimateTool];

export async function createTravelAgent() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Must use a valid paid API key."
    );
  }

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
    openAIApiKey: apiKey,
  });

  const agent = createReactAgent({
    llm: model,
    tools,
    messageModifier: TRAVEL_AGENT_SYSTEM_PROMPT,
  });

  return agent;
}

export async function runTravelAgent(trip, preferences) {
  const agent = await createTravelAgent();
  const userPrompt = buildTravelAgentPrompt(trip, preferences);

  console.log("Starting travel agent for:", trip.destination);
  console.log("User interests:", preferences.map((p) => p.interests).flat());

  const result = await agent.invoke({
    messages: [{ role: "user", content: userPrompt }],
  });

  const messages = result.messages;
  const lastMessage = messages[messages.length - 1];
  const content = lastMessage.content;

  console.log("Agent completed. Processing response...");
  console.log("Response preview:", typeof content === 'string' ? content.substring(0, 500) : JSON.stringify(content).substring(0, 500));

  return content;
}
