'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import LoginNavbar from './LoginNavbar';

export default function NavSwitch() {
  const pathname = usePathname();
  return pathname === '/login' ? <LoginNavbar /> : <Navbar />;
}
