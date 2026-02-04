import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CreateTrip from "./pages/CreateTrip";
import Preferences from "./pages/Preferences";
import Itinerary from "./pages/Itinerary";
import ProgressStepper from "./components/ui/ProgressStepper";
import { Plane } from "lucide-react";

function AppContent() {
  const location = useLocation();

  const getCurrentStep = () => {
    if (location.pathname === "/") return 1;
    if (location.pathname.includes("/preferences")) return 2;
    if (location.pathname.includes("/itinerary")) return 3;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success-200/20 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              AI Travel Planner
            </h1>
          </div>
          <ProgressStepper currentStep={getCurrentStep()} />
        </div>
      </header>

      <main className="relative z-10 px-4 pb-12">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<CreateTrip />} />
            <Route path="/preferences/:tripId" element={<Preferences />} />
            <Route path="/itinerary/:tripId" element={<Itinerary />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-4 text-center text-sm text-slate-500">
        <p>Powered by AI • Plan your perfect trip</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
