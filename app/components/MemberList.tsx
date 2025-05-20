'use client';

import { useState, useEffect } from 'react';
import type { FamilyMember } from '../types/family';
import { toast } from 'react-hot-toast';

type Props = { familyId: string };

export default function MemberList({ familyId }: Props) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [editing, setEditing] = useState<FamilyMember | null>(null);

  useEffect(() => {
    fetch(`/api/familyMembers?familyId=${familyId}`)
      .then(r => r.json())
      .then(setMembers)
      .catch(err => console.error(err));
  }, [familyId]);

  const save = async (member: Partial<FamilyMember> & { id?: string }) => {
    const method = member.id ? 'PUT' : 'POST';
    const url = '/api/familyMembers';
    const body = JSON.stringify({ ...member, familyId });
    const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body });
    if (res.ok) {
      toast.success('Berhasil!');
      setEditing(null);
      // reload
      const data = await fetch(`/api/familyMembers?familyId=${familyId}`).then(r=>r.json());
      setMembers(data);
    } else {
      toast.error('Gagal menyimpan');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus anggota?')) return;
    const res = await fetch('/api/familyMembers', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    if (res.ok) {
      setMembers(members.filter(m => m.id !== id));
      toast.success('Terhapus');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Anggota Keluarga</h3>
      <button onClick={() => setEditing({ id: '', familyId, name: '', relation: 'anak', age: 0 })} className="mb-2 px-3 py-1 bg-green-500 text-white rounded">
        Tambah Anggota
      </button>
      {members.map(m => (
        <div key={m.id} className="flex justify-between p-2 bg-gray-50 rounded">
          <div>
            {m.name} ({m.relation}, {m.age} th)
          </div>
          <div className="space-x-2">
            <button onClick={() => setEditing(m)} className="text-blue-600">Edit</button>
            <button onClick={() => remove(m.id)} className="text-red-600">Hapus</button>
          </div>
        </div>
      ))}

      {/* Form inline for editing */}
      {editing && (
        <div className="p-4 bg-white shadow rounded">
          <h4 className="font-medium mb-2">{editing.id ? 'Edit' : 'Tambah'} Anggota</h4>
          <form onSubmit={e => { e.preventDefault(); save(editing); }} className="space-y-2">
            <input
              value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
              placeholder="Nama"
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={editing.relation}
              onChange={e => setEditing({ ...editing, relation: e.target.value as 'ayah' | 'ibu' | 'anak' | 'lainnya' })}
              className="w-full p-2 border rounded"
            >
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="anak">Anak</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <input
              type="number"
              value={editing.age}
              onChange={e => setEditing({ ...editing, age: Number(e.target.value) })}
              placeholder="Usia"
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-200 rounded">Batal</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
