//@ /stores/useBrandStore.ts
/*
 role : Store Zustand global pour la marque actuellement sélectionnée.
        Permet à SiteManager (et d'autres modules) de savoir sur quelle marque
        filtrer leurs données, sans passer par les props ou l'URL.
 useBy : app/admin/siteManager/SiteManager.tsx, app/admin/brandManager/BrandManager.tsx
*/

import { create } from 'zustand';

interface BrandStore {
  selectedBrandId: string | null;
  selectedBrandName: string | null;
  setSelectedBrand: (id: string | null, name?: string | null) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  selectedBrandId: null,
  selectedBrandName: null,
  setSelectedBrand: (id, name = null) =>
    set({ selectedBrandId: id, selectedBrandName: name }),
}));