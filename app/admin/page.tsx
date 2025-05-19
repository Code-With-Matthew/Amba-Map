'use client';

import  DynamicMap  from '../components/MapComponent';
import CRUDAdmin from '../components/CRUDAdmin';

export default function AdminPage() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
      {/* Sisi kiri: Peta */}
      <section className="w-full h-full">
        <DynamicMap />
      </section>

      {/* Sisi kanan: CRUD */}
      <section className="overflow-auto p-4 bg-white/80">
        <CRUDAdmin />
      </section>
    </main>
  );
}
