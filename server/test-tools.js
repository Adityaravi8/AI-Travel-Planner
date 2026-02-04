import "./src/polyfill.js";

async function main() {
  const dotenv = await import("dotenv");
  dotenv.default.config();

  const { weatherTool } = await import("./src/ai/tools/weatherTool.js");
  const { attractionsTool } = await import("./src/ai/tools/attractionsTool.js");
  const { costEstimateTool } = await import("./src/ai/tools/costEstimateTool.js");

  console.log("Testing LangChain Tools...\n");

  console.log("1. Testing Weather Tool:");
  const weather = await weatherTool.invoke({
    location: "Paris",
    date: "2024-06-15",
  });
  console.log(JSON.parse(weather));
  console.log();

  console.log("2. Testing Attractions Tool:");
  const attractions = await attractionsTool.invoke({
    location: "Paris",
    category: "museums",
    priceLevel: "moderate",
  });
  console.log(JSON.parse(attractions));
  console.log();

  console.log("3. Testing Cost Estimate Tool:");
  const cost = await costEstimateTool.invoke({
    location: "Paris",
    activityType: "meal_moderate",
    numberOfPeople: 2,
  });
  console.log(JSON.parse(cost));
  console.log();

  console.log("All tools working correctly!");
}

main().catch(console.error);
