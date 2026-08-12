// components/layout/public/Help.tsx
/*
  Chemin : /components/layout/public/Help.tsx
  Rôle : Icône d'aide, lien vers la page d'aide / contact.
  Imports : React, Link de Next, lucide-react (HelpCircle)
  Dépendances : lucide-react
  Fichiers liés : Page d'aide (/app/aide/page.tsx)
*/

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

interface HelpProps {
  className?: string;
}

export default function Help({ className = '' }: HelpProps) {
  return (
    <Link
      href="/public/faq"
      className={`inline-flex items-center justify-center h-12 w-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 ${className}`}
      aria-label="Aide"
    >
      <HelpCircle className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
    </Link>
  );
}