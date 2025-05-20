'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Family } from '../types/family';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl,
});

export default function LeafletMap({ families, adminMode }: { families: Family[]; adminMode: boolean }) {
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!adminMode) return;
    const { lat, lng } = e.latlng;
    alert(`Tambah keluarga di lokasi: ${lat}, ${lng}`);
  };

  function MapClickHandler() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  return (
    <MapContainer center={[-0.7893, 113.9213]} zoom={5} className="h-full w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />
      {adminMode && <MapClickHandler />}
      {families.map((family) =>
        family.lat && family.lng ? (
          <Marker key={family.id} position={[family.lat, family.lng]}>
            <Popup>
              <div>
                <p className="font-semibold">Kepala Keluarga: {family.nama_kepala_keluarga}</p>
                <p>NIK: {family.nik}</p>
                <p>Status Ekonomi: {family.statusEkonomi}</p>
                <p>Alamat: {family.alamat}</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
