import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import L from 'leaflet';
import airportIcon from '../assets/airport.png';
import { MdLocationOn } from 'react-icons/md'; 
import HeatmapLayer from './HeatmapLayer';

// --- KONSTANTA ---
const INDONESIA_CENTER = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const ZOOMED_IN_ZOOM = 13;

// Custom Icon
const createCustomAirportIcon = () => {
  return new L.Icon({
    iconUrl: airportIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- MAP ANIMATOR ---
const MapAnimator = ({ selectedAirport }) => {
  const map = useMap(); 
  const sidebarWidth = 370; 

  React.useEffect(() => {
    if (selectedAirport) {
      const targetCoords = L.latLng(selectedAirport.coordinates);
      const targetPoint = map.project(targetCoords, ZOOMED_IN_ZOOM);
      const offsetPoint = targetPoint.subtract([sidebarWidth / 2, 0]);
      const newCenter = map.unproject(offsetPoint, ZOOMED_IN_ZOOM);
      map.flyTo(newCenter, ZOOMED_IN_ZOOM, { duration: 1.0 });
    } else {
      map.closePopup(); 
      map.flyTo(INDONESIA_CENTER, DEFAULT_ZOOM, { duration: 1.0 });
    }
  }, [selectedAirport, map]);

  return null; 
};

// --- MAIN COMPONENT ---
const MapDisplay = ({ airports, onMarkerClick, selectedAirport, isHeatmapMode }) => {
  const customIcon = createCustomAirportIcon();
  
  // ✅ FILTER: Hanya tampilkan Cabang Utama (28) yang punya koordinat
  const cabangUtamaOnly = airports.filter(airport => 
    airport.level === 'cabang_utama' && 
    airport.coordinates && 
    airport.coordinates.length === 2
  );

  console.log('🗺️ Displaying markers:', cabangUtamaOnly.length); // Debug

  return (
    <MapContainer 
      center={INDONESIA_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full outline-none"
      scrollWheelZoom={true} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      
      {/* MODE SWITCH: Heatmap vs Marker */}
      {isHeatmapMode ? (
        <HeatmapLayer data={cabangUtamaOnly} />
      ) : (
        cabangUtamaOnly.map(airport => (
          <Marker
            key={airport.id}
            position={airport.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick(airport),
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              <div className="custom-popup">
                <div className="popup-header">
                  <MdLocationOn />
                  <h4>{airport.name}</h4>
                </div>
                <div className="popup-content">
                  <div className="popup-row">
                    <span className="popup-label">KOTA</span>
                    <span className="popup-value">{airport.city}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">TOTAL LAPORAN</span>
                    <span className="popup-value">{airport.total_reports}</span>
                  </div>
                  {airport.has_children && (
                    <div className="popup-row">
                      <span className="popup-label">📍 CABANG PEMBANTU & UNIT</span>
                      <span className="popup-value">Klik untuk lihat</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))
      )}

      <MapAnimator selectedAirport={selectedAirport} />
    </MapContainer>
  );
};

export default MapDisplay;