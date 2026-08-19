//@ /stores/useProductStore.ts
/*
 role : Store Zustand gérant l'ID et le nom du produit sélectionné.
 import: create depuis zustand
 useBy : ProductSelector, ShowsStores, tout composant ayant besoin du produit courant.
*/

import { create } from "zustand";

interface ProductStoreState {
  selectedProductId: string | null;
  selectedProductName: string | null;
  setSelectedProduct: (id: string | null, name?: string | null) => void;
  reset: () => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  selectedProductId: null,
  selectedProductName: null,
  setSelectedProduct: (id, name = null) =>
    set({ selectedProductId: id, selectedProductName: name }),
  reset: () => set({ selectedProductId: null, selectedProductName: null }),
}));
