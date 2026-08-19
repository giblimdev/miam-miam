// app/b2b/brandManager/BrandDisplay.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBrandById } from "@/actions/brandManager";
import { toast } from "sonner";
import { SiteForm } from "./SiteForm";
import {
  getSitesByBrand,
  deleteSite,
  restoreSite,
} from "@/actions/siteManager";
import { useBrandStore } from "@/stores/useBrandStore";
import { getBrandTypeLabel, getBrandTypeEmoji } from "@/lib/data/brandTypeData";
import type { Brand, Site } from "@/lib/generated/prisma/client";

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Store,
  Globe,
  MapPin,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";

// ============================================================
// Types avec relations
// ============================================================

type BrandWithRelations = Brand & {
  brandTypes: {
    value: string;
  }[];
};

// ============================================================
// Type Site avec Address optionnel
// ============================================================

type SiteWithAddress = Site & {
  Address?: unknown;
};

// ============================================================
// Props
// ============================================================

interface BrandDisplayProps {
  brandId?: string;
}

// ============================================================
// Composant
// ============================================================

export default function BrandDisplay({
  brandId: propBrandId,
}: BrandDisplayProps) {
  const router = useRouter();

  // ==========================================================
  // Brand Store
  // ==========================================================

  const storeBrandId = useBrandStore((state) => state.selectedBrandId);

  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);

  // ==========================================================
  // Brand ID effectif
  // ==========================================================

  const effectiveBrandId = propBrandId || storeBrandId;

  // ==========================================================
  // États
  // ==========================================================

  const [brand, setBrand] = useState<BrandWithRelations | null>(null);

  const [loading, setLoading] = useState(true);

  const [sites, setSites] = useState<SiteWithAddress[]>([]);

  const [showSiteForm, setShowSiteForm] = useState(false);

  const [editingSite, setEditingSite] = useState<SiteWithAddress | null>(null);

  // ==========================================================
  // Chargement marque + sites
  // ==========================================================

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

      // ------------------------------------------------------
      // getBrandById retourne déjà la structure attendue.
      // On vérifie simplement l'existence de la marque.
      // ------------------------------------------------------

      if (brandData) {
        setBrand({
          ...brandData,
          brandTypes: brandData.brandTypes ?? [],
        });
      } else {
        setBrand(null);
      }

      setSites(sitesData as SiteWithAddress[]);
    } catch (error) {
      console.error("Erreur lors du chargement de la marque :", error);

      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Chargement initial / changement de marque
  // ==========================================================

  useEffect(() => {
    if (effectiveBrandId) {
      void loadBrandAndSites();
    } else {
      setBrand(null);
      setSites([]);
      setLoading(false);
    }
  }, [effectiveBrandId]);

  // ==========================================================
  // Création site
  // ==========================================================

  const handleCreateSite = () => {
    setEditingSite(null);
    setShowSiteForm(true);
  };

  // ==========================================================
  // Modification site
  // ==========================================================

  const handleEditSite = (site: SiteWithAddress) => {
    setEditingSite(site);
    setShowSiteForm(true);
  };

  // ==========================================================
  // Suppression site
  // ==========================================================

  const handleDeleteSite = async (id: string, name: string) => {
    if (!confirm(`Supprimer le site "${name}" ?`)) {
      return;
    }

    try {
      await deleteSite(id);

      toast.success(`Site "${name}" supprimé`);

      await loadBrandAndSites();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // ==========================================================
  // Restauration site
  // ==========================================================

  const handleRestoreSite = async (id: string, name: string) => {
    if (!confirm(`Restaurer le site "${name}" ?`)) {
      return;
    }

    try {
      await restoreSite(id);

      toast.success(`Site "${name}" restauré`);

      await loadBrandAndSites();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la restauration");
    }
  };

  // ==========================================================
  // Succès formulaire site
  // ==========================================================

  const handleSiteSuccess = async () => {
    setShowSiteForm(false);
    setEditingSite(null);

    await loadBrandAndSites();
  };

  // ==========================================================
  // Annulation formulaire site
  // ==========================================================

  const handleSiteCancel = () => {
    setShowSiteForm(false);
    setEditingSite(null);
  };

  // ==========================================================
  // Retour
  // ==========================================================

  const handleBack = () => {
    setSelectedBrand(null, null);

    router.push("/b2b/brandManager");
  };

  // ==========================================================
  // Rafraîchir
  // ==========================================================

  const handleRefresh = async () => {
    await loadBrandAndSites();

    toast.success("Données actualisées");
  };

  // ==========================================================
  // Changer de marque
  // ==========================================================

  const handleChangeBrand = () => {
    router.push("/b2b/brandManager");
  };

  // ==========================================================
  // Loading
  // ==========================================================

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

  // ==========================================================
  // Aucune marque
  // ==========================================================

  if (!effectiveBrandId || !brand) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
        <Store className="h-12 w-12 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">
          Aucune marque sélectionnée
        </h3>

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

  // ==========================================================
  // Sites actifs / supprimés
  // ==========================================================

  const activeSites = sites.filter((site) => !site.deletedAt);

  const deletedSites = sites.filter((site) => site.deletedAt);

  // ==========================================================
  // Rendu
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* ======================================================
          En-tête
          ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <Button
            variant="outline"
            onClick={handleChangeBrand}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Changer de marque
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={`Logo ${brand.name}`}
              className="h-12 w-12 rounded-lg border border-border bg-white object-contain p-1 shadow-sm"
            />
          )}

          <div>
            <h1 className="text-2xl font-bold">{brand.name}</h1>

            {/* ==================================================
                Types de marque
                ================================================== */}

            {brand.brandTypes.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {brand.brandTypes.map((brandType) => (
                  <Badge
                    key={brandType.value}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-950/30 dark:text-orange-300"
                  >
                    {getBrandTypeEmoji(brandType.value)}{" "}
                    {getBrandTypeLabel(brandType.value)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          Informations
          ====================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Site web */}

        <Card className="border-orange-100 shadow-sm transition-shadow hover:shadow-md">
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
                className="text-orange-600 hover:text-orange-700 hover:underline"
              >
                {brand.website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <span className="text-muted-foreground">Non renseigné</span>
            )}
          </CardContent>
        </Card>

        {/* Slug */}

        <Card className="border-orange-100 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Store className="h-4 w-4 text-orange-500" />
              Slug
            </CardTitle>
          </CardHeader>

          <CardContent className="font-mono text-sm">{brand.slug}</CardContent>
        </Card>

        {/* Sites */}

        <Card className="border-orange-100 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-orange-500" />
              Sites
            </CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold text-orange-600">
            {activeSites.length}

            <span className="ml-2 text-sm font-normal text-muted-foreground">
              actif
              {activeSites.length > 1 ? "s" : ""}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          Description
          ====================================================== */}

      {brand.description && (
        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Description
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-foreground">{brand.description}</p>
          </CardContent>
        </Card>
      )}

      {/* ======================================================
          Sites
          ====================================================== */}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="h-5 w-5 text-orange-500" />
            Sites
            <Badge
              variant="secondary"
              className="ml-2 bg-orange-100 text-orange-800"
            >
              {activeSites.length}
            </Badge>
          </h2>

          <Button
            onClick={handleCreateSite}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un site
          </Button>
        </div>

        {/* ====================================================
            Formulaire Site
            ==================================================== */}

        {showSiteForm && (
          <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 shadow-sm dark:bg-orange-950/10">
            <SiteForm
              brandId={effectiveBrandId}
              initialData={
                editingSite
                  ? {
                      id: editingSite.id,
                      name: editingSite.name,
                      phone: editingSite.phone || "",
                      email: editingSite.email || "",
                      isOpen: editingSite.isOpen,
                    }
                  : undefined
              }
              onSuccess={handleSiteSuccess}
              onCancel={handleSiteCancel}
            />
          </div>
        )}

        {/* ====================================================
            Liste des sites
            ==================================================== */}

        <div className="divide-y rounded-lg border">
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
              <div
                key={site.id}
                className="flex flex-col gap-2 p-4 transition-colors hover:bg-orange-50/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{site.name}</span>

                    <Badge
                      variant={site.isOpen ? "default" : "secondary"}
                      className={
                        site.isOpen
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }
                    >
                      {site.isOpen ? "🟢 Ouvert" : "🔴 Fermé"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {site.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {site.phone}
                      </span>
                    )}

                    {site.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {site.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSite(site)}
                    className="text-muted-foreground hover:bg-orange-50/50 hover:text-orange-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSite(site.id, site.name)}
                    className="text-muted-foreground hover:bg-orange-50/50 hover:text-orange-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ====================================================
            Sites supprimés
            ==================================================== */}

        {deletedSites.length > 0 && (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Sites supprimés ({deletedSites.length})
            </h3>

            <div className="space-y-2">
              {deletedSites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground line-through">
                    {site.name}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreSite(site.id, site.name)}
                    className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
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
