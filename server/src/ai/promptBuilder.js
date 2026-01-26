export function buildPrompt(trip, preferences) {
  return `
You are a professional travel planner.

Rules:
- Avoid activities listed as a hard no by any user
- Balance interests fairly across days
- Keep daily costs under ${trip.budgetPerPerson / trip.days}

Trip Info: ${JSON.stringify(trip)}
Preferences: ${JSON.stringify(preferences)}

Return a JSON array of days:
[
  {
    "day": 1,
    "morning": "...",
    "afternoon": "...",
    "evening": "...",
    "estimatedCost": 0
  }
]
`;
}
