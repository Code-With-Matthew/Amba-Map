'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import MarkerForm from './MarkerForm';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';

interface IconDefaultProto {
  _getIconUrl?: () => string;
}

// Cast prototype ke unknown dulu, lalu ke interface kita
const defaultProto = L.Icon.Default.prototype as unknown as IconDefaultProto;
delete defaultProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

type MarkerType = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: string;
};

type MapComponentProps = {
  adminMode?: boolean;
};

const MapComponent = ({ adminMode = false }: MapComponentProps) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<L.LatLng | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const response = await fetch('/api/markers');
      if (!response.ok) throw new Error('Failed to fetch markers');
      const data = await response.json();
      setMarkers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching markers:', error);
      toast.error('Gagal memuat data marker');
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    if (adminMode) {
      setSelectedPosition(latlng);
      setSelectedMarker(null);
    }
  };

  const handleFormSubmit = async (formData: Omit<MarkerType, 'id' | 'lat' | 'lng'>) => {
    if (!adminMode) return;
    
    setLoading(true);
    try {
      const method = selectedMarker ? 'PUT' : 'POST';
      const payload = {
        ...(selectedMarker && { id: selectedMarker.id }),
        ...formData,
        lat: selectedPosition?.lat || selectedMarker?.lat,
        lng: selectedPosition?.lng || selectedMarker?.lng,
      };

      // Validasi data
      if (!payload.title?.trim()) throw new Error('Judul harus diisi');
      if (typeof payload.lat !== 'number' || isNaN(payload.lat)) throw new Error('Latitude tidak valid');
      if (typeof payload.lng !== 'number' || isNaN(payload.lng)) throw new Error('Longitude tidak valid');

      const response = await fetch('/api/markers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan server');
      }

      await fetchMarkers();
      toast.success(selectedMarker ? 'Marker updated!' : 'Marker created!');
      setSelectedPosition(null);
      setSelectedMarker(null);
    } catch (error) {
      console.error('Operation error:', error);
      toast.error(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Terjadi kesalahan'
          : 'Terjadi kesalahan'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!adminMode || !confirm('Yakin ingin menghapus?')) return;
    
    try {
      const response = await fetch('/api/markers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Gagal menghapus marker');
      
      await fetchMarkers();
      toast.success('Marker dihapus!');
      setSelectedMarker(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Terjadi kesalahan'
          : 'Terjadi kesalahan'
      );
    }
  };

  const MapContent = dynamic(
    async () => {
      const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = await import('react-leaflet');
      
      const MapEvents = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
        useMapEvents({ click: (e) => adminMode && onMapClick(e.latlng) });
        return null;
      };

      const MapContentInner = () => (
        <MapContainer
          center={[-6.2088, 106.8456]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              eventHandlers={{ click: () => adminMode && setSelectedMarker(marker) }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{marker.title}</h3>
                  <p className="text-gray-600">{marker.description}</p>
                  {marker.type && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {marker.type}
                    </span>
                  )}
                  {adminMode && (
                    <button onClick={() => setSelectedMarker(marker)} className="mt-2 text-blue-600 hover:underline">
                      Edit
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );
      MapContentInner.displayName = 'MapContent';
      return MapContentInner;
    },
    { ssr: false }
  );

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <MapContent />
      {(selectedPosition || selectedMarker) && (
        <MarkerForm
          position={selectedPosition}
          marker={selectedMarker ? { ...selectedMarker, loading } : null}
          onSubmit={handleFormSubmit}
          onDelete={handleDelete}
          onClose={() => { setSelectedPosition(null); setSelectedMarker(null); }}
        />
      )}
    </div>
  );
};

export default MapComponent;
