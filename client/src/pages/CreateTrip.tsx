import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, DollarSign, ArrowRight } from "lucide-react";
import API from "../api";
import PageWrapper from "../components/ui/PageWrapper";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedInput from "../components/ui/AnimatedInput";
import { staggerContainerVariants, staggerItemVariants } from "../utils/motionVariants";

export default function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/trips", {
        destination,
        startDate,
        days,
        budgetPerPerson: budget,
      });
      navigate(`/preferences/${res.data._id}`);
    } catch (err) {
      setError("Failed to create trip. Please try again.");
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto mt-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-heading text-slate-800 mb-2">
            Where to next?
          </h2>
          <p className="text-slate-500">
            Tell us about your dream trip and we'll plan the perfect itinerary.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft p-8 space-y-6"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItemVariants}>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50
                         transition-all duration-200
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none
                         placeholder:text-slate-400"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50
                       transition-all duration-200
                       focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              required
            />
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              <Clock className="inline w-4 h-4 mr-2" />
              Duration: {days} {days === 1 ? "day" : "days"}
            </label>
            <input
              type="range"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                       accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 day</span>
              <span>1 week</span>
              <span>2 weeks</span>
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Budget per person
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50
                         transition-all duration-200
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={100}
                step={50}
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ~${Math.round(budget / days)}/day for activities, food & experiences
            </p>
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
              disabled={!destination || !startDate}
            >
              Continue to Preferences
              <ArrowRight className="w-5 h-5" />
            </AnimatedButton>
          </motion.div>
        </motion.form>

        <motion.p
          className="text-center text-sm text-slate-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your trip details are saved automatically
        </motion.p>
      </div>
    </PageWrapper>
  );
}
