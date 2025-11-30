'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Business, Institution } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Icon normally since it's used inside isClient check
import { Icon } from 'leaflet';

interface MapViewProps {
  businesses: Business[];
  institutions?: Institution[];
  selectedInstitution?: Institution | null;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({
  businesses,
  institutions,
  selectedInstitution,
  center = [11.0168, 76.9558], // Coimbatore coordinates
  zoom = 13
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-96 w-full rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Institution Markers */}
        {(institutions || []).map((institution) => (
          <Marker
            key={institution.id}
            position={[institution.lat, institution.lon]}
            icon={new Icon({
              iconUrl: institution.type === 'university' ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' :
                        institution.type === 'college' ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' :
                        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{institution.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{institution.type}</p>
                {institution.address && <p className="text-xs text-gray-500">{institution.address}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Business Markers */}
        {businesses.map((business) => (
          <Marker
            key={business.id}
            position={[business.latitude, business.longitude]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{business.name}</h3>
                <p className="text-sm text-gray-600">{business.category}</p>
                <p className="text-xs text-gray-500">Rating: {business.rating} ({business.reviewCount} reviews)</p>
                <p className="text-xs text-gray-500">{business.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected Institution Highlight */}
        {selectedInstitution && Icon && (
          <Marker
            position={[selectedInstitution.lat, selectedInstitution.lon]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-blue-600">{selectedInstitution.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedInstitution.type}</p>
                {selectedInstitution.address && <p className="text-xs text-gray-500">{selectedInstitution.address}</p>}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
