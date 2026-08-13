//@ /stores/useProductStudioStore.ts

/*
 role : Store Zustand gérant une copie locale de travail du produit (éditable) avec ses relations.
        Permet des modifications en temps réel avant sauvegarde via saveProduct.

        ⚠️ Correction vs version précédente :
        1. `ProductWithRelations` est importé depuis `@/actions/productManager` (source unique de
           vérité), pas depuis `storeProductStore` qui ne le ré-exportait pas — l'import précédent
           aurait échoué à la compilation.
        2. Le schema.prisma a été mis à jour avec des noms de relations conventionnels
           (camelCase, singulier/pluriel selon la cardinalité) : `productAllergens`,
           `productScores`, `nutritionalInfo`, `optionGroups` (avec `options` imbriqué), `menu`
           (avec `menuSections` / `menuSectionItems` imbriqués), et `gallery.images`.
        3. Les types des relations imbriquées (groupe d'options, option, section de menu...) ne
           sont plus reconstruits à la main avec les types Prisma bruts (`Option`, `OptionGroup`...).
           Un `Option` "brut" n'a pas `optionAllergens` par exemple, alors que le `PRODUCT_INCLUDE`
           de la server action l'y ajoute — ce qui causait un mismatch TypeScript à l'assignation
           dans `set()`. On dérive donc ces formes directement de `ProductWithRelations` avec des
           types indexés : elles restent exactes même si `PRODUCT_INCLUDE` évolue plus tard.

 import : { create } depuis zustand ; Product (types Prisma) pour les champs scalaires ;
           ProductWithRelations depuis @/actions/productManager
 props transmise :[]
 props recus : []
 useBy : tous les outils d'édition (IdentityForge, CategoryQuest, etc.) et ProductDisplay.
*/

import { create } from 'zustand';
import type { Product } from '@/lib/generated/prisma/client';
import type { ProductWithRelations } from '@/actions/productManager';

// Types dérivés de ProductWithRelations : toujours en phase avec PRODUCT_INCLUDE,
// jamais besoin de les retoucher séparément si l'include change.
type CategoryAssignment = ProductWithRelations['categoryAssignments'][number];
type ProductSpecItem = ProductWithRelations['productSpecs'][number];
type AllergenItem = ProductWithRelations['productAllergens'][number];
type ScoreItem = ProductWithRelations['productScores'][number];
type NutritionalInfoItem = ProductWithRelations['nutritionalInfo'];
type OptionGroupItem = ProductWithRelations['optionGroups'][number];
type OptionItem = OptionGroupItem['options'][number];
type MenuItem = NonNullable<ProductWithRelations['menu']>;
type GalleryItem = ProductWithRelations['gallery'];

// Type pour l'état du store d'édition
interface ProductStudioState {
  product: ProductWithRelations | null; // copie locale
  // Actions
  initFromProduct: (product: ProductWithRelations) => void;
  // Mise à jour des champs scalaires
  updateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
  // Relations
  addCategoryAssignment: (assignment: CategoryAssignment) => void;
  removeCategoryAssignment: (categoryId: string) => void;
  addProductSpec: (spec: ProductSpecItem) => void;
  removeProductSpec: (specId: string) => void;
  updateProductSpec: (specId: string, data: Partial<ProductSpecItem>) => void;
  addAllergen: (allergen: AllergenItem) => void;
  removeAllergen: (allergenId: string) => void;
  addScore: (score: ScoreItem) => void;
  removeScore: (scoreId: string) => void;
  updateScore: (scoreId: string, data: Partial<ScoreItem>) => void;
  setNutritionalInfo: (info: NutritionalInfoItem) => void;
  addOptionGroup: (group: OptionGroupItem) => void;
  removeOptionGroup: (groupId: string) => void;
  updateOptionGroup: (groupId: string, data: Partial<OptionGroupItem>) => void;
  addOptionToGroup: (groupId: string, option: OptionItem) => void;
  removeOptionFromGroup: (groupId: string, optionId: string) => void;
  updateOption: (groupId: string, optionId: string, data: Partial<OptionItem>) => void;
  setMenu: (menu: MenuItem | null) => void;
  setGallery: (gallery: GalleryItem) => void;
  // Réinitialisation complète
  reset: () => void;
}

export const useProductStudioStore = create<ProductStudioState>((set) => ({
  product: null,

  initFromProduct: (product) => {
    // On clone profondément pour éviter les références vers l'objet original
    const clonedProduct = JSON.parse(JSON.stringify(product));
    set({ product: clonedProduct });
  },

  reset: () => set({ product: null }),

  updateField: (field, value) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          [field]: value,
        },
      };
    });
  },

  // Catégories
  addCategoryAssignment: (assignment) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          categoryAssignments: [...state.product.categoryAssignments, assignment],
        },
      };
    });
  },

  removeCategoryAssignment: (categoryId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          categoryAssignments: state.product.categoryAssignments.filter(
            (a) => a.categoryProductId !== categoryId
          ),
        },
      };
    });
  },

  // Spécifications
  addProductSpec: (spec) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productSpecs: [...state.product.productSpecs, spec],
        },
      };
    });
  },

  removeProductSpec: (specId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productSpecs: state.product.productSpecs.filter((s) => s.id !== specId),
        },
      };
    });
  },

  updateProductSpec: (specId, data) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productSpecs: state.product.productSpecs.map((s) =>
            s.id === specId ? { ...s, ...data } : s
          ),
        },
      };
    });
  },

  // Allergènes (champ Product.productAllergens)
  addAllergen: (allergen) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productAllergens: [...state.product.productAllergens, allergen],
        },
      };
    });
  },

  removeAllergen: (allergenId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productAllergens: state.product.productAllergens.filter((a) => a.id !== allergenId),
        },
      };
    });
  },

  // Scores (champ Product.productScores)
  addScore: (score) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productScores: [...state.product.productScores, score],
        },
      };
    });
  },

  removeScore: (scoreId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productScores: state.product.productScores.filter((s) => s.id !== scoreId),
        },
      };
    });
  },

  updateScore: (scoreId, data) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          productScores: state.product.productScores.map((s) =>
            s.id === scoreId ? { ...s, ...data } : s
          ),
        },
      };
    });
  },

  // Nutrition (champ Product.nutritionalInfo)
  setNutritionalInfo: (info) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          nutritionalInfo: info,
        },
      };
    });
  },

  // Options (champ Product.optionGroups, chaque groupe a un champ options)
  addOptionGroup: (group) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: [...state.product.optionGroups, group],
        },
      };
    });
  },

  removeOptionGroup: (groupId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: state.product.optionGroups.filter((g) => g.id !== groupId),
        },
      };
    });
  },

  updateOptionGroup: (groupId, data) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: state.product.optionGroups.map((g) =>
            g.id === groupId ? { ...g, ...data } : g
          ),
        },
      };
    });
  },

  addOptionToGroup: (groupId, option) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: state.product.optionGroups.map((g) =>
            g.id === groupId ? { ...g, options: [...g.options, option] } : g
          ),
        },
      };
    });
  },

  removeOptionFromGroup: (groupId, optionId) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: state.product.optionGroups.map((g) =>
            g.id === groupId ? { ...g, options: g.options.filter((o) => o.id !== optionId) } : g
          ),
        },
      };
    });
  },

  updateOption: (groupId, optionId, data) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          optionGroups: state.product.optionGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  options: g.options.map((o) => (o.id === optionId ? { ...o, ...data } : o)),
                }
              : g
          ),
        },
      };
    });
  },

  // Menu (champ Product.menu, relation 1-1)
  setMenu: (menu) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          menu,
        },
      };
    });
  },

  // Galerie (relation polymorphique, champ `gallery` ajouté manuellement au type
  // dans productManager.ts — pas un champ Prisma natif de Product)
  setGallery: (gallery) => {
    set((state) => {
      if (!state.product) return state;
      return {
        product: {
          ...state.product,
          gallery,
        },
      };
    });
  },
}));