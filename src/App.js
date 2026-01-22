import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MapDisplay from './components/MapDisplay';
import AirportSidebar from './components/AirportSidebar';
import MapSearch from './components/MapSearch'; 
import UploadButton from './components/UploadButton';
import DeleteButton from './components/DeleteButton';
import { Toaster, toast } from 'react-hot-toast';
import './App.css'; 
import { MdSettings, MdClose, MdMap, MdLocalFireDepartment } from 'react-icons/md';

// ✅ KONSISTENSI URL
const getApiBaseUrl = () => {
  let url = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  url = url.replace(/\/$/, "");
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl(); 

const LOADING_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#1A202C',
  color: 'white'
};

const TOASTER_OPTIONS = {
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
};

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [targetChild, setTargetChild] = useState(null); 
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ 1. STATE GLOBAL TANGGAL
  const [globalStartDate, setGlobalStartDate] = useState('');
  const [globalEndDate, setGlobalEndDate] = useState('');

  useEffect(() => {
    const apiUrl = `${API_BASE_URL}/airports`;
    
    console.log("Fetching data from:", apiUrl); 

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const markersWithCoords = data.filter(a => 
          a.level === 'cabang_utama' && 
          a.coordinates && 
          a.coordinates.length === 2
        );
        
        if (markersWithCoords.length === 0) {
          toast('Data dimuat, tapi tidak ada koordinat valid', { icon: '⚠️' });
        }
        
        setAirports(data); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching airport data:", error);
        
        let errorMsg = 'Gagal memuat data bandara';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMsg = `Gagal koneksi ke Backend. Pastikan server Laravel jalan.`;
        } else if (error.message.includes('404')) {
          errorMsg = 'Endpoint tidak ditemukan (404). Cek routes/api.php di Laravel.';
        } else {
          errorMsg = error.message;
        }
        
        toast.error(errorMsg, { duration: 6000 });
        setIsLoading(false); 
      });
  }, []); 

  const handleAirportSelect = useCallback((airportData) => {
    if (!airportData) {
      setSelectedAirport(null);
      setTargetChild(null);
      return;
    }

    if (airportData.parent_id) {
      const parent = airports.find(a => a.id === airportData.parent_id);
      
      if (parent) {
        setSelectedAirport(parent);  
        setTargetChild(airportData); 
      } else {
        setSelectedAirport(airportData);
        setTargetChild(null);
      }
    } 
    else {
      setSelectedAirport(airportData);
      setTargetChild(null); 
    }
  }, [airports]);

  const handleCloseSidebar = useCallback(() => {
    setSelectedAirport(null);
    setTargetChild(null);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleHeatmap = useCallback(() => {
    setIsHeatmapMode(prev => !prev);
  }, []);

  const heatmapTooltip = useMemo(() => 
    isHeatmapMode ? "Mode Normal" : "Mode Heatmap",
    [isHeatmapMode]
  );

  if (isLoading) {
    return (
      <div style={LOADING_STYLE}>
        {/* Tulisan kecil debug "Connecting to..." sudah dihapus di sini */}
        <h2>Memuat data peta dan laporan... ✈️</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toaster 
        position="center"
        toastOptions={TOASTER_OPTIONS}
      />

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
            onClick={toggleMenu}
            title="Admin Menu"
        >
            {isMenuOpen ? <MdClose size={24} /> : <MdSettings size={24} />}
        </button>

        <div className={`admin-menu-items ${isMenuOpen ? 'open' : ''}`}>
            
            <div className="fab-item-wrapper">
                <span className="fab-tooltip">{heatmapTooltip}</span>
                <button 
                    onClick={toggleHeatmap}
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