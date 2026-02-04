import "./src/polyfill.js";

async function main() {
  const dotenv = await import("dotenv");
  dotenv.default.config();

  const { generateItinerary } = await import("./src/ai/index.js");

  const trip = {
    destination: "Paris",
    startDate: "2024-06-15",
    days: 2,
    budgetPerPerson: 300,
  };

  const preferences = [
    {
      interests: ["food", "culture", "art"],
      activityLevel: "moderate",
      diet: "none",
      hardNo: ["hiking"],
    },
  ];

  console.log("Testing LangChain ReAct Agent...");
  console.log("Trip:", trip);
  console.log("Preferences:", preferences[0]);
  console.log("\nGenerating itinerary (this may take a moment)...\n");

  try {
    const itinerary = await generateItinerary(trip, preferences);
    console.log("Generated Itinerary:");
    console.log(JSON.stringify(itinerary, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
