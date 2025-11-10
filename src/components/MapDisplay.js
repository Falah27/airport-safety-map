import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import L from 'leaflet';
import airportIcon from '../assets/airport.png';

import { MdLocationOn } from 'react-icons/md'; 

const INDONESIA_CENTER = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const ZOOMED_IN_ZOOM = 13;

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

const MapAnimator = ({ selectedAirport }) => {
  const map = useMap(); 
  const sidebarWidth = 370; 

  useEffect(() => {
    if (selectedAirport) {
      const targetCoords = L.latLng(selectedAirport.coordinates);
      const targetPoint = map.project(targetCoords, ZOOMED_IN_ZOOM);
      const offsetPoint = targetPoint.subtract([sidebarWidth / 2, 0]);
      const newCenter = map.unproject(offsetPoint, ZOOMED_IN_ZOOM);

      map.flyTo(newCenter, ZOOMED_IN_ZOOM, {
        duration: 1.0
      });

    } else {
      map.closePopup(); 
      map.flyTo(INDONESIA_CENTER, DEFAULT_ZOOM, {
        duration: 1.0 
      });
    }
  }, [selectedAirport, map]);

  return null; 
}

/* MAP DISPLAY UTAMA */
const MapDisplay = ({ onMarkerClick, selectedAirport }) => {
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const customIcon = createCustomAirportIcon();

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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{padding: '20px'}}>    Memuat data bandara... ✈️</h2>
      </div>
    );
  }

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
      
      {airports.map(airport => (
        <Marker
          key={airport.id}
          position={airport.coordinates}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              onMarkerClick(airport);
            },
            mouseover: (e) => {
              e.target.openPopup();
            },
            mouseout: (e) => {
              e.target.closePopup();
            },
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
                  <span className="popup-label">PROVINSI</span>
                  <span className="popup-value">{airport.provinsi}</span>
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