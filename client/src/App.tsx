import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTrip from "./pages/CreateTrip";
import Preferences from "./pages/Preferences";
import Itinerary from "./pages/Itinerary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateTrip />} />
        <Route path="/preferences/:tripId" element={<Preferences />} />
        <Route path="/itinerary/:tripId" element={<Itinerary />} />
      </Routes>
    </Router>
  );
}

export default App;
