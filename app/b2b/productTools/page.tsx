//@ /app/b2b/productionTool/page.tsx
/*
 role : Page principale du Product Studio, permettant de gérer l’édition complète d’un produit via une série d’outils modulaires.
        La page présente les outils sous forme de cartes ; un clic ouvre l’outil dans une modale.
 import : 
   - Composants UI : Button, Card, Dialog, Skeleton (shadcn/ui)
   - Icônes : lucide-react
   - Hooks : useState, useEffect (React)
   - Stores : useProductStore (sélection du produit), useProductStudioStore (copie locale en édition)
   - Composants métier : ProductSelector (pour changer de produit)
   - Actions serveur : saveProduct (Server Action)
   - Animation : framer-motion (motion, AnimatePresence)
   - Utilitaires : cn (clsx + tailwind-merge)
   - Composant de debug : ShowStore
 props transmise :[]
 props recus : []
 useBy : Layout principal de l’espace B2B, accès via le menu de navigation.
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : 
   1. Barre de navigation : affiche le produit sélectionné, permet de naviguer entre les produits et d’en sélectionner un autre via ProductSelector.
   2. Grille d’outils : liste des outils disponibles sous forme de cartes cliquables ; chaque carte ouvre une modale contenant le composant dédié.
   3. Bouton d’enregistrement : déclenche la sauvegarde du produit via une Server Action.
 - Choix techniques : 
   - Composant client (‘use client’) pour l’interactivité.
   - Stores Zustand pour la gestion d’état.
   - Modales shadcn/ui.
   - Animations framer-motion pour les micro-interactions.
 - Flux de données : 
   - Le produit sélectionné est stocké dans useProductStore. useProductStudioStore initialise une copie locale pour l’édition.
   - Les outils modifient la copie locale via les actions du store.
   - La sauvegarde envoie la copie locale au serveur.
 - Interactions UX :
   - Les cartes d'outils sont désactivées si aucun produit n'est sélectionné.
   - Le bouton Enregistrer est désactivé tant qu'il n'y a pas de produit à sauvegarder.
   - Animations de hover, de focus et de transition sur les cartes.
*/

/* IMPERATIF : 
architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers
- /app/b2b/productionTool/page.tsx (ce fichier)
- /stores/storeProductStore.ts
- /stores/useProductStudioStore.ts
- /ProductSelector.tsx
- /IdentityForge.tsx
- /CategoryQuest.tsx
- /Specmacker.tsx
- /NutriScoreLab.tsx
- /VisualDeck.tsx
- /PriceAlchemist.tsx
- /BetterSell.tsx
- /OptionForge.tsx
- /MenuBuilder.tsx
- /NameCrafter.tsx
- /actions/productManager.ts (pour saveProduct, getProducts)
*/

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Save,
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
  Loader2,
} from 'lucide-react';
import { useProductStore } from '@/stores/storeProductStore';
import { useProductStudioStore } from '@/stores/useProductStudioStore';
import { ProductSelector } from '@/components/ProductSelector';
import { IdentityForge } from './IdentityForge';
import { CategoryQuest } from './CategoryQuest';
import { Specmacker } from './Specmacker';
import { NutriScoreLab } from './NutriScoreLab';
import { VisualDeck } from './VisualDeck';
import { PriceAlchemist } from './PriceAlchemist';
import { BetterSell } from './BetterSell';
import { OptionForge } from './OptionForge';
import { MenuBuilder } from './MenuBuilder';
import { NameCrafter } from './NameCrafter';
import { saveProduct } from '@/actions/productManager';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ShowStore from '@/components/ShowStore';

// ============================================================
// Types
// ============================================================
interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  component: React.ComponentType<{ onClose?: () => void }>;
}

// ============================================================
// Configuration des outils (descriptions enrichies)
// ============================================================
const TOOLS: Tool[] = [
  {
    id: 'identity',
    label: 'Identity Forge',
    icon: <Tag className="h-6 w-6" />,
    description:
      'Construire l’identité de base du produit : nom, slug, description, prix, disponibilité, marque, type menu, ordre d’affichage. Gestion du Nutri‑Score directement dans ce formulaire.',
    component: IdentityForge,
  },
  {
    id: 'categories',
    label: 'Category Quest',
    icon: <Package className="h-6 w-6" />,
    description:
      'Classer le produit dans une ou plusieurs catégories, gérer les sous‑catégories et l’ordre d’affichage. Créer, modifier, supprimer des catégories et assigner/désassigner le produit.',
    component: CategoryQuest,
  },
  {
    id: 'specs',
    label: 'Specmacker',
    icon: <Ruler className="h-6 w-6" />,
    description:
      'Construire les caractéristiques techniques/commerciales du produit : poids, volume, dimensions, conservation, matière, température, etc. Gestion dynamique label / value / unit.',
    component: Specmacker,
  },
  {
    id: 'nutrition',
    label: 'Nutri & Score Lab',
    icon: <Apple className="h-6 w-6" />,
    description:
      'Gérer tout le profil santé/qualité du produit : allergènes, informations nutritionnelles, Nutri‑Score et autres scores composites (éco‑score, note qualité).',
    component: NutriScoreLab,
  },
  {
    id: 'visuals',
    label: 'Visual Deck',
    icon: <Image className="h-6 w-6" />,
    description:
      'Construire l’identité visuelle : image principale, galerie, ordre des visuels, aperçu. Les visuels alimentent directement la vignette et la présentation détaillée.',
    component: VisualDeck,
  },
  {
    id: 'price',
    label: 'Price Alchemist',
    icon: <DollarSign className="h-6 w-6" />,
    description:
      'Calculer le prix de revient puis proposer un prix de vente à partir des coûts d’achat, ingrédients, temps de préparation/cuisson et conditionnement.',
    component: PriceAlchemist,
  },
  {
    id: 'upsell',
    label: 'BetterSell',
    icon: <ShoppingBag className="h-6 w-6" />,
    description:
      'Construire les relations commerciales entre produits : upsell, cross‑sell, accessoire, recommandation, alternative, avec ordre de priorité.',
    component: BetterSell,
  },
  {
    id: 'options',
    label: 'Option Forge',
    icon: <Settings className="h-6 w-6" />,
    description:
      'Construire les personnalisations du produit : groupes d’options, choix, suppléments de prix et allergènes liés aux options.',
    component: OptionForge,
  },
  {
    id: 'menu',
    label: 'Menu Builder',
    icon: <Utensils className="h-6 w-6" />,
    description:
      'Construire un menu à partir de sections et de produits existants. Gestion des sélections min/max et de l’ordre.',
    component: MenuBuilder,
  },
  {
    id: 'name',
    label: 'Name Crafter',
    icon: <Sparkles className="h-6 w-6" />,
    description:
      'Générer/proposer automatiquement des noms à partir des catégories, spécifications et règles de nommage. Prévisualisation en temps réel et validation manuelle.',
    component: NameCrafter,
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ProductStudioPage() {
  const { selectedProduct, setSelectedProductId, isLoading } = useProductStore();
  const {
    product: editingProduct,
    initFromProduct,
    reset,
  } = useProductStudioStore();

  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      initFromProduct(selectedProduct);
    } else {
      reset();
    }
  }, [selectedProduct, initFromProduct, reset]);

  /**
   * Gère la navigation entre produits (fonctionnalité non implémentée, affiche un message d'information).
   * @param direction - Direction de navigation ('first' | 'prev' | 'next' | 'last')
   */
  const handleNavigate = (direction: 'first' | 'prev' | 'next' | 'last') => {
    toast.info('Navigation entre produits (à implémenter)');
  };

  /**
   * Sauvegarde le produit en cours d'édition via une Server Action.
   * Affiche un toast de succès ou d'erreur selon le résultat.
   */
  const handleSave = async () => {
    if (!editingProduct) {
      toast.error('Aucun produit à sauvegarder');
      return;
    }
    setIsSaving(true);
    try {
      const result = await saveProduct(editingProduct);
      if (result.success) {
        toast.success('Produit sauvegardé avec succès');
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur inattendue');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // Rendu
  // ============================================================

  // État de chargement initial (sans ShowStore, car il est affiché plus bas)
  if (isLoading) {
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
      {/* Composant de debug placé avant le titre */}
      <ShowStore state="product"/>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-4xl font-extrabold text-slate-900"
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
          className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => handleNavigate('first')}>
              <ChevronsLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('prev')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('next')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('last')}>
              <ChevronsRight className="h-5 w-5" />
            </Button>
            <ProductSelector
              trigger={
                <span
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center justify-center rounded-lg border border-input bg-white px-5 py-3 text-sm font-semibold text-slate-800 ring-offset-background transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  Changer de produit
                </span>
              }
              onSelect={(id) => setSelectedProductId(id)}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !selectedProduct}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:from-orange-600 hover:to-pink-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Enregistrer
              </>
            )}
          </Button>
        </motion.div>

        {/* ================================ */}
        {/* Grille d'outils                  */}
        {/* ================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="mb-5 text-2xl font-bold text-slate-900">Outils d’édition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {TOOLS.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card
                    className="transition-all duration-200 border-0 shadow-md hover:shadow-xl rounded-2xl overflow-hidden h-full cursor-pointer bg-white"
                    onClick={() => {
                      if (!selectedProduct) {
                        toast.error('Veuillez sélectionner un produit d’abord');
                        return;
                      }
                      setActiveToolId(tool.id);
                    }}
                  >
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ================================ */}
        {/* Modale de l'outil actif          */}
        {/* ================================ */}
        <Dialog
          open={!!activeToolId && !!selectedProduct}
          onOpenChange={(open) => !open && setActiveToolId(null)}
        >
          <DialogContent className="max-w-4xl rounded-2xl border-0 shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {TOOLS.find((t) => t.id === activeToolId)?.label || 'Outil'}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto mt-4">
              {activeToolId && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeToolId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(() => {
                      const ToolComponent = TOOLS.find((t) => t.id === activeToolId)?.component;
                      return ToolComponent ? (
                        <ToolComponent onClose={() => setActiveToolId(null)} />
                      ) : null;
                    })()}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}