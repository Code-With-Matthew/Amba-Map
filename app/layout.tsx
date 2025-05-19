import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavSwitch from './components/NavSwitch';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WEBGIS AmbaMap',
  description: 'Map bagi pecinta Amba',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Pilih Navbar via client-side NavSwitch */}
        <NavSwitch />

        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
