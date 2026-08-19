//@ /app/b2b/productools/page.tsx
/*
 role : Page principale du Product Studio pour les produits B2B. Permet de sélectionner un produit et d'accéder à une suite d'outils d'édition 
 (identité, catégories, spécifications, nutrition, visuels, prix, relations commerciales, options, menu, génération de nom). 
 Chaque outil est accessible via un lien direct vers sa propre page (ex: /b2b/productools/IdentityForge).
 import: React, framer-motion (motion), composants UI (Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton) 
 de shadcn/ui, icônes lucide-react, stores (useProductStore, useProductStudioStore), composants métier 
 (ProductSelector, ShowsStores, IdentityForge, CategoryQuest, Specmacker, NutriScoreLab, VisualDeck, PriceAlchemist, 
 BetterSell, OptionForge, MenuBuilder, NameCrafter - importés depuis leurs dossiers respectifs ./IdentityForge/page etc.), 
 toast de sonner, Link de next/link.
 props transmise :[] (aucune, le composant est une page)
 props recus [] (aucune)
 useBy : Next.js App Router (page correspondant à la route `/b2b/productools`)
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : La page affiche une barre de navigation avec des boutons de navigation entre produits (non implémentés) et un sélecteur de produit. Elle affiche ensuite une grille d'outils (TOOLS) ; chaque outil est une carte cliquable qui redirige vers une page dédiée à l'outil via un composant Link de Next.js. Le composant utilise `useProductStore` pour l'ID du produit sélectionné et `useProductStudioStore` pour initialiser/réinitialiser l'état de l'outil (bien que l'effet de chargement soit vide, il est prévu pour une future implémentation).
 - Choix techniques : Composant client (`use client`) car il utilise des hooks React (useState, useEffect) et des interactions utilisateur. Utilisation de Zustand pour la gestion d'état global (stores). Les animations sont gérées par framer-motion (entrées, hover, tap). Les composants UI proviennent de shadcn/ui. La navigation est assurée par `next/link` pour une expérience SPA.
 - Flux de données : Le composant reçoit `selectedProductId` et `selectedProductName` depuis le store. Il utilise `initFromProduct` et `reset` du store `useProductStudioStore` pour préparer l'édition (logique à implémenter dans les pages filles). La navigation entre produits est une fonction factice (toast). Les pages filles récupéreront l'ID du produit depuis le store.
 - Interactions UX : Animations d'entrée sur le titre et les sections, animations de survol et de tap sur les cartes d'outils. Gestion de l'état de chargement (skeleton) lorsque le produit est en cours de chargement (actuellement non implémenté). Les erreurs sont gérées via des toasts (à implémenter).
*/

/*IMPERATIF : 
architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- @/app/b2b/productools/page.tsx (ce fichier)
- @/components/ShowStore.tsx
- @/components/ProductSelector.tsx
- @/stores/useProductStore.ts
- @/stores/useProductStudioStore.ts
- @/actions/productManager.ts (contient getProductById)
- @/app/b2b/productTools/identityForge/page.tsx
- @/app/b2b/productTools/categoryQuest/page.tsx
- @/app/b2b/productTools/specmacker/page.tsx
- @/app/b2b/productTools/nutriScoreLab/page.tsx
- @/app/b2b/productTools/visualDeck/page.tsx
- @/app/b2b/productTools/priceAlchemist/page.tsx
- @/app/b2b/productTools/betterSell/page.tsx
- @/app/b2b/productTools/optionForge/page.tsx
- @/app/b2b/productTools/menuBuilder/page.tsx
- @/app/b2b/productTools/nameCrafter/page.tsx
*/

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  Tag,
  Ruler,
  Apple,
  Image,
  DollarSign,
  ShoppingBag,
  Settings,
  Utensils,
  Sparkles,
} from "lucide-react";
import { useProductStore } from "@/stores/useProductIdStore";
import { useProductStudioStore } from "@/stores/useProductStudioStore";
import { getProductById } from "@/actions/productManager";
import { ProductSelector } from "@/components/ProductSelector";
import { ShowsStores } from "@/components/ShowStore";
import { toast } from "sonner";
import DetailProduct from "@/components/DetailProduct";

// ============================================================
// Types
// ============================================================
export interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  path: string; // Chemin relatif pour la navigation (ex: "IdentityForge")
}

// ============================================================
// Configuration des outils (exportée pour réutilisation)
// ============================================================
export const TOOLS: Tool[] = [
  {
    id: "identity",
    label: "Identity Forge",
    icon: <Tag className="h-6 w-6" />,
    description:
      "Construire l’identité de base du produit : nom, slug, description, prix, marque, ordre d’affichage.",
    path: "/productTools/identityForge",
  },
  {
    id: "categories",
    label: "Category Quest",
    icon: <Package className="h-6 w-6" />,
    description:
      "Classer le produit dans une ou plusieurs catégories, gérer les sous‑catégories et l’ordre d’affichage. Créer, modifier, supprimer des catégories et assigner/désassigner le produit.",
    path: "/productTools/categoryQuest",
  },
  {
    id: "specs",
    label: "Specmacker",
    icon: <Ruler className="h-6 w-6" />,
    description:
      "Construire les caractéristiques techniques/commerciales du produit : poids, volume, dimensions, conservation, matière, température, etc. Gestion dynamique label / value / unit.",
    path: "/productTools/specmacker",
  },
  {
    id: "nutrition",
    label: "Nutri & Score Lab",
    icon: <Apple className="h-6 w-6" />,
    description:
      "Gérer tout le profil santé/qualité du produit : allergènes, informations nutritionnelles, Nutri‑Score et autres scores composites (éco‑score, note qualité).",
    path: "/productTools/nutriScoreLab",
  },
  {
    id: "visuals",
    label: "Visual Deck",
    icon: <Image className="h-6 w-6" />,
    description:
      "Construire l’identité visuelle : image principale, galerie, ordre des visuels, aperçu. Les visuels alimentent directement la vignette et la présentation détaillée.",
    path: "/productTools/visualDeck",
  },
  {
    id: "price",
    label: "Price Alchemist",
    icon: <DollarSign className="h-6 w-6" />,
    description:
      "Calculer le prix de revient puis proposer un prix de vente à partir des coûts d’achat, ingrédients, temps de préparation/cuisson et conditionnement.",
    path: "/productTools/priceAlchemist",
  },
  {
    id: "upsell",
    label: "BetterSell",
    icon: <ShoppingBag className="h-6 w-6" />,
    description:
      "Construire les relations commerciales entre produits : upsell, cross‑sell, accessoire, recommandation, alternative, avec ordre de priorité.",
    path: "/productTools/betterSell",
  },
  {
    id: "options",
    label: "Option Forge",
    icon: <Settings className="h-6 w-6" />,
    description:
      "Construire les personnalisations du produit : groupes d’options, choix, suppléments de prix et allergènes liés aux options.",
    path: "OptionForge",
  },
  {
    id: "menu",
    label: "Menu Builder",
    icon: <Utensils className="h-6 w-6" />,
    description:
      "Construire un menu à partir de sections et de produits existants. Gestion des sélections min/max et de l’ordre.",
    path: "MenuBuilder",
  },
  {
    id: "name",
    label: "Name Crafter",
    icon: <Sparkles className="h-6 w-6" />,
    description:
      "Générer/proposer automatiquement des noms à partir des catégories, spécifications et règles de nommage. Prévisualisation en temps réel et validation manuelle.",
    path: "NameCrafter",
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ProductStudioPage() {
  const { selectedProductId, selectedProductName } = useProductStore();
  const { initFromProduct, reset } = useProductStudioStore();

  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Chargement du produit complet lorsque l'ID change (à compléter)
  useEffect(() => {
    const loadProduct = async () => {
      if (!selectedProductId) {
        reset();
        setIsLoadingProduct(false);
        return;
      }
      // Ici, appeler getProductById et initialiser le store
      // setIsLoadingProduct(true);
      // const product = await getProductById(selectedProductId);
      // initFromProduct(product);
      // setIsLoadingProduct(false);
    };

    loadProduct();
  }, [selectedProductId, initFromProduct, reset]);

  /**
   * Gère la navigation entre produits (fonctionnalité non implémentée).
   */
  const handleNavigate = (direction: "first" | "prev" | "next" | "last") => {
    toast.info("Navigation entre produits (à implémenter)");
  };

  // ============================================================
  // Rendu
  // ============================================================

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-extrabold text-slate-900">
          Product Studio
        </h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="mt-4 h-64 w-full max-w-3xl rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ShowsStores state="product" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-4xl font-extrabold text-slate-900"
      >
        Product Studio
      </motion.h1>

      <div className="space-y-8">
        {/* ================================ */}
        {/* Barre de navigation              */}
        {/* ================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigate("first")}
              aria-label="Premier produit"
            >
              <ChevronsLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigate("prev")}
              aria-label="Produit précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigate("next")}
              aria-label="Produit suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigate("last")}
              aria-label="Dernier produit"
            >
              <ChevronsRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Sélecteur de produit directement affiché */}
          <ProductSelector className="min-w-[300px] flex-1" />
        </motion.div>
        <div>
          <DetailProduct />
        </div>

        {/* ================================ */}
        {/* Grille d'outils avec liens       */}
        {/* ================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="mb-5 text-2xl font-bold text-slate-900">
            Outils d’édition
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link href={`.${tool.path}`} className="block h-full">
                  <Card className="transition-all duration-200 border-0 shadow-md hover:shadow-xl rounded-2xl overflow-hidden h-full cursor-pointer bg-white">
                    <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-slate-100">
                      <div className="rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 p-3 text-orange-700">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Outil
                      </span>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-lg font-bold text-slate-900 mb-2">
                        {tool.label}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-700 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
