// @/stores/useProductVignetteStore.ts

/*
  Rôle :
  Store Zustand dédié aux données d'une vignette produit.

  Données gérées :
  - name
  - description
  - price
  - currency : COP / EUR
  - isMenu
  - image
  - rating
  - reviewCount

  Le store constitue la source de vérité des données utilisées
  par VignetteProduct.

  Architecture :
  - Zustand
  - middleware devtools
  - aucune persistance
  - aucune requête API directement dans le store

  Flux :

      Produit sélectionné
             │
             ▼
      productManager
             │
             ▼
       setFromProduct()
             │
             ▼
    ProductVignetteStore
             │
       ┌─────┴──────────────┐
       ▼                    ▼
   IdentityForge       VignetteProduct
   formulaire             aperçu
                              │
                              ▼
                        ⭐ rating
                        avis reviewCount

  Fichiers concernés :
  - /stores/useProductVignetteStore.ts
  - /stores/useProductIdStore.ts
  - /actions/productManager.ts
  - /app/b2b/productTools/identityForge/page.tsx
  - /components/VignetteProduct.tsx
*/

// ============================================================
// Imports
// ============================================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============================================================
// Types
// ============================================================

/**
 * Devises supportées par la vignette.
 */
export type ProductVignetteCurrency = "COP" | "EUR";

/**
 * État de la vignette produit.
 */
export interface ProductVignetteState {
  /** Nom du produit */
  name: string;

  /** Description du produit */
  description: string;

  /**
   * Prix du produit dans la devise sélectionnée.
   *
   * Exemple :
   * EUR → 12.50
   * COP → 25000
   */
  price: number;

  /** Devise du prix */
  currency: ProductVignetteCurrency;

  /** Indique si le produit est un menu */
  isMenu: boolean;

  /** URL ou chemin de l'image */
  image: string | null;

  /**
   * Note du produit.
   *
   * Peut être exprimée :
   * - sur 5 : 0 → 5
   * - en pourcentage : 0 → 100
   *
   * VignetteProduct normalise ensuite l'affichage.
   */
  rating: number;

  /** Nombre d'avis */
  reviewCount: number;
}

// ============================================================
// Produit source
// ============================================================

/**
 * Structure minimale nécessaire pour initialiser
 * une vignette à partir d'un produit.
 *
 * Les propriétés optionnelles permettent de travailler
 * avec différents retours API / Prisma.
 */
export interface ProductVignetteSource {
  name: string;

  description?: string | null;

  price: number;

  currency?: string | null;

  isMenu?: boolean | null;

  image?: string | null;

  rating?: number | null;

  reviewCount?: number | null;
}

// ============================================================
// Actions
// ============================================================

export interface ProductVignetteActions {
  /**
   * Définit les données principales de la vignette.
   *
   * name et price sont obligatoires.
   */
  setVignette: (
    data: Partial<ProductVignetteState> & {
      name: string;
      price: number;
    },
  ) => void;

  /**
   * Mise à jour partielle.
   */
  updateVignette: (data: Partial<ProductVignetteState>) => void;

  /**
   * Réinitialise la vignette.
   */
  resetVignette: () => void;

  /**
   * Initialise la vignette depuis un produit.
   */
  setFromProduct: (product: ProductVignetteSource) => void;
}

// ============================================================
// Store complet
// ============================================================

export type ProductVignetteStore = ProductVignetteState &
  ProductVignetteActions;

// ============================================================
// Valeurs par défaut
// ============================================================

export const PRODUCT_VIGNETTE_DEFAULTS: ProductVignetteState = {
  name: "Exemple de produit",

  description: "Un très bon plat à base d'excellents ingrédients.",

  price: 18700,

  currency: "COP",

  isMenu: false,

  image: "/defaultVignette.png",

  rating: 4.7,

  reviewCount: 5,
};

// ============================================================
// Fonctions de normalisation
// ============================================================

/**
 * Normalise la devise.
 *
 * Seules COP et EUR sont autorisées.
 */
function normalizeCurrency(currency?: string | null): ProductVignetteCurrency {
  if (currency === "COP") {
    return "COP";
  }

  if (currency === "EUR") {
    return "EUR";
  }

  return "EUR";
}

/**
 * Normalise le nom.
 */
function normalizeName(name?: string | null): string {
  const value = name?.trim();

  return value || "Nom du produit";
}

/**
 * Normalise la description.
 */
function normalizeDescription(description?: string | null): string {
  return description?.trim() || "";
}

/**
 * Normalise le prix.
 */
function normalizePrice(price: number): number {
  if (!Number.isFinite(price)) {
    return 0;
  }

  return Math.max(0, price);
}

/**
 * Normalise l'image.
 */
function normalizeImage(image?: string | null): string | null {
  const value = image?.trim();

  return value || null;
}

/**
 * Normalise le type menu.
 */
function normalizeIsMenu(isMenu?: boolean | null): boolean {
  return Boolean(isMenu);
}

/**
 * Normalise la note.
 *
 * Le store accepte :
 *
 * 0 → 5
 * ou
 * 0 → 100
 *
 * Exemple :
 *
 * 4.5 → 4.5
 * 90  → 90
 *
 * La valeur est bornée entre 0 et 100.
 *
 * VignetteProduct se charge ensuite de convertir
 * une note sur 5 en pourcentage pour l'affichage.
 */
function normalizeRating(rating?: number | null): number {
  if (rating === undefined || rating === null || !Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(100, Math.max(0, rating));
}

/**
 * Normalise le nombre d'avis.
 */
function normalizeReviewCount(reviewCount?: number | null): number {
  if (
    reviewCount === undefined ||
    reviewCount === null ||
    !Number.isFinite(reviewCount)
  ) {
    return 0;
  }

  return Math.max(0, Math.floor(reviewCount));
}

// ============================================================
// Store Zustand
// ============================================================

export const useProductVignetteStore = create<ProductVignetteStore>()(
  devtools(
    (set) => ({
      // ======================================================
      // État initial
      // ======================================================

      ...PRODUCT_VIGNETTE_DEFAULTS,

      // ======================================================
      // setVignette
      // ======================================================

      setVignette: (data) => {
        set(
          {
            name: normalizeName(data.name),

            description:
              data.description !== undefined
                ? normalizeDescription(data.description)
                : "",

            price: normalizePrice(data.price),

            currency:
              data.currency !== undefined
                ? normalizeCurrency(data.currency)
                : "EUR",

            isMenu:
              data.isMenu !== undefined ? normalizeIsMenu(data.isMenu) : false,

            image: data.image !== undefined ? normalizeImage(data.image) : null,

            rating:
              data.rating !== undefined ? normalizeRating(data.rating) : 0,

            reviewCount:
              data.reviewCount !== undefined
                ? normalizeReviewCount(data.reviewCount)
                : 0,
          },
          false,
          "setVignette",
        );
      },

      // ======================================================
      // updateVignette
      // ======================================================

      updateVignette: (data) => {
        set(
          (state) => ({
            name:
              data.name !== undefined ? normalizeName(data.name) : state.name,

            description:
              data.description !== undefined
                ? normalizeDescription(data.description)
                : state.description,

            price:
              data.price !== undefined
                ? normalizePrice(data.price)
                : state.price,

            currency:
              data.currency !== undefined
                ? normalizeCurrency(data.currency)
                : state.currency,

            isMenu:
              data.isMenu !== undefined
                ? normalizeIsMenu(data.isMenu)
                : state.isMenu,

            image:
              data.image !== undefined
                ? normalizeImage(data.image)
                : state.image,

            rating:
              data.rating !== undefined
                ? normalizeRating(data.rating)
                : state.rating,

            reviewCount:
              data.reviewCount !== undefined
                ? normalizeReviewCount(data.reviewCount)
                : state.reviewCount,
          }),
          false,
          "updateVignette",
        );
      },

      // ======================================================
      // resetVignette
      // ======================================================

      resetVignette: () => {
        set(
          {
            ...PRODUCT_VIGNETTE_DEFAULTS,
          },
          false,
          "resetVignette",
        );
      },

      // ======================================================
      // setFromProduct
      // ======================================================

      setFromProduct: (product) => {
        set(
          {
            name: normalizeName(product.name),

            description: normalizeDescription(product.description),

            price: normalizePrice(product.price),

            currency: normalizeCurrency(product.currency),

            isMenu: normalizeIsMenu(product.isMenu),

            image: normalizeImage(product.image),

            rating: normalizeRating(product.rating),

            reviewCount: normalizeReviewCount(product.reviewCount),
          },
          false,
          "setFromProduct",
        );
      },
    }),

    {
      name: "ProductVignetteStore",
    },
  ),
);
