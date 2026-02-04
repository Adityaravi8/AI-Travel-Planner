import { tool } from "@langchain/core/tools";
import { AttractionsInputSchema } from "../schemas/itinerarySchema.js";

const attractionsDatabase = {
  paris: {
    museums: [
      { name: "Louvre Museum", rating: 4.8, address: "Rue de Rivoli, 75001", priceLevel: "moderate", description: "World's largest art museum" },
      { name: "Musée d'Orsay", rating: 4.7, address: "1 Rue de la Légion d'Honneur", priceLevel: "moderate", description: "Impressionist masterpieces" },
      { name: "Centre Pompidou", rating: 4.5, address: "Place Georges-Pompidou", priceLevel: "moderate", description: "Modern art museum" },
      { name: "Rodin Museum", rating: 4.6, address: "77 Rue de Varenne", priceLevel: "budget", description: "Sculpture garden and museum" },
      { name: "Musée de l'Orangerie", rating: 4.6, address: "Jardin Tuileries", priceLevel: "budget", description: "Monet's Water Lilies" },
    ],
    restaurants: [
      { name: "Le Comptoir du Panthéon", rating: 4.5, address: "5 Rue Soufflot", priceLevel: "moderate", description: "Classic French bistro" },
      { name: "Bouillon Chartier", rating: 4.3, address: "7 Rue du Faubourg Montmartre", priceLevel: "budget", description: "Historic Parisian restaurant" },
      { name: "Le Jules Verne", rating: 4.7, address: "Eiffel Tower", priceLevel: "expensive", description: "Fine dining with views" },
      { name: "Pink Mamma", rating: 4.4, address: "20bis Rue de Douai", priceLevel: "moderate", description: "Trendy Italian" },
      { name: "L'As du Fallafel", rating: 4.6, address: "34 Rue des Rosiers", priceLevel: "budget", description: "Famous falafel spot" },
    ],
    outdoor: [
      { name: "Eiffel Tower", rating: 4.7, address: "Champ de Mars", priceLevel: "moderate", description: "Iconic landmark" },
      { name: "Luxembourg Gardens", rating: 4.8, address: "6th arrondissement", priceLevel: "budget", description: "Beautiful park" },
      { name: "Seine River Cruise", rating: 4.5, address: "Various departure points", priceLevel: "moderate", description: "Scenic boat tour" },
      { name: "Montmartre Walk", rating: 4.6, address: "18th arrondissement", priceLevel: "budget", description: "Artistic neighborhood" },
      { name: "Tuileries Garden", rating: 4.5, address: "Place de la Concorde", priceLevel: "budget", description: "Historic garden" },
    ],
    nightlife: [
      { name: "Le Caveau de la Huchette", rating: 4.5, address: "5 Rue de la Huchette", priceLevel: "moderate", description: "Historic jazz club" },
      { name: "Moulin Rouge", rating: 4.4, address: "82 Boulevard de Clichy", priceLevel: "expensive", description: "Famous cabaret" },
      { name: "Harry's New York Bar", rating: 4.3, address: "5 Rue Daunou", priceLevel: "moderate", description: "Classic cocktail bar" },
      { name: "Le Baron", rating: 4.2, address: "6 Avenue Marceau", priceLevel: "expensive", description: "Trendy nightclub" },
      { name: "Café de Flore", rating: 4.4, address: "172 Boulevard Saint-Germain", priceLevel: "moderate", description: "Iconic café" },
    ],
    shopping: [
      { name: "Galeries Lafayette", rating: 4.5, address: "40 Boulevard Haussmann", priceLevel: "expensive", description: "Luxury department store" },
      { name: "Le Marais Boutiques", rating: 4.6, address: "Le Marais district", priceLevel: "moderate", description: "Trendy shopping area" },
      { name: "Merci Concept Store", rating: 4.4, address: "111 Boulevard Beaumarchais", priceLevel: "moderate", description: "Unique lifestyle store" },
    ],
    historical: [
      { name: "Notre-Dame Cathedral", rating: 4.8, address: "6 Parvis Notre-Dame", priceLevel: "budget", description: "Gothic masterpiece" },
      { name: "Arc de Triomphe", rating: 4.6, address: "Place Charles de Gaulle", priceLevel: "moderate", description: "Historic monument" },
      { name: "Palace of Versailles", rating: 4.7, address: "Versailles", priceLevel: "moderate", description: "Royal palace" },
    ],
    entertainment: [
      { name: "Palais Garnier Opera", rating: 4.7, address: "Place de l'Opéra", priceLevel: "expensive", description: "Historic opera house" },
      { name: "Disneyland Paris", rating: 4.4, address: "Marne-la-Vallée", priceLevel: "expensive", description: "Theme park" },
    ],
  },
  tokyo: {
    museums: [
      { name: "TeamLab Borderless", rating: 4.8, address: "Odaiba", priceLevel: "moderate", description: "Digital art museum" },
      { name: "Tokyo National Museum", rating: 4.6, address: "Ueno Park", priceLevel: "budget", description: "Japanese art and history" },
      { name: "Ghibli Museum", rating: 4.9, address: "Mitaka", priceLevel: "moderate", description: "Studio Ghibli animation" },
      { name: "Mori Art Museum", rating: 4.5, address: "Roppongi Hills", priceLevel: "moderate", description: "Contemporary art" },
      { name: "Edo-Tokyo Museum", rating: 4.5, address: "Ryogoku", priceLevel: "budget", description: "Tokyo history" },
    ],
    restaurants: [
      { name: "Ichiran Ramen", rating: 4.6, address: "Various locations", priceLevel: "budget", description: "Solo ramen booths" },
      { name: "Sukiyabashi Jiro", rating: 4.9, address: "Ginza", priceLevel: "expensive", description: "Legendary sushi" },
      { name: "Gonpachi", rating: 4.4, address: "Nishi-Azabu", priceLevel: "moderate", description: "Kill Bill restaurant" },
      { name: "Tsukiji Outer Market", rating: 4.5, address: "Tsukiji", priceLevel: "budget", description: "Fresh seafood stalls" },
      { name: "Robot Restaurant", rating: 4.2, address: "Shinjuku", priceLevel: "expensive", description: "Wild entertainment dining" },
    ],
    outdoor: [
      { name: "Senso-ji Temple", rating: 4.7, address: "Asakusa", priceLevel: "budget", description: "Ancient Buddhist temple" },
      { name: "Meiji Shrine", rating: 4.7, address: "Shibuya", priceLevel: "budget", description: "Peaceful forest shrine" },
      { name: "Ueno Park", rating: 4.5, address: "Ueno", priceLevel: "budget", description: "Large park with temples" },
      { name: "Shinjuku Gyoen", rating: 4.6, address: "Shinjuku", priceLevel: "budget", description: "Beautiful gardens" },
      { name: "Tokyo Skytree", rating: 4.5, address: "Sumida", priceLevel: "moderate", description: "Observation tower" },
    ],
    nightlife: [
      { name: "Golden Gai", rating: 4.6, address: "Shinjuku", priceLevel: "moderate", description: "Tiny bar district" },
      { name: "Shibuya Crossing", rating: 4.5, address: "Shibuya", priceLevel: "budget", description: "Iconic intersection" },
      { name: "Roppongi District", rating: 4.3, address: "Roppongi", priceLevel: "expensive", description: "Club district" },
      { name: "Omoide Yokocho", rating: 4.4, address: "Shinjuku", priceLevel: "budget", description: "Nostalgic alley bars" },
    ],
    shopping: [
      { name: "Harajuku", rating: 4.6, address: "Harajuku", priceLevel: "moderate", description: "Youth fashion district" },
      { name: "Akihabara", rating: 4.5, address: "Akihabara", priceLevel: "moderate", description: "Electronics and anime" },
      { name: "Ginza", rating: 4.4, address: "Ginza", priceLevel: "expensive", description: "Luxury shopping" },
    ],
    historical: [
      { name: "Imperial Palace", rating: 4.5, address: "Chiyoda", priceLevel: "budget", description: "Emperor's residence" },
      { name: "Nezu Shrine", rating: 4.6, address: "Bunkyo", priceLevel: "budget", description: "Beautiful shrine" },
    ],
    entertainment: [
      { name: "Tokyo DisneySea", rating: 4.8, address: "Urayasu", priceLevel: "expensive", description: "Unique Disney park" },
      { name: "Kabuki-za Theatre", rating: 4.6, address: "Ginza", priceLevel: "expensive", description: "Traditional theater" },
    ],
  },
  "new york": {
    museums: [
      { name: "Metropolitan Museum of Art", rating: 4.8, address: "1000 5th Ave", priceLevel: "moderate", description: "World-class art" },
      { name: "MoMA", rating: 4.7, address: "11 W 53rd St", priceLevel: "moderate", description: "Modern art" },
      { name: "Natural History Museum", rating: 4.7, address: "Central Park West", priceLevel: "moderate", description: "Natural history" },
      { name: "Guggenheim Museum", rating: 4.5, address: "1071 5th Ave", priceLevel: "moderate", description: "Iconic spiral building" },
      { name: "Whitney Museum", rating: 4.5, address: "99 Gansevoort St", priceLevel: "moderate", description: "American art" },
    ],
    restaurants: [
      { name: "Katz's Delicatessen", rating: 4.5, address: "205 E Houston St", priceLevel: "moderate", description: "Iconic deli" },
      { name: "Joe's Pizza", rating: 4.6, address: "7 Carmine St", priceLevel: "budget", description: "Classic NY slice" },
      { name: "Le Bernardin", rating: 4.8, address: "155 W 51st St", priceLevel: "expensive", description: "Seafood fine dining" },
      { name: "Shake Shack", rating: 4.4, address: "Madison Square Park", priceLevel: "budget", description: "Famous burgers" },
      { name: "Peter Luger", rating: 4.6, address: "178 Broadway, Brooklyn", priceLevel: "expensive", description: "Legendary steakhouse" },
    ],
    outdoor: [
      { name: "Central Park", rating: 4.8, address: "Manhattan", priceLevel: "budget", description: "Iconic urban park" },
      { name: "High Line", rating: 4.7, address: "Meatpacking District", priceLevel: "budget", description: "Elevated park" },
      { name: "Brooklyn Bridge Walk", rating: 4.7, address: "Brooklyn Bridge", priceLevel: "budget", description: "Scenic walk" },
      { name: "Statue of Liberty", rating: 4.6, address: "Liberty Island", priceLevel: "moderate", description: "American icon" },
      { name: "Times Square", rating: 4.3, address: "Midtown Manhattan", priceLevel: "budget", description: "Bright lights" },
    ],
    nightlife: [
      { name: "Jazz at Lincoln Center", rating: 4.7, address: "10 Columbus Circle", priceLevel: "expensive", description: "World-class jazz" },
      { name: "The Comedy Cellar", rating: 4.6, address: "117 MacDougal St", priceLevel: "moderate", description: "Famous comedy club" },
      { name: "Rooftop bars in Midtown", rating: 4.4, address: "Various locations", priceLevel: "expensive", description: "Skyline views" },
      { name: "Brooklyn nightlife", rating: 4.5, address: "Williamsburg", priceLevel: "moderate", description: "Hip bars and clubs" },
    ],
    shopping: [
      { name: "Fifth Avenue", rating: 4.5, address: "5th Avenue", priceLevel: "expensive", description: "Luxury shopping" },
      { name: "SoHo", rating: 4.6, address: "SoHo district", priceLevel: "expensive", description: "Trendy boutiques" },
      { name: "Chelsea Market", rating: 4.5, address: "75 9th Ave", priceLevel: "moderate", description: "Food and shopping" },
    ],
    historical: [
      { name: "9/11 Memorial", rating: 4.8, address: "180 Greenwich St", priceLevel: "budget", description: "Moving tribute" },
      { name: "Ellis Island", rating: 4.6, address: "Ellis Island", priceLevel: "moderate", description: "Immigration museum" },
      { name: "Grand Central Terminal", rating: 4.7, address: "89 E 42nd St", priceLevel: "budget", description: "Beaux-Arts landmark" },
    ],
    entertainment: [
      { name: "Broadway Show", rating: 4.8, address: "Theater District", priceLevel: "expensive", description: "World-famous theater" },
      { name: "Radio City Music Hall", rating: 4.6, address: "1260 6th Ave", priceLevel: "expensive", description: "Art Deco venue" },
    ],
  },
};

const defaultAttractions = {
  museums: [
    { name: "Local Art Museum", rating: 4.3, address: "City Center", priceLevel: "moderate", description: "Regional art collection" },
    { name: "History Museum", rating: 4.2, address: "Downtown", priceLevel: "budget", description: "Local history exhibits" },
  ],
  restaurants: [
    { name: "Local Cuisine Restaurant", rating: 4.4, address: "City Center", priceLevel: "moderate", description: "Regional specialties" },
    { name: "Street Food Market", rating: 4.3, address: "Market District", priceLevel: "budget", description: "Local food vendors" },
  ],
  outdoor: [
    { name: "City Park", rating: 4.3, address: "City Center", priceLevel: "budget", description: "Main urban park" },
    { name: "Walking Tour", rating: 4.4, address: "Historic District", priceLevel: "budget", description: "Guided city tour" },
  ],
  nightlife: [
    { name: "Local Bar District", rating: 4.2, address: "Entertainment District", priceLevel: "moderate", description: "Popular nightlife area" },
  ],
  shopping: [
    { name: "Main Shopping Street", rating: 4.1, address: "Downtown", priceLevel: "moderate", description: "Local shops and boutiques" },
  ],
  historical: [
    { name: "Historic Center", rating: 4.4, address: "Old Town", priceLevel: "budget", description: "Historical landmarks" },
  ],
  entertainment: [
    { name: "Local Theater", rating: 4.2, address: "Arts District", priceLevel: "moderate", description: "Performances and shows" },
  ],
};

function getAttractions(location, category, priceLevel) {
  const normalized = location.toLowerCase();
  let cityAttractions = null;

  for (const city of Object.keys(attractionsDatabase)) {
    if (normalized.includes(city)) {
      cityAttractions = attractionsDatabase[city];
      break;
    }
  }

  const attractions = cityAttractions?.[category] || defaultAttractions[category] || [];

  let filtered = attractions;
  if (priceLevel) {
    filtered = attractions.filter((a) => a.priceLevel === priceLevel);
    if (filtered.length === 0) filtered = attractions;
  }

  return filtered.slice(0, 5);
}

export const attractionsTool = tool(
  async ({ location, category, priceLevel }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
            `${category} in ${location}`
          )}&key=${apiKey}`
        );
        if (response.ok) {
          const data = await response.json();
          const places = data.results.slice(0, 5).map((place) => ({
            name: place.name,
            rating: place.rating || 4.0,
            address: place.formatted_address,
            priceLevel: place.price_level <= 1 ? "budget" : place.price_level >= 3 ? "expensive" : "moderate",
            description: place.types?.join(", ") || category,
          }));
          return JSON.stringify({ location, category, attractions: places });
        }
      } catch (error) {
        console.log("Google Places API unavailable, using mock data");
      }
    }

    const attractions = getAttractions(location, category, priceLevel);
    return JSON.stringify({
      location,
      category,
      priceLevel: priceLevel || "all",
      attractions,
    });
  },
  {
    name: "search_attractions",
    description:
      "Search for attractions, restaurants, activities in a location by category. Returns top 5 results with ratings and addresses.",
    schema: AttractionsInputSchema,
  }
);
