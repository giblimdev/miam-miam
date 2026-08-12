//@/app/admin/brandManager/SiteManager.tsx
/*
 role : Composant principal de gestion des sites (Site) – CRUD complet.
        Charge les sites et les marques depuis les services, gère l'état local
        (liste, formulaire), et orchestre les interactions entre SiteDisplay et SiteForm.
        Inclut l'export JSON complet avec copie dans le presse-papier.
 import:
   - React : useState, useEffect, useCallback
   - shadcn/ui : Button
   - lucide-react : Plus, X, Download, Copy, Check
   - ./SiteDisplay : affichage liste
   - ./SiteForm, SiteFormData, emptySite : formulaire
   - @/hooks/useSiteForm : hook de gestion du formulaire
   - @/services/siteService : getAllSites
   - @/services/brandService : getAllBrands
   - @/lib/types/shema : Site, Brand
 useBy : app/admin/brandManager/page.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Chargement initial : useEffect appelle getAllSites() et getAllBrands().
   * En-tête : compteur, boutons (Voir/Cacher JSON, Télécharger, Ajouter).
   * Panneau d'export JSON (conditionnel) : JSON complet avec bouton de copie.
   * Formulaire conditionnel (showForm) : création/édition avec validation Zod.
   * Liste des sites (SiteDisplay) : affichée quand le formulaire est masqué.
 - Choix techniques :
   * Client Component ('use client') : state, useEffect, événements.
   * Données chargées depuis /public/data/sites.json et brands.json.
   * Validation Zod via useSiteForm : validateCreate() / validateUpdate().
   * Conversions Site (schéma) ↔ SiteFormData (formulaire).
   * Les marques sont chargées pour le select dans SiteForm et le filtre dans SiteDisplay.
 - Flux de données :
   * getAllSites() → sites: Site[] + getAllBrands() → brands: Brand[].
   * handleEditSite : Site → SiteFormData → useSiteForm → SiteForm.
   * handleAdd : validateCreate() → formDataToSite() → setSites.
   * handleUpdate : validateUpdate() → formDataToSite(existingSite) → setSites.
   * handleDelete : siteId → filter → setSites.
 - Interactions UX :
   * Boutons d'action avec alert() de confirmation.
   * Panneau JSON avec copie presse-papier (retour visuel).
   * États de chargement, erreur, vide gérés.
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/admin/brandManager/SiteManager.tsx (ce fichier)
- /app/admin/brandManager/SiteForm.tsx (formulaire création/édition)
- /app/admin/brandManager/SiteDisplay.tsx (affichage liste)
- /hooks/useSiteForm.ts (hook validation Zod)
- /lib/validations/site.ts (schémas Zod)
- /services/siteService.ts (chargement JSON sites)
- /services/brandService.ts (chargement JSON marques)
- /lib/data/countryData.ts (pays)
- /lib/data/daysWeek.ts (jours)
- /lib/types/shema.ts (interfaces Site, Brand)
- /public/data/sites.json (données source)
- /public/data/brands.json (données source)
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Download, Copy, Check } from 'lucide-react';
import { SiteDisplay } from './SiteDisplay';
import SiteForm, { type SiteFormData, emptySite } from './SiteForm';
import { useSiteForm } from '@/hooks/useSiteForm';
import { getAllSites } from '@/services/siteService';
import { getAllBrands } from '@/services/brandService';
import type { Site, Brand } from '@/lib/types/shema';

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

/**
 * Génère un identifiant unique.
 */
function generateId(): string {
  return `site_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Convertit un Site (schéma) en SiteFormData (formulaire).
 * Préserve les tableaux openingHours et deliveryZones.
 */
function siteToFormData(site: Site): SiteFormData {
  return {
    id: site.id,
    name: site.name,
    brandId: site.brandId,
    phone: site.phone ?? '',
    email: site.email ?? '',
    isOpen: site.isOpen,
    address: {
      id: site.address.id,
      typeAdress: site.address.typeAdress,
      street: site.address.street,
      city: site.address.city,
      postalCode: site.address.postalCode ?? '',
      countryCode: site.address.countryCode,
      lat: site.address.lat ?? null,
      lng: site.address.lng ?? null,
      label: site.address.label ?? '',
      instructions: site.address.instructions ?? '',
    },
    openingHours: site.openingHours?.map((oh) => ({ ...oh })) ?? [],
    deliveryZones: site.deliveryZones?.map((dz) => ({ ...dz })) ?? [],
  };
}

/**
 * Convertit un SiteFormData (formulaire) en Site (schéma).
 * Conserve les champs non gérés par le formulaire (productStock).
 * Garantit que openingHours et deliveryZones ne sont jamais undefined.
 */
function formDataToSite(formData: SiteFormData, existingSite?: Site): Site {
  return {
    id: formData.id ?? existingSite?.id ?? generateId(),
    name: formData.name,
    brandId: formData.brandId,
    phone: formData.phone || undefined,
    email: formData.email || undefined,
    isOpen: formData.isOpen,
    address: {
      id: formData.address.id ?? existingSite?.address?.id ?? generateId(),
      typeAdress: formData.address.typeAdress,
      street: formData.address.street,
      city: formData.address.city,
      postalCode: formData.address.postalCode || undefined,
      countryCode: formData.address.countryCode,
      lat: formData.address.lat ?? undefined,
      lng: formData.address.lng ?? undefined,
      label: formData.address.label || undefined,
      instructions: formData.address.instructions || undefined,
      siteId: formData.id ?? existingSite?.id,
    },
    openingHours: (formData.openingHours ?? []).map((oh) => ({
      ...oh,
      SiteId: formData.id ?? existingSite?.id ?? '',
    })),
    deliveryZones: (formData.deliveryZones ?? []).map((dz) => ({
      ...dz,
      siteId: formData.id ?? existingSite?.id ?? '',
    })),
    productStock: existingSite?.productStock ?? [],
    createdAt: existingSite?.createdAt ?? new Date(),
    updatedAt: new Date(),
    deletedAt: existingSite?.deletedAt,
  };
}

// ------------------------------------------------------------
// Composant
// ------------------------------------------------------------

export default function SiteManager() {
  // États des données
  const [sites, setSites] = useState<Site[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook formulaire
  const {
    formData: currentSite,
    errors,
    updateField,
    updateAddressField,
    addOpeningHours,
    removeOpeningHours,
    updateOpeningHours,
    addDeliveryZone,
    removeDeliveryZone,
    updateDeliveryZone,
    resetForm,
    validateCreate,
    validateUpdate,
    setFormData,
  } = useSiteForm();

  // États du formulaire
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // États du panneau JSON
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  // ----------------------------------------------------------
  // Chargement initial
  // ----------------------------------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [sitesData, brandsData] = await Promise.all([
          getAllSites(),
          getAllBrands(),
        ]);
        setSites(sitesData);
        setBrands(brandsData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erreur inconnue lors du chargement.';
        setError(message);
        console.error('Erreur de chargement :', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // ----------------------------------------------------------
  // Navigation formulaire
  // ----------------------------------------------------------

  const handleAddNew = useCallback(() => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  }, [resetForm]);

  const handleEditSite = useCallback(
    (site: Site) => {
      setFormData(siteToFormData(site));
      setEditingId(site.id);
      setShowForm(true);
    },
    [setFormData]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  // ----------------------------------------------------------
  // CRUD
  // ----------------------------------------------------------

  const handleAdd = useCallback(() => {
    const validated = validateCreate();
    if (!validated) return;

    const newSite = formDataToSite(validated as unknown as SiteFormData);
    setSites((prev) => [...prev, newSite]);
    alert(`Site "${newSite.name}" ajouté. Pensez à exporter le JSON.`);
    handleCancel();
  }, [validateCreate, handleCancel]);

  const handleUpdate = useCallback(() => {
    if (!editingId) return;

    const validated = validateUpdate();
    if (!validated) return;

    const existingSite = sites.find((s) => s.id === editingId);
    if (!existingSite) return;

    const updatedSite = formDataToSite(
      validated as unknown as SiteFormData,
      existingSite
    );
    setSites((prev) =>
      prev.map((s) => (s.id === editingId ? updatedSite : s))
    );
    alert(`Site "${updatedSite.name}" mis à jour. Pensez à exporter le JSON.`);
    handleCancel();
  }, [validateUpdate, editingId, sites, handleCancel]);

  const handleDelete = useCallback(
    (siteId: string) => {
      const siteToDelete = sites.find((s) => s.id === siteId);
      if (!siteToDelete) return;

      if (
        window.confirm(
          `Supprimer le site "${siteToDelete.name}" ? Cette action est irréversible.`
        )
      ) {
        setSites((prev) => prev.filter((s) => s.id !== siteId));
        alert(`Site "${siteToDelete.name}" supprimé. Pensez à exporter le JSON.`);
      }
    },
    [sites]
  );

  // ----------------------------------------------------------
  // Export JSON
  // ----------------------------------------------------------

  const handleCopyJson = useCallback(async () => {
    const jsonString = JSON.stringify(sites, null, 2);
    try {
      await navigator.clipboard.writeText(jsonString);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sites]);

  const handleDownloadJson = useCallback(() => {
    const jsonString = JSON.stringify(sites, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sites.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sites]);

  const handleExportCurrent = useCallback(() => {
    const jsonString = JSON.stringify(currentSite, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSite.name || 'site'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentSite]);

  // ----------------------------------------------------------
  // Rendu : chargement
  // ----------------------------------------------------------

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  // ----------------------------------------------------------
  // Rendu : erreur
  // ----------------------------------------------------------

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Erreur de chargement
        </h2>
        <p className="text-red-600 dark:text-red-300">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Rendu : vide
  // ----------------------------------------------------------

  if (sites.length === 0 && !showForm) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl">📍</span>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucun site
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Commencez par ajouter un premier site.
        </p>
        <Button
          onClick={handleAddNew}
          className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un site
        </Button>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Rendu principal
  // ----------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-gray-600 dark:text-gray-400">
          {sites.length} site{sites.length > 1 ? 's' : ''} au total
        </p>
        <div className="flex gap-2">
          {!showForm && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowExportPanel(!showExportPanel)}
              >
                {showExportPanel ? '🙈 Cacher JSON' : '📋 Voir JSON'}
              </Button>
              <Button variant="outline" onClick={handleDownloadJson}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Panneau JSON */}
      {showExportPanel && !showForm && (
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-sm text-gray-300 font-mono">
              sites.json — {sites.length} site{sites.length > 1 ? 's' : ''}
            </span>
            <Button
              size="sm"
              variant={copied ? 'secondary' : 'default'}
              onClick={handleCopyJson}
              className={`text-xs transition-all ${
                copied
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <><Check className="mr-1 h-3 w-3" /> Copié !</>
              ) : (
                <><Copy className="mr-1 h-3 w-3" /> Copier</>
              )}
            </Button>
          </div>
          <pre className="p-4 text-sm text-green-400 overflow-auto max-h-96 font-mono leading-relaxed">
            {JSON.stringify(sites, null, 2)}
          </pre>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={handleCancel}
            aria-label="Fermer le formulaire"
          >
            <X className="h-5 w-5" />
          </Button>
          <SiteForm
            currentSite={currentSite}
            brands={brands}
            editingId={editingId}
            updateField={updateField}
            updateAddressField={updateAddressField}
            addOpeningHours={addOpeningHours}
            removeOpeningHours={removeOpeningHours}
            updateOpeningHours={updateOpeningHours}
            addDeliveryZone={addDeliveryZone}
            removeDeliveryZone={removeDeliveryZone}
            updateDeliveryZone={updateDeliveryZone}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
            onExport={handleExportCurrent}
            errors={errors}
          />
        </div>
      )}

      {/* Liste */}
      {!showForm && (
        <SiteDisplay
          sites={sites}
          brands={brands}
          onEdit={handleEditSite}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}