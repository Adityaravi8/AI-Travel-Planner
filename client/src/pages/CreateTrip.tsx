import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState(1000);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await API.post("/trips", {
      destination,
      startDate,
      days,
      budgetPerPerson: budget,
    });
    navigate(`/preferences/${res.data._id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Create a Trip</h2>

        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Destination"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Days"
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          min={1}
          required
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Budget per person"
          value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          min={1}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Create Trip
        </button>
      </form>
    </div>
  );
}
