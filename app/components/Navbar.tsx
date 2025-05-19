'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();

  // Ambil role dan theme dari localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    router.push('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-800 text-white dark:bg-gray-900 dark:text-white z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
            <Image
              src="/Nav-logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="h-14 w-14 transition-transform hover:scale-110"
              priority
            />
            <span className="font-bold text-2xl tracking-tight">AmbaMap</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Toggle Dark/Light */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Logout Button */}
            {role && (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-gray-300 focus:outline-none p-2 rounded-lg transition-all"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-900">
          {/* Tambah menu jika dibutuhkan */}
        </div>
      )}
    </nav>
  );
}
