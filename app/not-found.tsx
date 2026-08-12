//@/app/not-found.tsx
/*
 role : Page 404 personnalisée pour les routes inexistantes.
 import: Link, Button, lucide-react
 useBy : Toutes les routes non trouvées
*/

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icône 404 */}
        <div className="relative">
          <UtensilsCrossed className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl font-black text-slate-400 dark:text-slate-600">
              404
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page introuvable
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
          <Button variant="outline" >
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}