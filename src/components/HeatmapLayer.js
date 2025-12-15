import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  // Memoize points calculation to avoid recalculation on every render
  const { points, maxVal } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], maxVal: 1 };
    }

    // Prepare data points: [Latitude, Longitude, Intensity]
    const pts = data.map(airport => [
      airport.coordinates[0],
      airport.coordinates[1],
      airport.total_reports
    ]);

    // Find max value for color normalization
    const max = Math.max(...data.map(d => d.total_reports || 0), 1);

    return { points: pts, maxVal: max };
  }, [data]);

  useEffect(() => {
    if (points.length === 0) return;

    // Configure heatmap layer
    const heat = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      max: maxVal / 2,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      map.removeLayer(heat);
    };
  }, [points, maxVal, map]);

  return null;
};

export default HeatmapLayer;