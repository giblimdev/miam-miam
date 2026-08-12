//@ /stores/useSiteStore.ts
/*
 role : Store Zustand global pour le site actuellement sélectionné dans l'admin.
        Alimenté par SiteManager.tsx (sélection automatique à la création) et,
        à terme, par un composant de sélection manuelle (à venir).
 useBy : app/admin/siteManager/SiteManager.tsx
*/

import { create } from 'zustand';

interface SiteStore {
  selectedSiteId: string | null;
  selectedSiteName: string | null;
  setSelectedSite: (id: string | null, name?: string | null) => void;
}

export const useSiteStore = create<SiteStore>((set) => ({
  selectedSiteId: null,
  selectedSiteName: null,
  setSelectedSite: (id, name = null) =>
    set({ selectedSiteId: id, selectedSiteName: name }),
}));