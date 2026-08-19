//@ /components/VignetteProduct.tsx

/*
  Rôle :
  Composant d'affichage d'une vignette produit.

  Affiche :
  - Image à droite
  - Nom et description à gauche
  - Note et nombre d'avis
  - Prix
  - Badge "Menu"

  Particularités :
  - Gestion EUR / COP
  - Formatage des prix
  - Rating accepté sur 5 ou directement en pourcentage
  - Image facultative
  - Logique métier séparée de la présentation
  - Un seul return par composant
  - Aucun JSX stocké dans une variable
*/

"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// ============================================================
// Types
// ============================================================

export interface VignetteProductProps {
  name: string;
  description?: string;
  price: number;
  currency?: "EUR" | "COP" | string;
  image: string | null;
  isMenu?: boolean;
  rating?: number;
  reviewCount?: number;
}

// ============================================================
// Logique pure
// ============================================================

/**
 * Formate le prix selon la devise.
 *
 * COP :
 * 25000 → "$ 25000"
 *
 * EUR :
 * 12.5 → "12,50 €"
 *
 * Autres devises :
 * utilisation du formatage Intl standard.
 */
function formatPrice(price: number, currency: string): string {
  if (!Number.isFinite(price)) {
    return `0 ${currency}`;
  }

  // ----------------------------------------------------------
  // Peso colombien
  // ----------------------------------------------------------

  if (currency === "COP") {
    return `$ ${price.toLocaleString("co-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: false,
    })}`;
  }

  // ----------------------------------------------------------
  // Euro
  // ----------------------------------------------------------

  if (currency === "EUR") {
    return `${price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    })} €`;
  }

  // ----------------------------------------------------------
  // Autres devises
  // ----------------------------------------------------------

  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

/**
 * Normalise une note.
 *
 * Le composant accepte :
 * - une note sur 5 : 0 → 5
 * - un pourcentage : 0 → 100
 *
 * Exemples :
 * 4     → 80
 * 4.5   → 90
 * 5     → 100
 * 80    → 80
 * 100   → 100
 */
function normalizeRating(rating: number): number {
  if (!Number.isFinite(rating)) {
    return 0;
  }

  if (rating <= 5) {
    return Math.min(100, Math.max(0, Math.round(rating * 20)));
  }

  return Math.min(100, Math.max(0, Math.round(rating)));
}

/**
 * Génère le texte alternatif de l'image.
 */
function getAltText(name: string): string {
  const cleanName = name.trim();

  return cleanName ? `Image du produit ${cleanName}` : "Image du produit";
}

/**
 * Nettoie le nombre d'avis.
 */
function normalizeReviewCount(reviewCount: number): number {
  if (!Number.isFinite(reviewCount)) {
    return 0;
  }

  return Math.max(0, Math.floor(reviewCount));
}

// ============================================================
// Composants de présentation
// ============================================================

/**
 * Image du produit.
 */
function ProductImage({
  image,
  altText,
}: {
  image: string | null;
  altText: string;
}) {
  return image ? (
    <Image
      src={image}
      alt={altText}
      fill
      sizes="128px"
      className="object-cover"
    />
  ) : (
    <div
      className="flex h-full w-full items-center justify-center
                 bg-gray-100 text-center text-sm text-gray-400"
    >
      Aucune image
    </div>
  );
}

/**
 * Affichage de la note.
 */
function RatingDisplay({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const displayRating = normalizeRating(rating);
  const displayReviewCount = normalizeReviewCount(reviewCount);

  return (
    <div className="flex items-center gap-1">
      <Star
        className="h-4 w-4 fill-yellow-400 text-yellow-400"
        aria-hidden="true"
      />

      <span className="text-sm font-medium text-gray-700">
        {displayRating}%
        <span className="ml-1 text-gray-400">
          ({displayReviewCount} {displayReviewCount === 1 ? "avis" : "avis"})
        </span>
      </span>
    </div>
  );
}

/**
 * Badge indiquant qu'un produit est un menu.
 */
function MenuBadge({ show }: { show: boolean }) {
  return show ? (
    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
      Menu
    </span>
  ) : null;
}

/**
 * Description du produit.
 */
function Description({ description }: { description?: string }) {
  const cleanDescription = description?.trim();

  return cleanDescription ? (
    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
      {cleanDescription}
    </p>
  ) : null;
}

// ============================================================
// Composant principal
// ============================================================

export function VignetteProduct({
  name,
  description,
  price,
  currency = "COP",
  image,
  isMenu = false,
  rating,
  reviewCount = 0,
}: VignetteProductProps) {
  // ----------------------------------------------------------
  // Données dérivées
  // ----------------------------------------------------------

  const displayName = name.trim() || "Nom du produit";

  const formattedPrice = formatPrice(price, currency);

  const altText = getAltText(displayName);

  // ----------------------------------------------------------
  // Rendu
  // ----------------------------------------------------------

  return (
    <Card
      className="
        h-[133px]
        w-[400px]
        overflow-hidden
        p-0
        shadow-md
      "
    >
      <CardContent className="h-full p-0">
        <div className="flex h-full flex-row-reverse">
          {/* ==================================================
              Image à droite
              ================================================== */}

          <div
            className="
              relative
              h-full
              w-32
              shrink-0
              overflow-hidden
              bg-gray-100
            "
          >
            <ProductImage image={image} altText={altText} />
          </div>

          {/* ==================================================
              Informations à gauche
              ================================================== */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
              justify-between
              p-3
            "
          >
            {/* ------------------------------------------------
                Informations principales
                ------------------------------------------------ */}

            <div className="min-w-0">
              {/* Nom */}

              <h3
                className="
                  truncate
                  text-base
                  font-bold
                  text-gray-900
                "
              >
                {displayName}
              </h3>

              {/* Description */}

              <Description description={description} />
            </div>
            {/* ------------------------------------------------
    Prix / Menu / Note
    ------------------------------------------------ */}

            <div className="mt-2 flex items-center gap-4 ">
              {/* Prix */}
              <span className="font-semibold text-gray-900">
                {formattedPrice}
              </span>

              {/* Menu */}
              <MenuBadge show={isMenu} />

              {/* Note */}
              {rating !== undefined && (
                <RatingDisplay rating={rating} reviewCount={reviewCount} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
/*
add boutton Link [id]/page.tsx
icone like ?
boutton add card
note composite ?
*/
