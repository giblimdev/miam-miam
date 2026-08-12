//@/app/loading.tsx
/*
 role : Affichage pendant le chargement des pages (suspense boundary global).
 import: Skeleton shadcn/ui
 useBy : Toutes les pages pendant leur chargement initial
*/

import { Skeleton } from '@/components/ui/skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo ou icône animée */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-3xl">🍔</span>
          </div>
        </div>

        {/* Skeletons */}
        <div className="space-y-3 w-64">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          Chargement en cours...
        </p>
      </div>
    </div>
  );
}