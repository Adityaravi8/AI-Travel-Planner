import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Utensils,
  Landmark,
  Music,
  Camera,
  Mountain,
  ShoppingBag,
  Palette,
  Waves,
  ArrowRight,
  Ban,
  Zap,
  Activity,
  Coffee,
} from "lucide-react";
import API from "../api";
import PageWrapper from "../components/ui/PageWrapper";
import AnimatedButton from "../components/ui/AnimatedButton";
import InterestChip from "../components/ui/InterestChip";
import { staggerContainerVariants, staggerItemVariants } from "../utils/motionVariants";

const interestOptions = [
  { id: "food", label: "Food & Dining", icon: Utensils },
  { id: "culture", label: "Culture & History", icon: Landmark },
  { id: "nightlife", label: "Nightlife", icon: Music },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "outdoor", label: "Outdoor & Nature", icon: Mountain },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "art", label: "Art & Museums", icon: Palette },
  { id: "relaxation", label: "Relaxation", icon: Waves },
];

const activityLevels = [
  { id: "relaxed", label: "Relaxed", icon: Coffee, description: "Take it easy, fewer activities" },
  { id: "moderate", label: "Moderate", icon: Activity, description: "Balanced mix of activities" },
  { id: "active", label: "Active", icon: Zap, description: "Pack in as much as possible" },
];

const dietaryOptions = [
  { id: "none", label: "No restrictions" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
  { id: "gluten-free", label: "Gluten-free" },
];

export default function Preferences() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [diet, setDiet] = useState("none");
  const [hardNo, setHardNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post(`/trips/${tripId}/preferences`, {
        interests,
        hardNo: hardNo ? hardNo.split(",").map((s) => s.trim()).filter(Boolean) : [],
        activityLevel,
        diet,
      });
      navigate(`/itinerary/${tripId}`);
    } catch (err) {
      setError("Failed to save preferences. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto mt-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-heading text-slate-800 mb-2">
            Personalize Your Trip
          </h2>
          <p className="text-slate-500">
            Help us understand what you love so we can create the perfect itinerary.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft p-8 space-y-8"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItemVariants}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              What are you interested in?
            </h3>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((option) => (
                <InterestChip
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  selected={interests.includes(option.id)}
                  onClick={() => toggleInterest(option.id)}
                />
              ))}
            </div>
            {interests.length === 0 && (
              <p className="text-sm text-slate-400 mt-2">
                Select at least one interest for better recommendations
              </p>
            )}
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Activity Level
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activityLevels.map((level) => {
                const Icon = level.icon;
                const isSelected = activityLevel === level.id;
                return (
                  <motion.button
                    key={level.id}
                    type="button"
                    onClick={() => setActivityLevel(level.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left
                      ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-slate-200 hover:border-primary-300"
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        isSelected ? "text-primary-500" : "text-slate-400"
                      }`}
                    />
                    <div
                      className={`font-medium ${
                        isSelected ? "text-primary-700" : "text-slate-700"
                      }`}
                    >
                      {level.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {level.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Dietary Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setDiet(option.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                    ${
                      diet === option.id
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-slate-200 text-slate-600 hover:border-accent-300"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              <Ban className="inline w-5 h-5 mr-2 text-red-500" />
              Anything to avoid?
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Activities or places you definitely don't want included
            </p>
            <input
              type="text"
              className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50
                       transition-all duration-200
                       focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none
                       placeholder:text-slate-400"
              placeholder="e.g., Hiking, Spicy food, Crowded places (comma separated)"
              value={hardNo}
              onChange={(e) => setHardNo(e.target.value)}
            />
          </motion.div>

          {error && (
            <motion.div
              className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={staggerItemVariants}>
            <AnimatedButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Generate My Itinerary
              <ArrowRight className="w-5 h-5" />
            </AnimatedButton>
          </motion.div>
        </motion.form>
      </div>
    </PageWrapper>
  );
}
