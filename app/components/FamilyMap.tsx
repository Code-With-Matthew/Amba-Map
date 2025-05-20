'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import FamilyForm from './FamilyForm';

type Family = {
  id: string;
  nama_kepala_keluarga: string;
  nik: string;
  alamat: string;
  statusEkonomi: string;
  lat: number;
  lng: number;
};

const icon = new L.Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function FamilyMap({ adminMode = false }: { adminMode?: boolean }) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState<Omit<Family,'id'>>({
    nama_kepala_keluarga: '',
    nik: '',
    alamat: '',
    statusEkonomi: 'Miskin',
    lat: 0,
    lng: 0,
  });

  // pesan success/fail disini
  const notifySuccess = (msg: string) => toast.success(msg, { duration: 2000 });
  const notifyError   = (msg: string) => toast.error(msg,   { duration: 3000 });

  // load awal
  useEffect(() => {
    fetch('/data/families.geojson')
      .then(r => r.json())
      .then(geo => {
        type GeoFeature = {
          properties: {
            id: string;
            nama_kepala_keluarga: string;
            nik: string;
            alamat: string;
            statusEkonomi: string;
          };
          geometry: {
            coordinates: [number, number];
          };
        };
        const arr = geo.features.map((f: GeoFeature) => ({
          id: f.properties.id,
          nama_kepala_keluarga: f.properties.nama_kepala_keluarga,
          nik: f.properties.nik,
          alamat: f.properties.alamat,
          statusEkonomi: f.properties.statusEkonomi,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        }));
        setFamilies(arr);
      })
      .catch(e => console.error(e));
  }, []);

  // klik peta
  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (!adminMode) return;
        setSelectedPos(e.latlng);
        setFormData({
          nama_kepala_keluarga: '',
          nik: '',
          alamat: '',
          statusEkonomi: 'Miskin',
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  }

  // kirim full list ke server
  const saveAll = async (list: Family[]) => {
    try {
      const res = await fetch('/api/save-geojson', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(list),
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (e: unknown) {
      console.error(e);
      notifyError('Gagal menyimpan di server');
      return false;
    }
  };

  const handleSubmit = async (data: Omit<Family,'id'>) => {
    const entry: Family = { ...data, id: Date.now().toString() };
    const updated = [...families, entry];
    if (await saveAll(updated)) {
      setFamilies(updated);
      setSelectedPos(null);
      notifySuccess('Data berhasil ditambahkan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus?')) return;
    const updated = families.filter(f => f.id !== id);
    if (await saveAll(updated)) {
      setFamilies(updated);
      notifySuccess('Data berhasil dihapus');
    }
  };

  const handleEdit = (fam: Family) => {
    setSelectedPos({ lat: fam.lat, lng: fam.lng });
    setFormData({ ...fam });
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-0.022,109.328]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {adminMode && <ClickHandler/>}

        {families.map(f =>
          <Marker key={f.id} position={[f.lat,f.lng]} icon={icon}>
            <Popup className="min-w-[200px]">
              <div className="space-y-1 text-sm">
                <p><strong>Kepala:</strong> {f.nama_kepala_keluarga}</p>
                <p><strong>NIK:</strong> {f.nik}</p>
                <p><strong>Alamat:</strong> {f.alamat}</p>
                <p><strong>Status:</strong> {f.statusEkonomi}</p>
                {adminMode && (
                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => handleEdit(f)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => handleDelete(f.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {selectedPos && adminMode && (
          <Marker position={[selectedPos.lat, selectedPos.lng]} icon={icon}>
            <Popup
              className="p-0 !bg-transparent"
              closeOnClick={false}
              autoClose={false}
            >
              <div className="bg-white p-4 rounded shadow-lg w-72 animate-fade-in">
                <FamilyForm
                  data={formData}
                  onChange={(e) => {
                    const {name,value} = e.target;
                    setFormData(prev => ({ ...prev, [name]: value }));
                  }}
                  onSubmit={() => handleSubmit(formData)}
                  onCancel={() => setSelectedPos(null)}
                />
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      { /* toast container */ }
      <div id="toast-root" />
    </div>
  );
}
