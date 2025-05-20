'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const FamilyMap = dynamic(() => import('../components/FamilyMap'), { ssr: false });

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'user') {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="h-[calc(100vh-4rem)]">
      <FamilyMap adminMode={false} />
    </main>
  );
}
