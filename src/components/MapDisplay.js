import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import MarkerClusterGroup from 'react-leaflet-cluster'; // Pastikan sudah npm install
import L from 'leaflet';
import airportIcon from '../assets/airport.png';
import { MdLocationOn, MdFlight, MdRouter } from 'react-icons/md'; 

const INDONESIA_CENTER = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const ZOOMED_IN_ZOOM = 12;

// 1. Ikon Cabang (Pesawat Biru)
const branchIcon = new L.Icon({
  iconUrl: airportIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// 2. Ikon Unit (Titik Merah Kecil)
const unitIcon = new L.DivIcon({
  className: 'custom-unit-icon',
  html: `<div style="background-color: #FC8181; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -6],
});

// Fix Leaflet Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapAnimator = ({ selectedAirport }) => {
  const map = useMap(); 
  const sidebarWidth = 370; 

  React.useEffect(() => { 
    if (selectedAirport) {
      // Zoom lebih dekat kalau klik Unit
      const zoomLevel = selectedAirport.isUnit ? 10 : ZOOMED_IN_ZOOM;
      
      const targetCoords = L.latLng(selectedAirport.coordinates);
      const targetPoint = map.project(targetCoords, zoomLevel);
      const offsetPoint = targetPoint.subtract([sidebarWidth / 2, 0]);
      const newCenter = map.unproject(offsetPoint, zoomLevel);
      map.flyTo(newCenter, zoomLevel, { duration: 1.0 });
    } else {
      map.closePopup(); 
      map.flyTo(INDONESIA_CENTER, DEFAULT_ZOOM, { duration: 1.0 });
    }
  }, [selectedAirport, map]);
  return null; 
}

const MapDisplay = ({ airports, onMarkerClick, selectedAirport }) => { 
  return (
    <MapContainer center={INDONESIA_CENTER} zoom={DEFAULT_ZOOM} className="w-full h-full outline-none" scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      
      {/* CLUSTER GROUP: Menyatukan Bapak & Anak saat zoom out */}
      {/* <MarkerClusterGroup chunkedLoading spiderfyOnMaxZoom={true} showCoverageOnHover={false}>
      </MarkerClusterGroup> */}
      {airports.map(parent => (

        
          <React.Fragment key={parent.id}>
            
            {/* --- A. MARKER BAPAK (CABANG) --- */}
            <Marker
              position={parent.coordinates}
              icon={branchIcon}
              eventHandlers={{
                click: () => onMarkerClick(parent), // Kirim object asli
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 border-b border-dark-700 pb-2 mb-2">
                        <MdFlight className="text-lg text-brand-blue" />
                        <h4 className="m-0 text-sm font-bold text-black leading-tight">{parent.name}</h4>
                    </div>
                    <div className="text-xs font-bold text-gray-500">CABANG UTAMA</div>
                    <div className="text-xs text-gray-600 mt-1">Membawahi {parent.sub_units?.length || 0} Unit</div>
                </div>
              </Popup>
            </Marker>

            {/* --- B. MARKER ANAK (UNIT SATELIT) --- */}
            {parent.sub_units && parent.sub_units.map((unit, idx) => (
               <Marker
                 key={`${parent.id}-unit-${idx}`}
                 position={unit.coordinates} // Koordinat Satelit dari API
                 icon={unitIcon}
                 eventHandlers={{
                   // Saat unit diklik, kita kirim data object MODIFIKASI ke Sidebar
                   // Supaya Sidebar tahu ini 'Anak' dan tidak mencoba fetch grafik
                   click: () => onMarkerClick({
                     ...unit, 
                     id: `${parent.id}-u-${idx}`, // ID Dummy
                     city: parent.city, // Pinjam kota bapak
                     provinsi: parent.provinsi,
                     coordinates: unit.coordinates,
                     
                     isUnit: true, // PENANDA PENTING!
                     parentName: parent.name, // Info tambahan
                     
                     total_reports: 0, 
                     report_categories: {} 
                   }),
                   mouseover: (e) => e.target.openPopup(),
                   mouseout: (e) => e.target.closePopup(),
                 }}
               >
                 <Popup>
                    <div className="min-w-[200px]">
                        <div className="flex items-center gap-2 border-b border-dark-700 pb-2 mb-2">
                            <MdRouter className="text-lg text-brand-red" />
                            <h4 className="m-0 text-sm font-bold text-black leading-tight">{unit.name}</h4>
                        </div>
                        <div className="text-xs font-bold text-gray-500">UNIT / PEMBANTU</div>
                        <div className="text-xs text-gray-600 mt-1">Induk: {parent.name}</div>
                    </div>
                 </Popup>
               </Marker>
            ))}

          </React.Fragment>
        ))}

      <MapAnimator selectedAirport={selectedAirport} />
    </MapContainer>
  );
};

export default MapDisplay;