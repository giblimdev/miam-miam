//@ /app/b2b/productionTool/page.tsx
/*
role : Page principale du Product Studio, permettant de gérer l’édition complète d’un produit (identité, catégories, spécifications, scores, images, prix, options, menus, etc.) via une série d’outils modulaires.
import : 
  - Composants UI : Button, Card, Dialog, Skeleton, Badge (shadcn/ui)
  - Icônes : lucide-react
  - Hooks : useState, useEffect (React)
  - Stores : useProductStore (sélection du produit), useProductStudioStore (copie locale en édition)
  - Composants métier : ProductSelector (pour changer de produit)
  - Actions serveur : saveProduct (Server Action)
props transmise :[]
props recus : []
useBy : Layout principal de l’espace B2B, accès via le menu de navigation.
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : 
   1. Barre de navigation : affiche le produit sélectionné, permet de naviguer entre les produits et d’en sélectionner un autre via ProductSelector.
   2. Affichage simplifié du produit : nom, prix, disponibilité, etc. (sans composant externe).
   3. Grille d’outils : liste des outils disponibles sous forme de cartes cliquables ; chaque carte ouvre une modale contenant le composant dédié.
   4. Bouton d’enregistrement : déclenche la sauvegarde du produit via une Server Action.
 - Choix techniques : 
   - Composant client (‘use client’) pour l’interactivité.
   - Stores Zustand pour la gestion d’état.
   - Modales shadcn/ui.
 - Flux de données : 
   - Le produit sélectionné est stocké dans useProductStore. useProductStudioStore initialise une copie locale pour l’édition.
   - Les outils modifient la copie locale via les actions du store.
   - La sauvegarde envoie la copie locale au serveur.
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
import { Badge } from '@/components/ui/badge';

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
import { useRouter } from 'next/navigation';

// ============================================================
// Types (si non importés depuis @prisma/client)
// ============================================================

// ============================================================
// Configuration des outils
// ============================================================
interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  component: React.ComponentType<{ onClose?: () => void }>;
}

const TOOLS: Tool[] = [
  {
    id: 'identity',
    label: 'Identity Forge',
    icon: <Tag className="h-5 w-5" />,
    description: 'Nom, slug, prix, disponibilité, marque, Nutri-Score',
    component: IdentityForge,
  },
  {
    id: 'categories',
    label: 'Category Quest',
    icon: <Package className="h-5 w-5" />,
    description: 'Assigner à des catégories et sous-catégories',
    component: CategoryQuest,
  },
  {
    id: 'specs',
    label: 'Specmacker',
    icon: <Ruler className="h-5 w-5" />,
    description: 'Spécifications techniques (poids, volume, etc.)',
    component: Specmacker,
  },
  {
    id: 'nutrition',
    label: 'Nutri & Score Lab',
    icon: <Apple className="h-5 w-5" />,
    description: 'Allergènes, infos nutritionnelles, scores',
    component: NutriScoreLab,
  },
  {
    id: 'visuals',
    label: 'Visual Deck',
    icon: <Image className="h-5 w-5" />,
    description: 'Images principales et galerie',
    component: VisualDeck,
  },
  {
    id: 'price',
    label: 'Price Alchemist',
    icon: <DollarSign className="h-5 w-5" />,
    description: 'Calcul du coût de revient et prix de vente',
    component: PriceAlchemist,
  },
  {
    id: 'upsell',
    label: 'BetterSell',
    icon: <ShoppingBag className="h-5 w-5" />,
    description: 'Produits complémentaires et recommandations',
    component: BetterSell,
  },
  {
    id: 'options',
    label: 'Option Forge',
    icon: <Settings className="h-5 w-5" />,
    description: 'Groupes d’options et personnalisations',
    component: OptionForge,
  },
  {
    id: 'menu',
    label: 'Menu Builder',
    icon: <Utensils className="h-5 w-5" />,
    description: 'Construction des menus (sections, éléments)',
    component: MenuBuilder,
  },
  {
    id: 'name',
    label: 'Name Crafter',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Génération automatique de nom',
    component: NameCrafter,
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ProductStudioPage() {
  const router = useRouter();
  const { selectedProductId, selectedProduct, setSelectedProductId, isLoading } = useProductStore();
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

  const handleNavigate = (direction: 'first' | 'prev' | 'next' | 'last') => {
    toast.info('Navigation entre produits (à implémenter)');
  };

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

  // Rendu du contenu principal
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-4 h-64 w-full max-w-3xl" />
        </div>
      );
    }

    if (!selectedProduct) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">Aucun produit sélectionné</h2>
          <p className="mt-2 text-muted-foreground">
            Veuillez choisir un produit pour commencer l’édition.
          </p>
          <ProductSelector onSelect={(id) => setSelectedProductId(id)} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Bandeau de navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleNavigate('first')}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleNavigate('last')}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <ProductSelector
              trigger={<Button variant="outline">Changer de produit</Button>}
              onSelect={(id) => setSelectedProductId(id)}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>

        {/* Affichage simplifié du produit */}
        <Card>
          <CardHeader>
            <CardTitle>Produit en cours d’édition</CardTitle>
            <CardDescription>Informations de base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="font-semibold">{editingProduct?.name || 'Sans nom'}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {editingProduct?.slug}
                </span>
              </div>
              <Badge variant={editingProduct?.isAvailable ? 'default' : 'destructive'}>
                {editingProduct?.isAvailable ? 'Disponible' : 'Indisponible'}
              </Badge>
              {editingProduct?.isMenu && <Badge variant="secondary">Menu</Badge>}
              <span className="text-sm font-medium">
                {editingProduct?.price?.toFixed(2)} €
              </span>
              {editingProduct?.brand && (
                <Badge variant="outline">Marque : {editingProduct.brand.name}</Badge>
              )}
              {editingProduct?.nutriScore && (
                <Badge variant="outline">Nutri-Score : {editingProduct.nutriScore}</Badge>
              )}
            </div>
            {editingProduct?.description && (
              <p className="mt-2 text-sm text-muted-foreground">{editingProduct.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Grille d'outils */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Outils d’édition</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {TOOLS.map((tool) => (
              <Card
                key={tool.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setActiveToolId(tool.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      {tool.icon}
                    </div>
                    <span className="text-xs text-muted-foreground">Outil</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">{tool.label}</CardTitle>
                  <CardDescription className="text-xs">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modale de l'outil actif */}
        <Dialog open={!!activeToolId} onOpenChange={(open) => !open && setActiveToolId(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {TOOLS.find((t) => t.id === activeToolId)?.label || 'Outil'}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              {activeToolId && (
                (() => {
                  const ToolComponent = TOOLS.find((t) => t.id === activeToolId)?.component;
                  return ToolComponent ? (
                    <ToolComponent onClose={() => setActiveToolId(null)} />
                  ) : null;
                })()
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Product Studio</h1>
      {renderContent()}
    </div>
  );
}