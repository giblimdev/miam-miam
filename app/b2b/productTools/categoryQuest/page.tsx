//@ /app/b2b/productTools/categoryQuest/page.tsx
/*
 role : Page de l’outil « Category Quest » permettant de gérer les catégories d’un produit sélectionné.
         Affiche le contexte utilisateur/marque/produit via le composant ShowsStores,
         offre un sélecteur de produit pour choisir le produit à éditer (ProductSelector),
         puis affiche le composant CategoryQuest pour assigner/désassigner des catégories.
 import: React, useState, useEffect, motion de framer-motion, composants UI (Card, Skeleton) de shadcn/ui,
         ShowsStores depuis @/components/ShowStore (ou @/components/showsStores/ShowsStores),
         ProductSelector depuis @/components/ProductSelector,
         CategoryQuest depuis @/components/productTools/CategoryQuest (ou ./CategoryQuest selon l’organisation),
         useProductStore depuis @/stores/useProductStore,
         useBrandStore depuis @/stores/useBrandStore (si besoin),
         toast de sonner.
 props transmise :[] (composant page)
 props recus [] (aucune)
 useBy : Next.js App Router (route /b2b/productTools/categoryQuest)
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : La page est un Client Component qui utilise les stores globaux pour obtenir l’ID du produit sélectionné.
   Elle affiche en permanence le fil d’Ariane contextuel (ShowsStores) et un sélecteur de produit.
   Le contenu principal (CategoryQuest) n’est rendu que si un produit est sélectionné, sinon un message d’invitation est affiché.
 - Choix techniques : Composant client pour utiliser les hooks Zustand et les interactions utilisateur.
   Les animations d’entrée sont gérées par framer-motion.
   La navigation entre les outils se fait via les liens de la page précédente, cette page ne gère pas la navigation interne.
 - Flux de données : Le store useProductStore fournit `selectedProductId` et `selectedProductName`.
   Le sélecteur de produit permet de modifier cette valeur via `setSelectedProduct`.
   CategoryQuest utilisera l’ID du produit pour charger ses catégories via une Server Action (à implémenter).
 - Interactions UX : Affichage d’un skeleton pendant le chargement initial.
   Lorsqu’aucun produit n’est sélectionné, un message incite l’utilisateur à en choisir un.
   Des toasts sont utilisés pour les retours d’action (ex. sauvegarde réussie).
*/

/* IMPERATIF :
architecture de l’ensemble des fichiers impliqués dans la feature Category Quest :
- /app/b2b/productTools/categoryQuest/page.tsx (ce fichier)
- /components/ShowStore.tsx (ou /components/showsStores/ShowsStores.tsx)
- /components/ProductSelector.tsx
- /components/productTools/CategoryQuest.tsx (ou /app/b2b/productTools/categoryQuest/CategoryQuest.tsx)
- /stores/useProductStore.ts
- /stores/useBrandStore.ts
- /stores/useProductStudioStore.ts (pour l’état de l’outil)
- /actions/productManager.ts (pour getProducts, etc.)
- /actions/categoryManager.ts (pour les opérations sur les catégories)
*/

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowsStores } from "@/components/ShowStore"; // Ajustez le chemin si nécessaire
import { ProductSelector } from "@/components/ProductSelector"; // Ajustez le chemin si nécessaire
import { useProductStore } from "@/stores/useProductIdStore";
import { toast } from "sonner";

// ============================================================
// Composant principal
// ============================================================
export default function CategoryQuestPage() {
  const { selectedProductId, selectedProductName } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);

  // Effet pour réagir au changement de produit (ex. charger les données)
  useEffect(() => {
    if (selectedProductId) {
      // On pourrait charger des données spécifiques à l’outil ici
      // via useProductStudioStore par exemple
      setIsLoading(false);
    }
  }, [selectedProductId]);

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ShowsStores state="product" />
        <div className="mt-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d’Ariane contextuel */}
      <ShowsStores state="product" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6 space-y-6"
      >
        {/* En-tête de la page */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Category Quest</h1>
          <span className="text-sm text-muted-foreground">
            {selectedProductName
              ? `Produit : ${selectedProductName}`
              : "Aucun produit sélectionné"}
          </span>
        </div>

        {/* Sélecteur de produit */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Choisir un produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSelector className="max-w-md" />
          </CardContent>
        </Card>

        {/* Contenu de l’outil CategoryQuest */}
      </motion.div>
    </div>
  );
}
