// app/b2b/brandManager/BrandManager.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getBrands, deleteBrand, restoreBrand } from '@/actions/brandManager';
import { BrandForm } from './BrandForm';
import { useBrandStore } from '@/stores/useBrandStore';
import type { Brand } from '@/lib/generated/prisma/client';

type BrandWithRelations = Brand & {
  BrandType: { value: string }[];
  Site: { id: string; name: string }[];
};

export default function BrandManager() {
  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);
  const [brands, setBrands] = useState<BrandWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandWithRelations | null>(null);

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBrands();
      setBrands(data as BrandWithRelations[]);
    } catch (error) {
      toast.error('Erreur lors du chargement des marques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleBrandClick = (brandId: string, brandName: string) => {
    setSelectedBrand(brandId, brandName);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand: BrandWithRelations) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer la marque "${name}" ?`)) {
      try {
        await deleteBrand(id);
        toast.success(`Marque "${name}" supprimée`);
        await loadBrands();
        // Si la marque supprimée était sélectionnée, on la désélectionne
        const store = useBrandStore.getState();
        if (store.selectedBrandId === id) {
          setSelectedBrand(null, null);
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (confirm(`Restaurer la marque "${name}" ?`)) {
      try {
        await restoreBrand(id);
        toast.success(`Marque "${name}" restaurée`);
        await loadBrands();
      } catch (error) {
        toast.error('Erreur lors de la restauration');
      }
    }
  };

  const handleSuccess = async () => {
    setShowForm(false);
    setEditingBrand(null);
    await loadBrands();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  if (loading && brands.length === 0) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marques</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle marque
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-6 bg-card">
          <BrandForm
            initialData={editingBrand ? {
              id: editingBrand.id,
              name: editingBrand.name,
              slug: editingBrand.slug,
              description: editingBrand.description,
              logo: editingBrand.logo || '',
              website: editingBrand.website || '',
              type: editingBrand.BrandType.map(t => t.value),
            } : undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="border rounded-lg">
        {brands.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Aucune marque trouvée
          </div>
        ) : (
          <div className="divide-y">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleBrandClick(brand.id, brand.name)}
              >
                <div>
                  <div className="font-medium">{brand.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {brand.BrandType.map(t => t.value).join(', ')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {brand.Site.length} site(s)
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {brand.deletedAt ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(brand.id, brand.name)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(brand.id, brand.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}