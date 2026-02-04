import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sun,
  Sunset,
  Moon,
  DollarSign,
  RefreshCw,
  Home,
  Sparkles,
  AlertCircle,
  Cloud,
  CloudRain,
  Thermometer,
  Droplets,
} from "lucide-react";
import API from "../api";
import { Day, Weather } from "../types";
import PageWrapper from "../components/ui/PageWrapper";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedCard from "../components/ui/AnimatedCard";
import { SkeletonItinerary } from "../components/ui/SkeletonLoader";
import Spinner from "../components/ui/Spinner";
import { staggerContainerVariants, staggerItemVariants } from "../utils/motionVariants";

const loadingMessages = [
  "Planning your adventure...",
  "Checking the weather...",
  "Finding the best attractions...",
  "Calculating costs...",
  "Crafting your perfect itinerary...",
];

function getWeatherIcon(conditions: string) {
  const lowerConditions = conditions.toLowerCase();
  if (lowerConditions.includes("rain") || lowerConditions.includes("shower")) {
    return CloudRain;
  }
  if (lowerConditions.includes("cloud") || lowerConditions.includes("overcast")) {
    return Cloud;
  }
  return Sun;
}

function getWeatherColor(conditions: string) {
  const lowerConditions = conditions.toLowerCase();
  if (lowerConditions.includes("rain") || lowerConditions.includes("shower")) {
    return "bg-blue-100 text-blue-600";
  }
  if (lowerConditions.includes("cloud") || lowerConditions.includes("overcast")) {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-amber-100 text-amber-600";
}

function WeatherBadge({ weather, date }: { weather?: Weather; date?: string }) {
  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.conditions);
  const colorClass = getWeatherColor(weather.conditions);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {date && (
        <span className="text-xs text-slate-500 font-medium">
          {formatDate(date)}
        </span>
      )}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${colorClass}`}>
        <WeatherIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{weather.conditions}</span>
      </div>
      <div className="flex items-center gap-1 text-slate-600">
        <Thermometer className="w-4 h-4" />
        <span className="text-sm font-medium">
          {weather.highTemp}° / {weather.lowTemp}°F
        </span>
      </div>
      {weather.rainChance !== undefined && weather.rainChance > 0 && (
        <div className="flex items-center gap-1 text-blue-600">
          <Droplets className="w-4 h-4" />
          <span className="text-sm font-medium">{weather.rainChance}%</span>
        </div>
      )}
    </div>
  );
}

function TimeSlot({
  icon: Icon,
  label,
  activity,
  iconColor,
}: {
  icon: typeof Sun;
  label: string;
  activity: string;
  iconColor: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </div>
        <div className="text-slate-700 mt-1">{activity}</div>
      </div>
    </div>
  );
}

export default function Itinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double fetch in React StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchItinerary = async () => {
      try {
        const res = await API.get(`/trips/${tripId}/itinerary`);
        const data = res.data.itinerary || res.data;
        setItinerary(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate itinerary"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [tripId]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const totalCost = itinerary.reduce((sum, day) => sum + day.estimatedCost, 0);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto mt-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-primary-100 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-primary-500" />
            </motion.div>
            <h2 className="text-heading text-slate-800 mb-4">
              Creating Your Itinerary
            </h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMessageIndex}
                className="text-slate-500 flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Spinner size="sm" />
                {loadingMessages[loadingMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          <SkeletonItinerary days={3} />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto mt-8">
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <AnimatedButton
                variant="secondary"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4" />
                Start Over
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  if (!itinerary.length) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto mt-8 text-center">
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-500 mb-4">No itinerary generated yet.</p>
            <AnimatedButton variant="primary" onClick={() => navigate("/")}>
              Create New Trip
            </AnimatedButton>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto mt-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-success-100 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 text-success-500" />
          </motion.div>
          <h2 className="text-heading text-slate-800 mb-2">
            Your Perfect Itinerary
          </h2>
          <p className="text-slate-500">
            {itinerary.length} days of adventure await you
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-primary-100 text-sm">Estimated Total Cost</div>
              <div className="text-3xl font-bold flex items-center gap-1">
                <DollarSign className="w-8 h-8" />
                {totalCost}
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary-100 text-sm">Daily Average</div>
              <div className="text-2xl font-semibold">
                ${Math.round(totalCost / itinerary.length)}/day
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {itinerary.map((day, index) => (
            <motion.div key={day.day} variants={staggerItemVariants}>
              <AnimatedCard delay={index * 0.1} hover={true}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">
                        {day.day}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Day {day.day}
                      </h3>
                      {!day.weather && (
                        <p className="text-sm text-slate-400">
                          Full day of activities
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-success-100 rounded-full">
                    <DollarSign className="w-4 h-4 text-success-600" />
                    <span className="font-semibold text-success-700">
                      {day.estimatedCost}
                    </span>
                  </div>
                </div>

                {day.weather && (
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <WeatherBadge weather={day.weather} date={day.date} />
                  </div>
                )}

                <div className="space-y-4">
                  <TimeSlot
                    icon={Sun}
                    label="Morning"
                    activity={day.morning}
                    iconColor="bg-amber-400"
                  />
                  <TimeSlot
                    icon={Sunset}
                    label="Afternoon"
                    activity={day.afternoon}
                    iconColor="bg-orange-400"
                  />
                  <TimeSlot
                    icon={Moon}
                    label="Evening"
                    activity={day.evening}
                    iconColor="bg-indigo-500"
                  />
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-4 justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedButton variant="secondary" onClick={() => navigate("/")}>
            <Home className="w-4 h-4" />
            Plan Another Trip
          </AnimatedButton>
          <AnimatedButton
            variant="primary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </AnimatedButton>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
