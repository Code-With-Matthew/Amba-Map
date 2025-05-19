'use client';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl text-black font-bold mb-8">Pilih Role Anda</h1>
      <div className="space-x-4">
        <button
          onClick={() => router.push('/admin')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Admin
        </button>
        <button
          onClick={() => router.push('/user')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          User
        </button>
      </div>
    </div>
  );
}
