'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Point {
  id: number;
  name: string;
}

export default function FormKlikPoint() {
  const [points, setPoints] = useState<Point[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId !== null) {
      setPoints((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, name } : p))
      );
      setEditingId(null);
    } else {
      setPoints((prev) => [...prev, { id: Date.now(), name }]);
    }

    setName('');
  };

  const handleEdit = (id: number) => {
    const point = points.find((p) => p.id === id);
    if (point) {
      setName(point.name);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 bg-white rounded shadow w-full"
    >
      <h2 className="text-xl font-bold mb-4">Kelola Klik Point</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nama Klik Point"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId !== null ? 'Simpan Perubahan' : 'Tambah Klik Point'}
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {points.map((point) => (
          <motion.li
            key={point.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{point.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(point.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(point.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
