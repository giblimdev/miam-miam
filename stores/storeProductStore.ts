//@ /stores/storeProductStore.ts

/*
 role : Store Zustand gérant la sélection du produit courant (ID et données complètes) ainsi que l'état de chargement.

        ⚠️ Correction vs version précédente : le type `ProductWithRelations` n'est plus redéfini
        ici. Il est importé depuis `@/actions/productManager`, qui est la source unique de vérité
        pour la forme "produit + relations" (elle-même alignée sur schema.prisma, y compris la
        gestion de `gallery` qui est une relation polymorphe et n'existe pas nativement sur
        `Product` côté Prisma). Redéfinir ce type ici avec des noms différents (`productAllergens`,
        `optionGroups`, `menu.sections`, etc.) créait un second contrat de données qui divergeait
        silencieusement du premier — deux "vérités" différentes pour le même objet produit.

 import : { create } depuis zustand ; ProductWithRelations depuis @/actions/productManager
 props transmise :[]
 props recus : []
 useBy : ProductStudioPage, ProductSelector, tout composant ayant besoin du produit sélectionné.
*/

import { create } from 'zustand';
import type { ProductWithRelations } from '@/actions/productManager';

// Type pour l'état du store
interface ProductStoreState {
  selectedProductId: string | null;
  selectedProduct: ProductWithRelations | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setSelectedProductId: (id: string | null) => void;
  setSelectedProduct: (product: ProductWithRelations | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  selectedProductId: null,
  selectedProduct: null,
  isLoading: false,
  error: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ selectedProductId: null, selectedProduct: null, isLoading: false, error: null }),
}));