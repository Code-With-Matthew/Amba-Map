'use client';

import React from 'react';
import toast from 'react-hot-toast';

type Data = {
  nama_kepala_keluarga: string;
  nik: string;
  alamat: string;
  statusEkonomi: string;
  lat: number;
  lng: number;
};

type Props = {
  data: Data;
  onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function FamilyForm({ data, onChange, onSubmit, onCancel }: Props) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        // validasi sederhana
        if (!data.nama_kepala_keluarga.trim() || !data.alamat.trim()) {
          toast.error('Nama & Alamat wajib diisi');
          return;
        }
        onSubmit();
      }}
      className="space-y-3 text-sm"
    >
      <div>
        <label className="block font-medium">Nama Kepala Keluarga</label>
        <input
          name="nama_kepala_keluarga"
          value={data.nama_kepala_keluarga}
          onChange={onChange}
          className="w-full border rounded px-2 py-1 focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label className="block font-medium">NIK</label>
        <input
          name="nik"
          value={data.nik}
          onChange={onChange}
          className="w-full border rounded px-2 py-1 focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label className="block font-medium">Alamat</label>
        <input
          name="alamat"
          value={data.alamat}
          onChange={onChange}
          className="w-full border rounded px-2 py-1 focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label className="block font-medium">Status Ekonomi</label>
        <select
          name="statusEkonomi"
          value={data.statusEkonomi}
          onChange={onChange}
          className="w-full border rounded px-2 py-1 focus:ring focus:border-blue-300"
        >
          <option value="Miskin">Miskin</option>
          <option value="Mampu">Mampu</option>
          <option value="Kaya">Kaya</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {data.nama_kepala_keluarga ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
