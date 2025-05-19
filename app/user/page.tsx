'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DynamicMap from '../components/MapComponent';

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'user') {
      router.push('/login'); // redirect kalau bukan user
    }
  }, [router]);

  return (
    <main className="h-[calc(100vh-4rem)]">
      <DynamicMap />
    </main>
  );
}
