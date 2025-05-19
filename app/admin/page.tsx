'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DynamicMap from '../components/MapComponent';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="h-[calc(100vh-4rem)]">
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Klik pada peta untuk menambahkan marker baru atau klik marker yang sudah ada untuk mengedit
        </p>
      </div>
      
      <div className="h-[calc(100vh-6rem)]">
        <DynamicMap adminMode={true} />
      </div>
    </main>
  );
}