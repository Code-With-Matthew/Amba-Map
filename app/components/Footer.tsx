'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 w-full py-6 text-center text-gray-300"
    >
      © 2025 AmbaMap. All rights reserved.
    </motion.footer>
  );
}
