import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat'; // Import plugin heatmap

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 1. Siapkan Data Point: [Latitude, Longitude, Intensitas]
    // Intensitas kita ambil dari total_reports
    const points = data.map(airport => [
        airport.coordinates[0],
        airport.coordinates[1],
        airport.total_reports // Semakin banyak laporan, semakin "panas" (merah)
    ]);

    // 2. Cari nilai tertinggi untuk normalisasi warna
    const maxVal = Math.max(...data.map(d => d.total_reports));

    // 3. Konfigurasi Heatmap
    const heat = L.heatLayer(points, {
        radius: 30,       // Seberapa besar radius "panas" tiap titik
        blur: 20,         // Seberapa pudar pinggirannya
        maxZoom: 10,      // Pada zoom berapa dia mulai pudar
        max: maxVal > 0 ? maxVal / 2 : 1, // Sensitivitas (semakin kecil pembagi, semakin cepat merah)
        gradient: {
            0.4: 'blue',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }).addTo(map);

    // 4. Cleanup (Hapus layer saat komponen hilang/unmount)
    return () => {
      map.removeLayer(heat);
    };
  }, [data, map]);

  return null;
};

export default HeatmapLayer;