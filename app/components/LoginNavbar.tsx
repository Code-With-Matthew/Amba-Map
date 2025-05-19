'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LoginNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/20 backdrop-blur-lg border-b border-gray-200/20 py-4 z-10">
      <div className="max-w-7xl mx-auto px-6 flex items-center">
        <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
          <Image
            src="/Nav-logo.png"
            alt="Logo AmbaMap"
            width={72}
            height={72}
            className="h-16 w-16 transition-transform hover:scale-105"
            priority
          />
          <span className="text-white font-bold text-3xl">AmbaMap</span>
        </Link>
      </div>
    </nav>
  );
}
