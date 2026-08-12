//@/app/r&d/layout.tsx
/*role : Layout de la section R&D
   responsabilité : Fournir une navigation commune et une structure pour toutes les pages R&D
   import : React, usePathname (next/navigation), Link (next/link)
   useBy : toutes les pages du dossier
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavRD from "./NavRD"
export default function RdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation */}
<NavRD/>
      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}