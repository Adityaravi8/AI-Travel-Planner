import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Preferences() {
  const { tripId } = useParams();
  const [interests, setInterests] = useState<string[]>([]);
  const [hardNo, setHardNo] = useState("");
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.post(`/trips/${tripId}/preferences`, {
      interests,
      hardNo: hardNo ? [hardNo] : [],
      activityLevel: "medium",
      diet: "none",
    });
    navigate(`/itinerary/${tripId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>

        <label className="font-semibold">Interests:</label>
        <div className="flex flex-wrap gap-2">
          {["Food", "Culture", "Nightlife"].map(i => (
            <button
              key={i}
              type="button"
              onClick={() => toggleInterest(i)}
              className={`px-3 py-1 rounded border ${
                interests.includes(i)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <label className="font-semibold">Hard No:</label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Hiking, etc."
          value={hardNo}
          onChange={e => setHardNo(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Preferences
        </button>
      </form>
    </div>
  );
}
