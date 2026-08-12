'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBrandById } from '@/actions/brandManager';
import { toast } from 'sonner';
import { SiteForm } from './SiteForm';
import { createSite, getSitesByBrand, deleteSite, restoreSite } from '@/actions/siteManager';
import type { Brand } from '@/lib/generated/prisma/client';
import { Plus, Pencil, Trash2, RefreshCw, ArrowLeft } from 'lucide-react';

// Définition locale du type avec relations (identique à ce qui était importé)
type BrandWithRelations = Brand & {
  BrandType: { value: string }[];
  Site: { id: string; name: string }[];
};

type SiteWithAddress = any; // À typer proprement si besoin

interface BrandDisplayProps {
  brandId: string;
}

export default function BrandDisplay({ brandId }: BrandDisplayProps) {
  const router = useRouter();
  const [brand, setBrand] = useState<BrandWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<SiteWithAddress[]>([]);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteWithAddress | null>(null);

  const loadBrandAndSites = async () => {
    try {
      setLoading(true);
      const [brandData, sitesData] = await Promise.all([
        getBrandById(brandId),
        getSitesByBrand(brandId),
      ]);
      setBrand(brandData as BrandWithRelations);
      setSites(sitesData);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) loadBrandAndSites();
  }, [brandId]);

  const handleCreateSite = () => {
    setEditingSite(null);
    setShowSiteForm(true);
  };

  const handleEditSite = (site: any) => {
    setEditingSite(site);
    setShowSiteForm(true);
  };

  const handleDeleteSite = async (id: string, name: string) => {
    if (confirm(`Supprimer le site "${name}" ?`)) {
      try {
        await deleteSite(id);
        toast.success(`Site "${name}" supprimé`);
        await loadBrandAndSites();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleRestoreSite = async (id: string, name: string) => {
    if (confirm(`Restaurer le site "${name}" ?`)) {
      try {
        await restoreSite(id);
        toast.success(`Site "${name}" restauré`);
        await loadBrandAndSites();
      } catch {
        toast.error('Erreur lors de la restauration');
      }
    }
  };

  const handleSiteSuccess = async () => {
    setShowSiteForm(false);
    setEditingSite(null);
    await loadBrandAndSites();
  };

  const handleSiteCancel = () => {
    setShowSiteForm(false);
    setEditingSite(null);
  };

  const handleBack = () => {
    router.push('/b2b/brandManager');
  };

  if (loading) return <div>Chargement...</div>;
  if (!brand) return <div>Marque non trouvée</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">{brand.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Slug:</strong> {brand.slug}</p>
          <p><strong>Description:</strong> {brand.description}</p>
          <p><strong>Types:</strong> {brand.BrandType.map((bt) => bt.value).join(', ')}</p>
          <p><strong>Site web:</strong> {brand.website || 'Non renseigné'}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sites</h2>
        <Button onClick={handleCreateSite}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter un site
        </Button>
      </div>

      {showSiteForm && (
        <div className="border rounded-lg p-4 bg-card">
          <SiteForm
            brandId={brandId}
            initialData={editingSite ? {
              id: editingSite.id,
              name: editingSite.name,
              phone: editingSite.phone || '',
              email: editingSite.email || '',
              isOpen: editingSite.isOpen,
            } : undefined}
            onSuccess={handleSiteSuccess}
            onCancel={handleSiteCancel}
          />
        </div>
      )}

      <div className="border rounded-lg divide-y">
        {sites.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Aucun site</div>
        ) : (
          sites.map((site) => (
            <div key={site.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{site.name}</div>
                <div className="text-sm text-muted-foreground">
                  {site.isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
                  {site.phone && ` • ${site.phone}`}
                  {site.email && ` • ${site.email}`}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditSite(site)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                {site.deletedAt ? (
                  <Button variant="outline" size="sm" onClick={() => handleRestoreSite(site.id, site.name)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSite(site.id, site.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}