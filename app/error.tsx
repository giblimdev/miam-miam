//@/app/error.tsx
/*
 role : Gestion des erreurs inattendues dans les pages (error boundary).
        Propose un bouton "Réessayer" pour recharger la page.
 import: Button shadcn/ui, useEffect
 useBy : Toutes les pages en cas d'erreur de rendu
*/

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur vers un service de monitoring
    console.error('Erreur globale :', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icône d'erreur */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Une erreur est survenue
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}