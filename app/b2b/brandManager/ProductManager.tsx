//@ /app/admin/brandManager/ProductManager.tsx
/*
 role : Page d'administration des produits d'une marque. Lit la marque sélectionnée
        depuis useBrandStore, charge ses produits via server action, délègue l'affichage
        à ProductDisplay et le formulaire à ProductForm (dialog).
 import:
   - React : useState, useEffect, useCallback
   - zustand : @/stores/useBrandStore
   - server actions : @/actions/productManager (getProductsByBrand, deleteProduct)
   - ./ProductDisplay, ./ProductForm
   - lucide-react : Store, Plus
   - shadcn/ui : Button, AlertDialog...
   - sonner : toast
   - @/lib/generated/prisma/client : type Product
 useBy : app/admin/productManager/page.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Garde-fou : si aucune marque n'est sélectionnée (useBrandStore), état vide invitant à en choisir une.
   * Orchestration : charge/recharge les produits, ouvre le formulaire (création/édition),
     gère la confirmation de suppression. Le rendu du tableau est délégué à ProductDisplay.
 - Choix techniques :
   * Client Component ('use client'), même découpage que Brand (Manager orchestre,
     Display affiche + JSON backup, Form gère la saisie via react-hook-form + zod).
   * Typage volontairement simple : `Product` scalaire (Prisma), aucune relation requise
     pour lire/modifier — catégories et stock par site laissés hors scope (extension future).
 - Flux de données :
   * useBrandStore → selectedBrandId → getProductsByBrand(brandId) → products (state local).
   * products → ProductDisplay (props brands-like : products, onEdit, onDelete).
   * openForm(product?) → ProductForm (dialog) → onSuccess → refetch.
   * deleteTarget → AlertDialog → deleteProduct → refetch.
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBrandStore } from '@/stores/useBrandStore';
import { getProductsByBrand, deleteProduct } from '@/actions/productManager';
import { ProductDisplay } from './ProductDisplay';
import { ProductForm } from './ProductForm ';
import { Button } from '@/components/ui/button'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Store, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/generated/prisma/client';

export function ProductManager() {
  const selectedBrandId = useBrandStore((s) => s.selectedBrandId);
  const selectedBrandName = useBrandStore((s) => s.selectedBrandName);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Recharge les produits de la marque sélectionnée.
   */
  const loadProducts = useCallback(async () => {
    if (!selectedBrandId) {
      setProducts([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getProductsByBrand(selectedBrandId);
      setProducts(data);
    } catch {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openForm = useCallback((product?: Product) => {
    setEditTarget(product ?? null);
    setFormOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
    } catch {
      // toast déjà géré côté server action
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, loadProducts]);

  // ----------------------------------------------------------
  // Rendu : aucune marque sélectionnée
  // ----------------------------------------------------------

  if (!selectedBrandId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
        <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucune marque sélectionnée
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sélectionnez une marque pour gérer ses produits.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Rendu principal
  // ----------------------------------------------------------

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Produits {selectedBrandName ? `— ${selectedBrandName}` : ''}
        </h2>
        <Button size="sm" className="gap-1.5" onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      <ProductDisplay
        products={products}
        isLoading={isLoading}
        onEdit={openForm}
        onDelete={(product) => setDeleteTarget(product)}
      />

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        brandId={selectedBrandId}
        product={editTarget}
        onSuccess={loadProducts}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit{' '}
              <span className="font-semibold">{deleteTarget?.name}</span> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}