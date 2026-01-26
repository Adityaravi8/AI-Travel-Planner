import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  destination: String,
  startDate: String,
  days: Number,
  budgetPerPerson: Number,
  ownerId: String,
});

export default mongoose.model("Trip", TripSchema);
