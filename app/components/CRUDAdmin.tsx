'use client';
import { useState } from 'react';

type Item = { id: number; name: string };

export default function CrudAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (editId != null) {
      setItems(items.map(i => i.id === editId ? { id: i.id, name } : i));
      setEditId(null);
    } else {
      setItems([...items, { id: Date.now(), name }]);
    }
    setName('');
  };

  const onEdit = (item: Item) => {
    setEditId(item.id);
    setName(item.name);
  };

  const onDelete = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin CRUD</h2>
      <form onSubmit={onSubmit} className="mb-4 flex space-x-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nama item"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editId != null ? 'Update' : 'Tambah'}
        </button>
      </form>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
            <span>{item.name}</span>
            <div className="space-x-2">
              <button onClick={() => onEdit(item)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={() => onDelete(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
