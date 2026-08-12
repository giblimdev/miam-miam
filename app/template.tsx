//@/app/template.tsx
/*
 role : Similaire à layout.tsx mais ré-exécuté à chaque navigation (pas de persistance d'état).
        Utile pour les animations de transition entre pages.
 import: framer-motion (optionnel)
 useBy : Toutes les pages (enveloppe chaque page)
*/

'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={Math.random()} // Force re-render à chaque navigation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}