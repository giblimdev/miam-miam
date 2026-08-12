// app/b2b/brandManager/BrandDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBrandById } from '@/actions/brandManager';
import { toast } from 'sonner';
import { SiteForm } from './SiteForm';
import { getSitesByBrand, deleteSite, restoreSite } from '@/actions/siteManager';
import { useBrandStore } from '@/stores/useBrandStore';
import { getBrandTypeLabel, getBrandTypeEmoji } from '@/lib/data/brandTypeData';
import type { Brand, Site } from '@/lib/generated/prisma/client';
import { Plus, Pencil, Trash2, RefreshCw, ArrowLeft, Store, Globe, MapPin, Phone, Mail, LogOut } from 'lucide-react';

// Types avec relations
type BrandWithRelations = Brand & {
  BrandType: { value: string }[];
};

// Type Site avec Address optionnel
type SiteWithAddress = Site & {
  Address?: any;
};

interface BrandDisplayProps {
  brandId?: string;
}

export default function BrandDisplay({ brandId: propBrandId }: BrandDisplayProps) {
  const router = useRouter();
  const storeBrandId = useBrandStore((state) => state.selectedBrandId);
  const storeBrandName = useBrandStore((state) => state.selectedBrandName);
  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);

  const effectiveBrandId = propBrandId || storeBrandId;

  const [brand, setBrand] = useState<BrandWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<SiteWithAddress[]>([]);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteWithAddress | null>(null);

  const loadBrandAndSites = async () => {
    if (!effectiveBrandId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [brandData, sitesData] = await Promise.all([
        getBrandById(effectiveBrandId),
        getSitesByBrand(effectiveBrandId),
      ]);
      setBrand(brandData as BrandWithRelations);
      setSites(sitesData as SiteWithAddress[]);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveBrandId) {
      loadBrandAndSites();
    } else {
      setBrand(null);
      setSites([]);
      setLoading(false);
    }
  }, [effectiveBrandId]);

  const handleCreateSite = () => {
    setEditingSite(null);
    setShowSiteForm(true);
  };

  const handleEditSite = (site: SiteWithAddress) => {
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
    setSelectedBrand(null, null);
    router.push('/b2b/brandManager');
  };

  const handleRefresh = async () => {
    await loadBrandAndSites();
    toast.success('Données actualisées');
  };

  const handleChangeBrand = () => {
    router.push('/b2b/brandManager');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!effectiveBrandId || !brand) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
        <Store className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucune marque sélectionnée</h3>
        <p className="text-sm text-muted-foreground">
          Veuillez sélectionner une marque dans la liste.
        </p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const activeSites = sites.filter(s => !s.deletedAt);
  const deletedSites = sites.filter(s => s.deletedAt);

  return (
    <div className="space-y-6">
      {/* ---- En-tête ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button
            variant="outline"
            onClick={handleChangeBrand}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Changer de marque
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={`Logo ${brand.name}`}
              className="h-12 w-12 rounded-lg object-contain border border-border bg-white p-1 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{brand.name}</h1>
            {brand.BrandType.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {brand.BrandType.map((bt) => (
                  <Badge key={bt.value} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-950/30 dark:text-orange-300">
                    {getBrandTypeEmoji(bt.value)} {getBrandTypeLabel(bt.value)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Informations ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="h-4 w-4 text-orange-500" />
              Site web
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brand.website ? (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline hover:text-orange-700"
              >
                {brand.website.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-muted-foreground">Non renseigné</span>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Store className="h-4 w-4 text-orange-500" />
              Slug
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-sm">{brand.slug}</CardContent>
        </Card>

        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-orange-500" />
              Sites
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-orange-600">
            {activeSites.length}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              actif{activeSites.length > 1 ? 's' : ''}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* ---- Description ---- */}
      {brand.description && (
        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{brand.description}</p>
          </CardContent>
        </Card>
      )}

      {/* ---- Sites ---- */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Sites
            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
              {activeSites.length}
            </Badge>
          </h2>
          <Button
            onClick={handleCreateSite}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un site
          </Button>
        </div>

        {showSiteForm && (
          <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 shadow-sm dark:bg-orange-950/10">
            <SiteForm
              brandId={effectiveBrandId}
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

        <div className="rounded-lg border divide-y">
          {activeSites.length === 0 ? (
            <div className="flex flex-col items-center p-8 text-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Aucun site actif</p>
              <Button
                variant="link"
                onClick={handleCreateSite}
                className="text-orange-500 hover:text-orange-600"
              >
                Créer le premier site
              </Button>
            </div>
          ) : (
            activeSites.map((site) => (
              <div key={site.id} className="flex flex-col gap-2 p-4 hover:bg-orange-50/50 transition-colors sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{site.name}</span>
                    <Badge
                      variant={site.isOpen ? 'default' : 'secondary'}
                      className={site.isOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-muted-foreground/20 text-muted-foreground'}
                    >
                      {site.isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {site.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {site.phone}
                      </span>
                    )}
                    {site.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {site.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSite(site)}
                    className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50/50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSite(site.id, site.name)}
                    className="text-muted-foreground hover:text-orange-600 hover:bg-orang-50/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sites supprimés (restauration) */}
        {deletedSites.length > 0 && (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Sites supprimés ({deletedSites.length})
            </h3>
            <div className="space-y-2">
              {deletedSites.map((site) => (
                <div key={site.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-through">{site.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreSite(site.id, site.name)}
                    className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Restaurer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}