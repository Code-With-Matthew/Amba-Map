'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-gray-800 text-white z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo sebagai link dan diperbesar */}
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

      {/* Mobile Menu kosong */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          {/* Placeholder untuk menu mobile jika dibutuhkan */}
        </div>
      )}
    </nav>
  );
}
