import express from "express";
import Trip from "../models/Trip.js";
import Preference from "../models/Preference.js";
import { generateItinerary } from "../ai/generateItinerary.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

router.post("/:tripId/preferences", async (req, res) => {
  try {
    const { tripId } = req.params;
    const preference = await Preference.create({
      tripId,
      preference: req.body.preference,
    });
    res.json(preference);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add preference" });
  }
});

router.get("/:tripId/itinerary", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const preferences = await Preference.find({ tripId: trip._id });
    const itinerary = await generateItinerary(trip, preferences);

    res.json({ itinerary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

export default router;
