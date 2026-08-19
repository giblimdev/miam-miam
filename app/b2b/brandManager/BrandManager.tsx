//@ app/b2b/brandManager/BrandManager.tsx
/*
 role : Gestionnaire CRUD des marques B2B avec sélection explicite d'une marque
        via une case à cocher et alimentation du store useBrandStore.
 import: React hooks, shadcn/ui Button, shadcn/ui Checkbox,
        lucide-react, sonner, actions brandManager, BrandForm,
        useBrandStore, type Brand Prisma
 props transmise :[]
 props recus []

 useBy : Page ou layout B2B qui intègre le gestionnaire des marques.
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   1. Chargement des marques depuis les Server Actions.
   2. Synchronisation de la première marque avec useBrandStore lorsque
      le store ne contient encore aucune sélection.
   3. Affichage de la liste des marques.
   4. Sélection explicite via Checkbox.
   5. CRUD via BrandForm et les Server Actions.
   6. Synchronisation du store après suppression/restauration.

 - Choix techniques :
   - Client Component car le composant utilise useState, useEffect,
     useCallback et le Zustand store.
   - Les mutations restent encapsulées dans les Server Actions.
   - Checkbox shadcn/ui utilisée comme unique mécanisme de sélection.
   - Le clic sur la ligne ne modifie plus le store.

 - Flux de données :
   - getBrands() -> brands local state.
   - brands -> affichage.
   - Checkbox -> setSelectedBrand().
   - deleteBrand() / restoreBrand() -> rechargement de brands.
   - Si la marque sélectionnée est supprimée, le store est vidé.
   - Au premier chargement, la première marque est sélectionnée
     automatiquement uniquement si le store est vide.

 - Interactions UX :
   - Checkbox explicitement accessible.
   - La ligne entière reste interactive visuellement mais n'est plus
     une zone de sélection.
   - Les boutons CRUD stoppent la propagation.
   - Toasts Sonner pour les opérations asynchrones.
   - États loading et empty gérés.
*/
/*IMPERATIF :
architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :

- app/b2b/brandManager/BrandManager.tsx
- app/b2b/brandManager/BrandForm.tsx
- actions/brandManager.ts
- stores/useBrandStore.ts
- components/ui/button.tsx
- components/ui/checkbox.tsx
- lib/generated/prisma/client
*/

"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteBrand, getBrands, restoreBrand } from "@/actions/brandManager";
import { useBrandStore } from "@/stores/useBrandStore";

import { BrandForm } from "./BrandForm";

import type { Brand } from "@/lib/generated/prisma/client";

/**
 * Relations nécessaires à l'affichage et à l'édition d'une marque.
 */
type BrandWithRelations = Brand & {
  brandTypes: {
    value: string;
  }[];
  sites: {
    id: string;
    name: string;
  }[];
};

export default function BrandManager() {
  const selectedBrandId = useBrandStore((state) => state.selectedBrandId);

  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);

  const [brands, setBrands] = useState<BrandWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandWithRelations | null>(
    null,
  );

  /**
   * Charge les marques depuis le serveur.
   */
  const loadBrands = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const data = await getBrands();

      setBrands(data as BrandWithRelations[]);
    } catch (error: unknown) {
      console.error("Erreur lors du chargement des marques :", error);

      toast.error("Erreur lors du chargement des marques");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Chargement initial des marques.
   */
  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  /**
   * Initialise automatiquement le store avec la première marque
   * lorsque celui-ci ne contient aucune marque sélectionnée.
   *
   * Cette initialisation n'écrase jamais une sélection existante.
   */
  useEffect(() => {
    if (loading || brands.length === 0 || selectedBrandId) {
      return;
    }

    const firstBrand = brands[0];

    if (!firstBrand) {
      return;
    }

    setSelectedBrand(firstBrand.id, firstBrand.name);
  }, [brands, loading, selectedBrandId, setSelectedBrand]);

  /**
   * Sélectionne ou désélectionne une marque.
   *
   * Une seule marque est considérée comme marque active dans le store.
   * Cocher une marque remplace donc automatiquement la sélection précédente.
   *
   * @param brand La marque concernée.
   * @param checked État de la checkbox.
   */
  const handleBrandSelection = (
    brand: BrandWithRelations,
    checked: boolean,
  ): void => {
    if (checked) {
      setSelectedBrand(brand.id, brand.name);
      return;
    }

    if (selectedBrandId === brand.id) {
      setSelectedBrand(null, null);
    }
  };

  /**
   * Ouvre le formulaire de création.
   */
  const handleCreate = (): void => {
    setEditingBrand(null);
    setShowForm(true);
  };

  /**
   * Ouvre le formulaire d'édition d'une marque.
   *
   * @param brand Marque à modifier.
   */
  const handleEdit = (brand: BrandWithRelations): void => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  /**
   * Supprime une marque après confirmation.
   *
   * @param id Identifiant de la marque.
   * @param name Nom de la marque.
   */
  const handleDelete = async (id: string, name: string): Promise<void> => {
    const confirmed = window.confirm(`Supprimer la marque "${name}" ?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteBrand(id);

      toast.success(`Marque "${name}" supprimée`);

      /*
       * Si la marque supprimée était celle présente dans le store,
       * on vide d'abord la sélection.
       */
      if (selectedBrandId === id) {
        setSelectedBrand(null, null);
      }

      await loadBrands();
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression :", error);

      toast.error("Erreur lors de la suppression");
    }
  };

  /**
   * Restaure une marque supprimée.
   *
   * @param id Identifiant de la marque.
   * @param name Nom de la marque.
   */
  const handleRestore = async (id: string, name: string): Promise<void> => {
    const confirmed = window.confirm(`Restaurer la marque "${name}" ?`);

    if (!confirmed) {
      return;
    }

    try {
      await restoreBrand(id);

      toast.success(`Marque "${name}" restaurée`);

      await loadBrands();
    } catch (error: unknown) {
      console.error("Erreur lors de la restauration :", error);

      toast.error("Erreur lors de la restauration");
    }
  };

  /**
   * Traite la réussite du formulaire de marque.
   */
  const handleSuccess = async (): Promise<void> => {
    setShowForm(false);
    setEditingBrand(null);

    await loadBrands();
  };

  /**
   * Ferme le formulaire de marque sans sauvegarder.
   */
  const handleCancel = (): void => {
    setShowForm(false);
    setEditingBrand(null);
  };

  if (loading && brands.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center p-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Chargement des marques...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marques</h2>

          <p className="text-sm text-muted-foreground">
            Sélectionnez une marque pour l'utiliser dans le contexte B2B
            courant.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleCreate}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle marque
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <BrandForm
            initialData={
              editingBrand
                ? {
                    id: editingBrand.id,
                    name: editingBrand.name,
                    slug: editingBrand.slug,
                    description: editingBrand.description,
                    logo: editingBrand.logo ?? "",
                    website: editingBrand.website ?? "",
                    type: editingBrand.brandTypes.map((type) => type.value),
                  }
                : undefined
            }
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Liste des marques */}
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        {brands.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="font-medium">Aucune marque trouvée</p>

            <p className="text-sm text-muted-foreground">
              Créez votre première marque pour commencer.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {brands.map((brand) => {
              const isSelected = selectedBrandId === brand.id;

              return (
                <div
                  key={brand.id}
                  className={[
                    "flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                    isSelected
                      ? "bg-orange-50/70 dark:bg-orange-950/20"
                      : "hover:bg-muted/50",
                  ].join(" ")}
                >
                  {/* Informations marque */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Checkbox de sélection */}
                    <div className="flex shrink-0 items-center pt-1">
                      <Checkbox
                        id={`brand-selection-${brand.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleBrandSelection(brand, checked === true)
                        }
                        aria-label={`Sélectionner la marque ${brand.name}`}
                        className="data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600 data-[state=checked]:text-white"
                      />
                    </div>

                    {/* Contenu */}
                    <label
                      htmlFor={`brand-selection-${brand.id}`}
                      className="min-w-0 cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{brand.name}</span>

                        {isSelected && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                            Sélectionnée
                          </span>
                        )}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {brand.brandTypes.length > 0
                          ? brand.brandTypes
                              .map((type) => type.value)
                              .join(", ")
                          : "Aucun type de marque"}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {brand.sites.length} site
                        {brand.sites.length > 1 ? "s" : ""}
                      </div>
                    </label>
                  </div>

                  {/* Actions CRUD */}
                  <div
                    className="flex shrink-0 gap-2 sm:ml-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(brand)}
                      aria-label={`Modifier ${brand.name}`}
                      className="border-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-900 dark:hover:bg-orange-950"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>

                    {brand.deletedAt ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(brand.id, brand.name)}
                        aria-label={`Restaurer ${brand.name}`}
                        className="border-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-900 dark:hover:bg-orange-950"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Restaurer</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(brand.id, brand.name)}
                        aria-label={`Supprimer ${brand.name}`}
                        className="border-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-900 dark:hover:bg-orange-950"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
