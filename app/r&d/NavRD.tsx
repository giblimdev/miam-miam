//@/components/RdNav.tsx
/* role : Navigation principale pour la section R&D
   responsabilité : Afficher une barre de navigation responsive avec indicateur de page active et liens élégants
   import : React, Link, usePathname (next/navigation)
   useBy : app/r&d/layout.tsx ou app/r&d/page.tsx
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Représente un élément du menu de navigation R&D.
 */
interface NavItem {
  /** Le libellé affiché dans le lien */
  label: string;
  /** L'URL relative de destination (ex: '/r&d/design') */
  url: string;
}

/**
 * Liste statique des liens de navigation.
 * Adapte les URLs selon le besoin.
 */
const navItems: NavItem[] = [
  { label: 'Accueil', url: '/r&d' },
  { label: 'Prompt', url: '/r&d/prompt' },
  { label: 'Design UX', url: '/r&d/design' },
  { label: 'Stack', url: '/r&d/stack' },
  { label: 'Scrum', url: '/r&d/scrum' },
  { label: 'Schema', url: '/r&d/schema' },
  { label: 'Commandes', url: '/r&d/cmd' },
  { label: 'Senari', url: '/r&d/senari' },

];

/**
 * Composant de navigation pour la section R&D.
 * Design moderne, responsive, avec indicateur de page active au survol et au focus.
 */
export default function RdNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/80 shadow-sm"
      aria-label="Navigation R&D"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-3 scrollbar-hide">
          {navItems.map((item) => {
            // Détection de la correspondance exacte ou préfixe pour la section "Accueil"
            const isActive =
              item.url === '/r&d'
                ? pathname === '/r&d'
                : pathname.startsWith(item.url);

            return (
              <li key={item.url} className="shrink-0">
                <Link
                  href={item.url}
                  className={`
                    inline-flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-spring
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                    ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50'
                        : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 active:scale-95'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}