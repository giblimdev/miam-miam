// app/b2b/brandManager/ProductManager.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProductsByBrand, deleteProduct } from '@/actions/productManager';
import { useBrandStore } from '@/stores/useBrandStore';
import type { Product } from '@/lib/generated/prisma/client';

export default function ProductManager() {
  const selectedBrandId = useBrandStore((state) => state.selectedBrandId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    if (!selectedBrandId) return;
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

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer le produit "${name}" ?`)) {
      try {
        await deleteProduct(id);
        toast.success(`Produit "${name}" supprimé`);
        await loadProducts();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleSuccess = async () => {
    setShowForm(false);
    setEditingProduct(null);
    await loadProducts();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (!selectedBrandId) {
    return <p className="text-muted-foreground">Sélectionnez une marque dans l'onglet Marques.</p>;
  }

  if (loading && products.length === 0) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produits</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-6 bg-card">
          {/* À remplacer par ton formulaire de produit */}
          <p className="text-muted-foreground">Formulaire produit à implémenter</p>
          <Button onClick={handleCancel} variant="outline">Annuler</Button>
        </div>
      )}

      <div className="border rounded-lg">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Aucun produit trouvé pour cette marque
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.isAvailable ? '🟢 Disponible' : '🔴 Indisponible'}
                    {product.price && ` • ${product.price} €`}
                    {product.nutriScore && ` • Nutri‑score: ${product.nutriScore}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}