//@/services/siteService.ts
/*
 role : Service de lecture et manipulation des données de sites (Site).
        Charge les sites depuis public/data/sites.json et gère un cache mémoire.
        Expose les fonctions CRUD simulées pour l'administration.
 import: Site depuis @/lib/types/shema
 useBy : app/admin/brandManager/SiteManager.tsx, hooks/useSiteForm.ts
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Cache mémoire : variable sitesCache pour éviter les rechargements inutiles.
   * getAllSites() : charge et retourne tous les sites.
   * getSiteById() : retourne un site par son ID.
   * getSitesByBrandId() : retourne les sites d'une marque spécifique.
   * getOpenSites() : retourne les sites actuellement ouverts (isOpen = true).
   * clearSitesCache() : vide le cache pour forcer un rechargement.
 - Choix techniques :
   * Données chargées depuis /public/data/sites.json via fetch().
   * Cache stratégie 'no-store' par défaut en développement.
   * Fonctions de filtrage synchrones sur le cache après chargement.
   * Validation du type avec un type guard isSiteArray().
   * Les sites sont liés à une marque via brandId.
 - Flux de données :
   * getAllSites() → fetch JSON → validation → cache → Site[].
   * getSiteById(id) → getAllSites() → find() → Site | undefined.
   * getSitesByBrandId(brandId) → getAllSites() → filter() → Site[].
   * getOpenSites() → getAllSites() → filter(isOpen) → Site[].
   * clearSitesCache() → vide le cache → prochain appel recharge.
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /services/siteService.ts (ce fichier)
- /services/brandService.ts (service similaire pour les marques)
- /public/data/sites.json (fichier source des données sites)
- /lib/types/shema.ts (interface Site)
*/

import type { Site } from '@/lib/types/shema';

/**
 * URL du fichier JSON contenant les sites.
 */
const SITES_DATA_URL = '/data/sites.json';

/**
 * Cache mémoire des sites.
 * undefined = pas encore chargé, []= vide, [...] = chargé.
 */
let sitesCache: Site[] | undefined;

/**
 * Vérifie que la valeur reçue est un tableau de sites.
 *
 * @param value - La valeur à vérifier
 * @returns true si value est un tableau de Site
 */
function isSiteArray(value: unknown): value is Site[] {
  return Array.isArray(value);
}

/**
 * Récupère tous les sites depuis public/data/sites.json.
 *
 * Par défaut, utilise `cache: 'no-store'` pour éviter tout cache navigateur
 * et obtenir la dernière version du fichier (adapté au développement).
 *
 * @param cacheStrategy - Stratégie de cache pour fetch (par défaut 'no-store')
 * @returns Liste des sites.
 * @throws Error si le fichier JSON ne peut pas être chargé ou si les données ne sont pas un tableau.
 */
export async function getAllSites(
  cacheStrategy: RequestCache = 'no-store'
): Promise<Site[]> {
  // Si un cache mémoire existe, le retourner directement
  if (sitesCache !== undefined) {
    return sitesCache;
  }

  const response = await fetch(SITES_DATA_URL, {
    cache: cacheStrategy,
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de charger les sites : ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();

  if (!isSiteArray(data)) {
    throw new Error(
      'Le fichier sites.json doit contenir un tableau de sites.'
    );
  }

  sitesCache = data;
  return sitesCache;
}

/**
 * Récupère un site par son identifiant.
 *
 * @param id - L'identifiant du site recherché
 * @returns Le site trouvé ou undefined
 */
export async function getSiteById(id: string): Promise<Site | undefined> {
  const sites = await getAllSites();
  return sites.find((site) => site.id === id);
}

/**
 * Récupère tous les sites appartenant à une marque spécifique.
 *
 * @param brandId - L'identifiant de la marque
 * @returns Liste des sites de la marque
 */
export async function getSitesByBrandId(brandId: string): Promise<Site[]> {
  const sites = await getAllSites();
  return sites.filter((site) => site.brandId === brandId);
}

/**
 * Récupère les sites actuellement ouverts.
 *
 * @returns Liste des sites avec isOpen = true
 */
export async function getOpenSites(): Promise<Site[]> {
  const sites = await getAllSites();
  return sites.filter((site) => site.isOpen);
}

/**
 * Récupère les sites situés dans une ville spécifique.
 *
 * @param city - Le nom de la ville à rechercher
 * @returns Liste des sites dans cette ville
 */
export async function getSitesByCity(city: string): Promise<Site[]> {
  const sites = await getAllSites();
  const normalizedCity = city.toLowerCase().trim();
  return sites.filter(
    (site) => site.address.city.toLowerCase() === normalizedCity
  );
}

/**
 * Récupère les sites qui ont au moins une zone de livraison active.
 *
 * @returns Liste des sites avec au moins une zone de livraison active
 */
export async function getSitesWithActiveDelivery(): Promise<Site[]> {
  const sites = await getAllSites();
  return sites.filter((site) =>
    site.deliveryZones.some((zone) => zone.isActive)
  );
}

/**
 * Récupère les sites qui sont actuellement ouverts selon le jour et l'heure.
 * Utile pour afficher uniquement les sites disponibles à la commande.
 *
 * @param dayOfWeek - Jour de la semaine (0 = dimanche, 1 = lundi, ...)
 * @param time - Heure actuelle au format "HH:mm"
 * @returns Liste des sites ouverts à cette plage horaire
 */
export async function getSitesOpenAt(
  dayOfWeek: number,
  time: string
): Promise<Site[]> {
  const sites = await getAllSites();

  return sites.filter((site) => {
    // Le site doit être ouvert (isOpen = true)
    if (!site.isOpen) return false;

    // Si pas d'horaires définis, on considère le site fermé par défaut
    if (!site.openingHours || site.openingHours.length === 0) return false;

    // Vérifie si au moins une plage horaire couvre le jour et l'heure actuels
    return site.openingHours.some(
      (oh) =>
        oh.dayOfWeek === dayOfWeek &&
        oh.openTime <= time &&
        oh.closeTime >= time
    );
  });
}

/**
 * Vide le cache mémoire. Le prochain appel à getAllSites() rechargera
 * les données depuis le fichier JSON.
 */
export function clearSitesCache(): void {
  sitesCache = undefined;
}

/**
 * Vide tous les caches (marques et sites).
 * Utile après une modification manuelle des fichiers JSON.
 */
export function clearAllCaches(): void {
  sitesCache = undefined;
  // On importe dynamiquement pour éviter les dépendances circulaires
  import('./brandService').then(({ clearBrandsCache }) => {
    clearBrandsCache();
  });
}