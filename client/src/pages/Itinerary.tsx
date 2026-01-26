import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { Day } from "../types";

export default function Itinerary() {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await API.get(`/trips/${tripId}/itinerary`);
        const data = res.data.itinerary || res.data;
        setItinerary(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch itinerary");
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [tripId]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!itinerary.length) return <div className="text-center p-6">No itinerary generated</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Trip Itinerary</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {itinerary.map(day => (
          <div key={day.day} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
            <p>🌅 Morning: {day.morning}</p>
            <p>🌤️ Afternoon: {day.afternoon}</p>
            <p>🌙 Evening: {day.evening}</p>
            <p className="mt-2 font-semibold">💰 Cost: ${day.estimatedCost}</p>
          </div>
        ))}
      </div>
    </div>
  );
}