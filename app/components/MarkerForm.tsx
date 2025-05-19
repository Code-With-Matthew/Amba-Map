'use client';
import { useState, useEffect } from 'react';

type MarkerFormProps = {
  position: L.LatLng | null;
  marker: {
    id: string;
    title: string;
    description: string;
    type: string;
    loading: boolean;
  } | null;
  onSubmit: (data: { title: string; description: string; type: string }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export default function MarkerForm({
  position,
  marker,
  onSubmit,
  onDelete,
  onClose,
}: MarkerFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general',
  });

  useEffect(() => {
    if (marker) {
      setFormData({
        title: marker.title,
        description: marker.description,
        type: marker.type,
      });
    }
  }, [marker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-6 rounded-lg shadow-lg w-80 z-[1000]">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      
      <h2 className="text-xl font-bold mb-4">
        {marker ? 'Edit Marker' : 'New Marker'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="general">General</option>
            <option value="park">Park</option>
            <option value="hospital">Hospital</option>
            <option value="school">School</option>
          </select>
        </div>
        
        {position && (
          <p className="text-sm text-gray-600 mb-4">
            Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {marker ? 'Update' : 'Create'}
          </button>
          
          {marker && (
            <button
              type="button"
              onClick={() => onDelete(marker.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}