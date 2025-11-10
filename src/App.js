import React, { useState } from 'react';
import MapDisplay from './components/MapDisplay';
import AirportSidebar from './components/AirportSidebar';
import './App.css';

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);

  const handleMarkerClick = (airport) => {
    setSelectedAirport(airport);
  };

  const handleCloseSidebar = () => {
    setSelectedAirport(null);
  };

  return (
    <div className="app-container">
      <AirportSidebar 
        airport={selectedAirport} 
        onClose={handleCloseSidebar} 
      />

      <MapDisplay 
        onMarkerClick={handleMarkerClick} 
        selectedAirport={selectedAirport} 
      />
    </div>
  );
}

export default App;