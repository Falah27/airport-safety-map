import React, { useState, useEffect } from 'react';
import MapDisplay from './components/MapDisplay';
import AirportSidebar from './components/AirportSidebar';
import MapSearch from './components/MapSearch'; 
import UploadButton from './components/UploadButton';
import DeleteButton from './components/DeleteButton';
import { Toaster } from 'react-hot-toast';
import './App.css'; 
import { MdSettings, MdClose, MdMap, MdLocalFireDepartment } from 'react-icons/md';
import { airportAPI } from './services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [airports, setAirports] = useState([]); 
  const [visibleAirports, setVisibleAirports] = useState([]); // ✅ BARU
  const [currentView, setCurrentView] = useState('cabang'); // ✅ BARU
  const [selectedCabang, setSelectedCabang] = useState(null); // ✅ BARU
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Fetch Data dengan Error Handling yang Proper
  useEffect(() => {
    const apiUrl = `${API_BASE_URL}/api/airports`; // Default return 28 cabang

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const airportsData = data.success ? data.data : data;
        setAirports(airportsData); 
        setVisibleAirports(airportsData); // ✅ Set visible airports
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching airport data:", error);
        setError(error.message);
        setIsLoading(false); 
      });
  }, []);

  const handleAirportSelect = async (airport) => {
    console.log('🖱️ Clicked:', airport.name, '| Type:', airport.type);

    // ✅ Kalau klik CABANG → cek punya children ga
    if (airport.type === 'cabang') {
      try {
        // Fetch children (CP + Unit)
        const response = await fetch(`${API_BASE_URL}/api/airports?parent_id=${airport.id}`);
        const children = await response.json();
        
        console.log('👶 Children count:', children.length);

        // ✅ Kalau punya children → zoom in ke detail view
        if (children.length > 0) {
          setSelectedCabang(airport);
          setCurrentView('detail');
          setVisibleAirports([airport, ...children]); // Tampilkan cabang + children
          console.log('📍 Switching to detail view');
        } 
        // ✅ Kalau ga punya children → langsung buka sidebar aja
        else {
          setSelectedAirport(airport);
          console.log('📊 Opening sidebar (no children)');
        }
      } catch (error) {
        console.error("❌ Error loading children:", error);
        setSelectedAirport(airport); // Fallback: buka sidebar
      }
    } 
    // ✅ Kalau klik CP atau UNIT → buka sidebar
    else {
      setSelectedAirport(airport);
      console.log('📊 Opening sidebar');
    }
  };

  const handleBackToCabangView = () => {
    console.log('⬅️ Back to cabang view');
    setCurrentView('cabang');
    setSelectedCabang(null);
    setSelectedAirport(null);
    setVisibleAirports(airports); // Kembali ke 28 cabang
  };

  const handleCloseSidebar = () => {
    setSelectedAirport(null);
  };

  const toggleHeatmap = () => {
    setIsHeatmapMode(!isHeatmapMode);
    // Tutup sidebar saat toggle heatmap
    if (!isHeatmapMode) {
      setSelectedAirport(null);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl">Memuat data peta dan laporan... ✈️</h2>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-900 text-white">
        <div className="text-center max-w-md p-6 bg-red-900/20 border border-red-500 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-red-400">❌ Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toaster 
        position="top-center"
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
        apiBaseUrl={API_BASE_URL} // ✅ Pass API URL
      />
      
      {/* ✅ Search hanya muncul di mode normal (bukan heatmap) */}
      {!isHeatmapMode && (
        <MapSearch 
          airports={airports} 
          onAirportSelect={handleAirportSelect}
          selectedAirport={selectedAirport}
        />
      )}
      
      {/* --- ADMIN SPEED DIAL (KIRI BAWAH) --- */}
      <div className="admin-fab-container">
        
        {/* 1. TOMBOL UTAMA (GEAR) */}
        <button 
          className={`admin-fab-main ${isMenuOpen ? 'rotate' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="Admin Menu"
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdSettings size={24} />}
        </button>

        {/* 2. MENU ITEMS */}
        <div className={`admin-menu-items ${isMenuOpen ? 'open' : ''}`}>
          
          {/* Item 1: Heatmap Toggle */}
          <div className="fab-item-wrapper">
            <span className="fab-tooltip">
              {isHeatmapMode ? "Mode Normal" : "Mode Heatmap"}
            </span>
            <button 
              onClick={toggleHeatmap}
              className={`fab-child-btn ${isHeatmapMode ? 'active' : ''}`}
            >
              {isHeatmapMode ? <MdMap size={20} /> : <MdLocalFireDepartment size={20} />}
            </button>
          </div>

          {/* Item 2: Delete */}
          <div className="fab-item-wrapper">
            <span className="fab-tooltip">Hapus Data</span>
            <div className="fab-child">
              <DeleteButton />
            </div>
          </div>

          {/* Item 3: Upload */}
          <div className="fab-item-wrapper">
            <span className="fab-tooltip">Upload Data</span>
            <div className="fab-child">
              <UploadButton />
            </div>
          </div>

        </div>
      </div>

      {/* Back Button - Tampil kalau lagi detail view */}
      {currentView === 'detail' && (
        <button
          onClick={handleBackToCabangView}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '12px 24px',
            backgroundColor: '#2D3748',
            color: 'white',
            border: '2px solid #4A5568',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1A202C';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2D3748';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>Kembali ke Semua Cabang</span>
        </button>
      )}
      
      {/* ✅ Pass isHeatmapMode ke MapDisplay */}
      <MapDisplay 
        airports={visibleAirports} // ✅ Ganti dari airports
        onMarkerClick={handleAirportSelect} 
        selectedAirport={selectedAirport}
        isHeatmapMode={isHeatmapMode}
        currentView={currentView} // ✅ BARU
        selectedCabang={selectedCabang} // ✅ BARU
      />
    </div>
  );
}

export default App;