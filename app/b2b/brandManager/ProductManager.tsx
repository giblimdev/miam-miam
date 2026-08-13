//@ /app/admin/brandManager/ProductManager.tsx
/*
 Rôle : CRUD des produits de la marque sélectionnée dans @/stores/useBrandStore.
        Fournit l'interface d'ajout/édition via ProductForm, affiche la liste via ProductDisplay,
        et propose un lien direct vers l'outil avancé (ProductTool).
 Importe :
   - React : useState, useEffect, useCallback
   - next/navigation : useRouter
   - shadcn/ui : Button
   - lucide-react : Plus, ArrowLeft, Wrench
   - sonner : toast
   - @/actions/productManager : getProductsByBrand, deleteProduct
   - ./ProductDisplay : ProductDisplay (affichage liste)
   - ./ProductForm : ProductForm (formulaire création/édition)
   - @/stores/useBrandStore : store Zustand pour la marque sélectionnée
   - @/lib/generated/prisma/client : type Product
   - next/link : Link
 Utilisé par : app/admin/brandManager/page.tsx
*/
/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - En-tête : bouton retour, titre avec nom de marque, lien "Outil produit", bouton "Nouveau produit".
 - ProductForm : dialog modale pour créer/éditer un produit.
 - ProductDisplay : tableau de produits avec recherche, filtre, actions et zone JSON.
 - ProductTool : lien direct vers /b2b/productTools.
 - Client Component pour l'état local (selectedBrandId, produits, dialogs).
 - Server Actions pour les opérations CRUD.
 - Flux : selectedBrandId (store) → loadProducts() → products → ProductDisplay.
 - ProductDisplay → onEdit/onDelete → gestion dans ProductManager.
 - ProductForm → onSuccess → refetch.
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductsByBrand, deleteProduct } from '@/actions/productManager';
import { ProductForm } from './ProductForm ';
import { ProductDisplay } from './ProductDisplay';
import { useBrandStore } from '@/stores/useBrandStore';
import type { Product } from '@/lib/generated/prisma/client';

export default function ProductManager() {
  const router = useRouter();
  const selectedBrandId = useBrandStore((state) => state.selectedBrandId);
  const selectedBrandName = useBrandStore((state) => state.selectedBrandName);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    if (!selectedBrandId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProductsByBrand(selectedBrandId);
      setProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /** Ouvre le formulaire en mode création */
  const handleCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  /** Ouvre le formulaire en mode édition */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  /** Supprime un produit après confirmation */
  const handleDelete = async (product: Product) => {
    if (confirm(`Supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProduct(product.id);
        toast.success(`Produit "${product.name}" supprimé`);
        await loadProducts();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  /** Callback après succès de création/édition */
  const handleSuccess = async () => {
    setDialogOpen(false);
    setEditingProduct(null);
    await loadProducts();
  };

  const handleBack = () => {
    router.push('/admin/brandManager');
  };

  // Pas de marque sélectionnée
  if (!selectedBrandId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
        <p className="text-muted-foreground">Aucune marque sélectionnée</p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux marques
        </Button>
      </div>
    );
  }

  // Chargement initial (aucune donnée encore)
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">
            Produits de {selectedBrandName || 'la marque'}
          </h2>
        </div>
        <div className="flex gap-2">
          {/* Lien direct vers l'outil produit */}
          <Link
            href="/b2b/productTools"
            className="inline-flex items-center justify-center rounded-md border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Outil produit
          </Link>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Formulaire en Dialog */}
      <ProductForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brandId={selectedBrandId}
        product={editingProduct}
        onSuccess={handleSuccess}
      />

      {/* Liste des produits via ProductDisplay */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">Aucun produit pour cette marque</p>
          <Button
            variant="link"
            onClick={handleCreate}
            className="text-orange-500 hover:text-orange-600"
          >
            Créer le premier produit
          </Button>
        </div>
      ) : (
        <ProductDisplay
          products={products}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}