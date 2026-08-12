// components/layout/public/Chart.tsx
/*
  Chemin : /components/layout/public/Chart.tsx
  Rôle : Icône panier avec compteur d'articles, lien vers la page du panier.
  Imports : React, Link de Next, lucide-react (ShoppingCart)
  Dépendances : lucide-react
  Fichiers liés : Page panier (/app/panier/page.tsx), contexte de panier
*/

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ChartProps {
  className?: string;
}

export default function Chart({ className = '' }: ChartProps) {
  // Simuler un compteur de panier (à remplacer par un vrai contexte)
  const [count] = useState(3);

  return (
    <Link
      href="/panier"
      className={`relative inline-flex items-center justify-center h-12 w-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 ${className}`}
      aria-label={`Panier (${count} article${count > 1 ? 's' : ''})`}
    >
      <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}