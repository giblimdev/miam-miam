//@ /components/ShowStore.tsx
/*
 role : Composant de debug qui affiche les noms/valeurs essentielles 
        des stores (brand, product, site) et de l'utilisateur via authClient.
 import :
   - authClient depuis @/lib/auth/auth-client
   - useBrandStore, useProductStore, useSiteStore
 props reçues :
   - state: 'product' | 'site'
 useBy : ProductStudioPage, ou toute page d'admin nécessitant un visuel rapide
         de l'état global.
*/

'use client';

import { authClient } from "@/lib/auth/auth-client";
import { useBrandStore } from '@/stores/useBrandStore';
import { useProductStore } from '@/stores/storeProductStore';
import { useSiteStore } from '@/stores/useSiteStore';

interface ShowStoreProps {
  state: 'product' | 'site';
}

export default function ShowStore({ state }: ShowStoreProps) {
  // 🔥 Utilisateur : via le hook natif de Better Auth
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Stores (brand, product, site)
  const selectedBrandName = useBrandStore((s) => s.selectedBrandName);
  const selectedBrandId = useBrandStore((s) => s.selectedBrandId);

  const selectedProduct = useProductStore((s) => s.selectedProduct);
  const selectedProductId = useProductStore((s) => s.selectedProductId);

  const selectedSiteName = useSiteStore((s) => s.selectedSiteName);
  const selectedSiteId = useSiteStore((s) => s.selectedSiteId);

  // Libellés
  const userName = user?.name || user?.email || user?.id || 
                   (isPending ? 'Chargement...' : 'Non connecté');
  const authStatus = user ? '✅ Authentifié' : '❌ Non authentifié';

  const brandLabel = selectedBrandName || selectedBrandId || 'Aucune marque';
  const productLabel = selectedProduct?.name || selectedProductId || 'Aucun produit';
  const siteLabel = selectedSiteName || selectedSiteId || 'Aucun site';

  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-slate-50 text-sm space-y-1 font-mono shadow-sm">
      <h4 className="font-bold text-gray-700 border-b pb-1 mb-2">🔍 État des stores</h4>

      <div className="grid grid-cols-[100px_1fr] gap-x-2">
        <span className="text-gray-500">User :</span>
        <span className="font-medium">
          {userName} <span className="text-xs text-gray-400">{authStatus}</span>
        </span>

        <span className="text-gray-500">Brand :</span>
        <span className="font-medium">{brandLabel}</span>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-1 mt-1">
        {state === 'product' ? (
          <div className="grid grid-cols-[100px_1fr] gap-x-2">
            <span className="text-gray-500">Product :</span>
            <span className="font-medium text-blue-600">{productLabel}</span>
          </div>
        ) : (
          <div className="grid grid-cols-[100px_1fr] gap-x-2">
            <span className="text-gray-500">Site :</span>
            <span className="font-medium text-green-600">{siteLabel}</span>
          </div>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-gray-400 pt-1">
        Mode : {state === 'product' ? '🛒 Produit' : '🌐 Site'}
      </div>
    </div>
  );
}