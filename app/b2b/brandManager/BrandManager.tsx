//@ /app/admin/brandManager/BrandManager.tsx
/*
 role : Page d'administration des marques. Charge la liste via server action,
        délègue l'affichage à BrandDisplay et le formulaire à BrandForm (dialog).
        Point d'entrée de la hiérarchie Brand → Site → Product.
 import:
   - React : useState, useEffect, useCallback
   - server actions : @/actions/brandManager (getBrands, deleteBrand)
   - ./BrandDisplay, ./BrandForm
   - lucide-react : Plus
   - shadcn/ui : Button
   - sonner : toast
   - @/lib/generated/prisma/client : type Brand
 useBy : app/admin/brandManager/page.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Orchestration : charge/recharge les marques, ouvre le formulaire (création/édition).
 - Interactions UX :
   * Toast sonner en cas d’erreur de chargement.
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBrands, deleteBrand } from '@/actions/brandManager';
import { BrandDisplay } from './BrandDisplay';
import { BrandForm } from './BrandForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Brand } from '@/lib/generated/prisma/client';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

/**
 * Représentation d'une marque enrichie des relations retournées par le server action.
 * Étend le type Prisma de base pour garantir la compatibilité avec l'affichage.
 */
export interface BrandWithRelations extends Brand {
  /** Le champ type est toujours un tableau de chaînes après transformation */
  type: string[];
  /** Types de marque (objets complets) */
  BrandType?: { id: string; value: string }[];
  /** Sites associés (références légères) */
  Site?: { id: string; name: string }[];
  /** Produits associés (références légères) */
  Product?: { id: string; name: string; price: number }[];
}

// ------------------------------------------------------------
// Composant
// ------------------------------------------------------------

export function BrandManager() {
  const [brands, setBrands] = useState<BrandWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BrandWithRelations | null>(null);

  /**
   * Recharge la liste complète des marques depuis le serveur.
   */
  const loadBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBrands();
      setBrands(data as BrandWithRelations[]);
    } catch {
      toast.error('Erreur lors du chargement des marques');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  /**
   * Ouvre le formulaire en mode création ou édition.
   * @param brand - Optionnel, la marque à éditer (si absente, création)
   */
  const openForm = useCallback((brand?: BrandWithRelations) => {
    setEditTarget(brand ?? null);
    setFormOpen(true);
  }, []);

  /**
   * Supprime une marque après confirmation (dialog interne à BrandDisplay)
   * et recharge la liste.
   * @param brandId - Identifiant de la marque à supprimer
   */
  const handleDelete = useCallback(
    async (brandId: string) => {
      setIsDeleting(true);
      try {
        await deleteBrand(brandId);
        await loadBrands();
      } finally {
        setIsDeleting(false);
      }
    },
    [loadBrands]
  );

  // ----------------------------------------------------------
  // Rendu
  // ----------------------------------------------------------

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Marques</h2>
        <Button size="sm" className="gap-1.5" onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Nouvelle marque
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chargement des marques...</p>
      ) : (
        <BrandDisplay
          brands={brands}
          onEdit={openForm}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      <BrandForm
        open={formOpen}
        onOpenChange={setFormOpen}
        brand={editTarget}
        onSuccess={loadBrands}
      />
    </div>
  );
}