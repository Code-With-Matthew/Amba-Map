'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FamilyMap from '../components/FamilyMap';
import { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') router.push('/login');
  }, [router]);

  return (
    <main className="h-[calc(100vh-4rem)]">
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-2">
          Klik peta untuk tambah/edit data keluarga
        </p>
      </div>
      <div className="h-[calc(100vh-6rem)]">
        <FamilyMap adminMode />
      </div>
      <Toaster />
    </main>
  );
}
