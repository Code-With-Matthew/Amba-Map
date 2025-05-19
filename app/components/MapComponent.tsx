'use client';

import dynamic from 'next/dynamic';

// Import marker images as ES modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Dynamically load Map component to disable SSR
const DynamicMap = dynamic(
  async () => {
    // Import required modules inside client-only context
    const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
    const L = await import('leaflet');
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    // Return actual map component
    return function MapComponent() {
      return (
        <MapContainer
          center={[-6.2088, 106.8456]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[-6.2088, 106.8456]}>  
            <Popup>Jakarta, Indonesia</Popup>
          </Marker>
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function MapComponentWrapper() {
  return <div className="h-screen w-full"><DynamicMap /></div>;
}
