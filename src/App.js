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
  const [targetChild, setTargetChild] = useState(null); // State untuk target Unit/Anak
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ 1. STATE GLOBAL TANGGAL (Wajib ada agar tidak error "not a function")
  const [globalStartDate, setGlobalStartDate] = useState('');
  const [globalEndDate, setGlobalEndDate] = useState('');

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

  // Logika seleksi bandara (Induk vs Unit)
  const handleAirportSelect = (airportData) => {
    // 1. Jika data null (user tekan X di search bar), reset semuanya
    if (!airportData) {
      setSelectedAirport(null);
      setTargetChild(null);
      return;
    }

    // 2. Cek apakah yang dipilih adalah UNIT (punya parent_id)
    if (airportData.parent_id) {
      // Cari data Induknya di dalam list airports
      const parent = airports.find(a => a.id === airportData.parent_id);
      
      if (parent) {
        setSelectedAirport(parent);  // Peta fokus ke INDUK
        setTargetChild(airportData); // Sidebar menampilkan data UNIT
      } else {
        // Fallback kalau induk tidak ketemu
        setSelectedAirport(airportData);
        setTargetChild(null);
      }
    } 
    // 3. Jika yang dipilih adalah CABANG UTAMA (Induk)
    else {
      setSelectedAirport(airportData);
      setTargetChild(null); // Reset target anak
    }
  };

  const handleCloseSidebar = () => {
    setSelectedAirport(null);
    setTargetChild(null);
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

      {/* ✅ 2. PASSING PROPS STATE GLOBAL KE SIDEBAR (Ini perbaikan utamanya) */}
      <AirportSidebar 
        airport={selectedAirport} 
        initialChild={targetChild}
        onClose={handleCloseSidebar} 
        globalStartDate={globalStartDate}       
        setGlobalStartDate={setGlobalStartDate} 
        globalEndDate={globalEndDate}           
        setGlobalEndDate={setGlobalEndDate}     
      />
      
      <MapSearch 
        airports={airports} 
        onAirportSelect={handleAirportSelect}
        selectedAirport={selectedAirport}
      />
      
      <div className="admin-fab-container">
        
        <button 
            className={`admin-fab-main ${isMenuOpen ? 'rotate' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Admin Menu"
        >
            {isMenuOpen ? <MdClose size={24} /> : <MdSettings size={24} />}
        </button>

        <div className={`admin-menu-items ${isMenuOpen ? 'open' : ''}`}>
            
            <div className="fab-item-wrapper">
                <span className="fab-tooltip">{isHeatmapMode ? "Mode Normal" : "Mode Heatmap"}</span>
                <button 
                    onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                    className={`fab-child-btn ${isHeatmapMode ? 'active' : ''}`}
                >
                    {isHeatmapMode ? <MdMap size={20} /> : <MdLocalFireDepartment size={20} />}
                </button>
            </div>

            <div className="fab-item-wrapper">
                <span className="fab-tooltip">Hapus Data</span>
                <div className="fab-child">
                    <DeleteButton />
                </div>
            </div>

            <div className="fab-item-wrapper">
                <span className="fab-tooltip">Upload Data</span>
                <div className="fab-child">
                    <UploadButton />
                </div>
            </div>

        </div>
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