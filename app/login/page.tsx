'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('role', role);
    router.push(`/${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-xl p-8 w-80"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Masuk sebagai
        </h1>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
              className="form-radio h-5 w-5 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-300"
            />
            <span className="text-white font-medium">User</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
              className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-300"
            />
            <span className="text-white font-medium">Admin</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition"
        >
          Masuk
        </button>
      </motion.form>

      {/* Footer animasi */}
      <Footer />
    </div>
  );
}
