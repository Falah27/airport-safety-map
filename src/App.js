import React, { useState, useEffect } from 'react';
import MapDisplay from './components/MapDisplay';
import AirportSidebar from './components/AirportSidebar';
import MapSearch from './components/MapSearch'; 
import UploadButton from './components/UploadButton';
import DeleteButton from './components/DeleteButton';
import './App.css'; 
import { MdLocalFireDepartment, MdMap } from 'react-icons/md'; // Tambah ini

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const apiUrl = 'http://localhost:8000/api/airports'; 

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setAirports(data); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching airport data:", error);
        setIsLoading(false); 
      });
  }, []); 

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
  };

  const handleCloseSidebar = () => {
    setSelectedAirport(null);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1A202C', color: 'white' }}>
        <h2>Memuat data peta dan laporan... ✈️</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AirportSidebar 
        airport={selectedAirport} 
        onClose={handleCloseSidebar} 
      />
      
      <MapSearch 
        airports={airports} 
        onAirportSelect={handleAirportSelect}
        selectedAirport={selectedAirport}
      />
      
      {/* ADMIN CONTROLS (Kiri Bawah) */}
      <div className="admin-controls">
        
        {/* Tombol Heatmap */}
        <button 
            onClick={() => setIsHeatmapMode(!isHeatmapMode)}
            className={`btn-toggle-heatmap ${isHeatmapMode ? 'active' : ''}`}
            title={isHeatmapMode ? "Mode Marker" : "Mode Heatmap"}
        >
            {isHeatmapMode ? <MdMap size={22} /> : <MdLocalFireDepartment size={22} />}
        </button>

        <div className="separator"></div>

        <DeleteButton />
        
        <div className="separator"></div>
        
        <UploadButton />
      </div>
      
      <MapDisplay 
        airports={airports} 
        onMarkerClick={handleAirportSelect} 
        selectedAirport={selectedAirport}
        isHeatmapMode={isHeatmapMode}
      />
    </div>
  );

  
}

export default App;