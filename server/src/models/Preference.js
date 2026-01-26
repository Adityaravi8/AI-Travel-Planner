import mongoose from "mongoose";

const PreferenceSchema = new mongoose.Schema({
  tripId: String,
  userId: String,
  interests: [String],
  activityLevel: String,
  diet: String,
  hardNo: [String]
});

export default mongoose.model("Preference", PreferenceSchema);
