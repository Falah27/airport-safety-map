import React, { useState, useEffect } from 'react';
import MapDisplay from './components/MapDisplay';
import AirportSidebar from './components/AirportSidebar';
import MapSearch from './components/MapSearch'; 
import UploadButton from './components/UploadButton';
import DeleteButton from './components/DeleteButton';
import { Toaster } from 'react-hot-toast';
import './App.css'; 
import { MdSettings, MdClose, MdMap, MdLocalFireDepartment } from 'react-icons/md';

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {/* 2. PASANG INI (Konfigurasi Dark Mode) */}
      <Toaster 
        position="center"
        toastOptions={{
          style: {
            background: '#2D3748',
            color: '#fff',
            border: '1px solid #4A5568',
          },
          success: {
            iconTheme: {
              primary: '#68D391',
              secondary: '#1A202C',
            },
          },
          error: {
            iconTheme: {
              primary: '#FC8181',
              secondary: '#1A202C',
            },
          },
        }}
      />

      <AirportSidebar 
        airport={selectedAirport} 
        onClose={handleCloseSidebar} 
      />
      
      <MapSearch 
        airports={airports} 
        onAirportSelect={handleAirportSelect}
        selectedAirport={selectedAirport}
      />
      
      {/* --- ADMIN SPEED DIAL (KIRI BAWAH) --- */}
      <div className="admin-fab-container">
        
        {/* 1. TOMBOL UTAMA (GEAR) - DIRENDER PALING BAWAH SECARA VISUAL */}
        <button 
            className={`admin-fab-main ${isMenuOpen ? 'rotate' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Admin Menu"
        >
            {isMenuOpen ? <MdClose size={24} /> : <MdSettings size={24} />}
        </button>

        {/* 2. MENU ITEMS (Akan muncul DI ATAS tombol Gear) */}
        <div className={`admin-menu-items ${isMenuOpen ? 'open' : ''}`}>
            
            {/* Item 1 (Paling Bawah/Dekat Gear): Heatmap */}
            <div className="fab-item-wrapper">
                <span className="fab-tooltip">{isHeatmapMode ? "Mode Normal" : "Mode Heatmap"}</span>
                <button 
                    onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                    className={`fab-child-btn ${isHeatmapMode ? 'active' : ''}`}
                >
                    {isHeatmapMode ? <MdMap size={20} /> : <MdLocalFireDepartment size={20} />}
                </button>
            </div>

            {/* Item 2 (Tengah): Delete */}
            <div className="fab-item-wrapper">
                <span className="fab-tooltip">Hapus Data</span>
                <div className="fab-child">
                    <DeleteButton />
                </div>
            </div>

            {/* Item 3 (Paling Atas): Upload */}
            <div className="fab-item-wrapper">
                <span className="fab-tooltip">Upload Data</span>
                <div className="fab-child">
                    <UploadButton />
                </div>
            </div>

        </div>

      </div>
      {/* ------------------------------------- */}
      
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