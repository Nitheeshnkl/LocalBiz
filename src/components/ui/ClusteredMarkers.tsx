import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface Place {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  source?: string;
}

interface Props {
  places: Place[];
  onBusinessClick?: (id: string) => void;
}

export default function ClusteredMarkers({ places, onBusinessClick }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const markers = L.markerClusterGroup();

    places.forEach((p) => {
      if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return;

      const html = p.source === 'mock'
        ? `<div style="background:#16a34a;border-radius:50%;width:18px;height:18px;border:2px solid white;box-shadow:0 0 0 2px rgba(16,185,129,0.15)"></div>`
        : `<div style="background:#dc2626;border-radius:50%;width:18px;height:18px;border:2px solid white;box-shadow:0 0 0 2px rgba(220,38,38,0.15)"></div>`;

      const icon = L.divIcon({ html, className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
      const marker = L.marker([p.latitude, p.longitude], { icon });
      marker.on('click', () => onBusinessClick?.(p.id));
      marker.bindPopup(`<div style="font-weight:600">${p.name}</div><div style="font-size:12px;color:#666">${p.category}</div>`);
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [map, places, onBusinessClick]);

  return null;
}
