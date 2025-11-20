import React from 'react'; // Kita hapus useState/useEffect
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import L from 'leaflet';
import airportIcon from '../assets/airport.png';
import { MdLocationOn } from 'react-icons/md'; 

// --- KONSTANTA GLOBAL ---
const INDONESIA_CENTER = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const ZOOMED_IN_ZOOM = 13;

// (Fungsi createCustomAirportIcon dan perbaikan L.Icon.Default tetap sama)
const createCustomAirportIcon = () => {
  return new L.Icon({
    iconUrl: airportIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// ----------------------------------------------------


// ---- Komponen Animator (Tidak Berubah) ----
const MapAnimator = ({ selectedAirport }) => {
  const map = useMap(); 
  const sidebarWidth = 370; 

  React.useEffect(() => { // Kita tambahkan React. di depan useEffect
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
}


// ---- KOMPONEN MapDisplay UTAMA ----
// Perhatikan sekarang dia menerima 'airports' sebagai prop
const MapDisplay = ({ airports, onMarkerClick, selectedAirport }) => { 
  
  // KITA HAPUS SEMUA LOGIKA FETCH DARI SINI
  
  const customIcon = createCustomAirportIcon();

  return (
    <MapContainer 
      center={INDONESIA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom={true} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Kita sekarang map 'airports' dari props */}
      {airports.map(airport => (
        <Marker
          key={airport.id}
          position={airport.coordinates}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              onMarkerClick(airport);
            },
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          {/* Popup versi terakhir (dengan Total Laporan) */}
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
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapAnimator selectedAirport={selectedAirport} />

    </MapContainer>
  );
};

export default MapDisplay;