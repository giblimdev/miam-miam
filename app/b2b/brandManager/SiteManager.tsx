// app/b2b/brandManager/SiteManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getSitesByBrand,
  deleteSite,
  restoreSite,
} from "@/actions/siteManager";
import { SiteForm } from "./SiteForm";
import { useBrandStore } from "@/stores/useBrandStore";
import type { Site } from "@/lib/generated/prisma/client";

type SiteWithAddress = Site & {
  Address?: any;
};

export default function SiteManager() {
  const router = useRouter();
  const selectedBrandId = useBrandStore((state) => state.selectedBrandId);
  const selectedBrandName = useBrandStore((state) => state.selectedBrandName);

  const [sites, setSites] = useState<SiteWithAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteWithAddress | null>(null);

  const loadSites = useCallback(async () => {
    if (!selectedBrandId) {
      setSites([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getSitesByBrand(selectedBrandId);
      setSites(data as SiteWithAddress[]);
    } catch (error) {
      toast.error("Erreur lors du chargement des sites");
    } finally {
      setLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const handleCreate = () => {
    setEditingSite(null);
    setShowForm(true);
  };

  const handleEdit = (site: SiteWithAddress) => {
    setEditingSite(site);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer le site "${name}" ?`)) {
      try {
        await deleteSite(id);
        toast.success(`Site "${name}" supprimé`);
        await loadSites();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (confirm(`Restaurer le site "${name}" ?`)) {
      try {
        await restoreSite(id);
        toast.success(`Site "${name}" restauré`);
        await loadSites();
      } catch (error) {
        toast.error("Erreur lors de la restauration");
      }
    }
  };

  const handleSuccess = async () => {
    setShowForm(false);
    setEditingSite(null);
    await loadSites();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSite(null);
  };

  const handleBack = () => {
    router.push("/b2b/brandManager");
  };

  // Affichage si aucune marque sélectionnée
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

  if (loading && sites.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Chargement des sites...
          </p>
        </div>
      </div>
    );
  }

  const activeSites = sites.filter((s) => !s.deletedAt);
  const deletedSites = sites.filter((s) => s.deletedAt);

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
            Sites de {selectedBrandName || "la marque"}
          </h2>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau site
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 shadow-sm dark:bg-orange-950/10">
          <SiteForm
            brandId={selectedBrandId}
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
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Liste des sites actifs */}
      <div className="rounded-lg border divide-y">
        {activeSites.length === 0 ? (
          <div className="flex flex-col items-center p-8 text-center">
            <p className="text-muted-foreground">
              Aucun site actif pour cette marque
            </p>
            <Button
              variant="link"
              onClick={handleCreate}
              className="text-orange-500 hover:text-orange-600"
            >
              Créer le premier site
            </Button>
          </div>
        ) : (
          activeSites.map((site) => (
            <div
              key={site.id}
              className="flex flex-col gap-2 p-4 hover:bg-orange-50/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{site.name}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      site.isOpen
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {site.isOpen ? "🟢 Ouvert" : "🔴 Fermé"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {site.phone && (
                    <span className="flex items-center gap-1">
                      📞 {site.phone}
                    </span>
                  )}
                  {site.email && (
                    <span className="flex items-center gap-1">
                      ✉️ {site.email}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(site)}
                  className="border-orange-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(site.id, site.name)}
                  className="bg-red-100 hover:bg-red-300"
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
                  onClick={() => handleRestore(site.id, site.name)}
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
  );
}
