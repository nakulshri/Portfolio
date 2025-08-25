import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Home } from "./pages/Home";
import Navigation from "./pages/Navigation";
import { Faculty } from "./pages/Faculty";
import { Events } from "./pages/Events";
import { Buildings } from "./pages/Buildings";
import { Profile } from "./pages/Profile";
import FloorPlanCanvas from "./components/FloorPlanCanvas"; // Indoor navigation component
import FloorSelector from "./components/floor-selector"; // Floor selection
import LiveMap from "./pages/LiveMap"; // Import LiveMap component

function App() {
  const [currentFloor, setCurrentFloor] = useState(1); // State to track selected floor

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/events" element={<Events />} />
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/livemap" element={<LiveMap />} />

        {/* Indoor Navigation System Route */}
        <Route
          path="/indoor-map"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-[#1a237e] mb-4">Indoor Navigation System</h1>
              <FloorSelector setFloor={setCurrentFloor} />
              <div className="h-[80vh] mt-4">
                <FloorPlanCanvas currentFloor={currentFloor} />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
