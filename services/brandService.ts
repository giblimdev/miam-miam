//@/services/brandService.ts
/*
 role : Service de lecture et manipulation des données de marques (Brand).
        Charge les marques depuis public/data/brands.json et gère un cache mémoire.
        Expose les fonctions CRUD simulées pour l'administration.
 import: Brand depuis @/lib/types/shema
 useBy : app/admin/brandManager/BrandManager.tsx, hooks/useBrandForm.ts
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Cache mémoire : variable brandsCache pour éviter les rechargements inutiles.
   * getAllBrands() : charge et retourne toutes les marques.
   * getBrandById() : retourne une marque par son ID.
   * getBrandBySlug() : retourne une marque par son slug.
   * clearBrandsCache() : vide le cache pour forcer un rechargement.
 - Choix techniques :
   * Données chargées depuis /public/data/brands.json via fetch().
   * Cache stratégie 'no-store' par défaut en développement pour toujours avoir les données fraîches.
   * Fonctions de filtrage synchrones sur le cache après chargement.
   * Validation du type avec un type guard isBrandArray().
 - Flux de données :
   * getAllBrands() → fetch JSON → validation → cache → Brand[].
   * getBrandById(id) → getAllBrands() → find() → Brand | undefined.
   * getBrandBySlug(slug) → getAllBrands() → find() → Brand | undefined.
   * clearBrandsCache() → vide le cache → prochain appel recharge.
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /services/brandService.ts (ce fichier)
- /services/siteService.ts (service similaire pour les sites)
- /public/data/brands.json (fichier source des données marques)
- /lib/types/shema.ts (interface Brand)
*/

import type { Brand } from '@/lib/types/shema';

/**
 * URL du fichier JSON contenant les marques.
 */
const BRANDS_DATA_URL = '/data/brand.json';

/**
 * Cache mémoire des marques.
 * undefined = pas encore chargé, []= vide, [...] = chargé.
 */
let brandsCache: Brand[] | undefined;

/**
 * Vérifie que la valeur reçue est un tableau de marques.
 *
 * @param value - La valeur à vérifier
 * @returns true si value est un tableau de Brand
 */
function isBrandArray(value: unknown): value is Brand[] {
  return Array.isArray(value);
}

/**
 * Récupère toutes les marques depuis public/data/brands.json.
 *
 * Par défaut, utilise `cache: 'no-store'` pour éviter tout cache navigateur
 * et obtenir la dernière version du fichier (adapté au développement).
 *
 * @param cacheStrategy - Stratégie de cache pour fetch (par défaut 'no-store')
 * @returns Liste des marques.
 * @throws Error si le fichier JSON ne peut pas être chargé ou si les données ne sont pas un tableau.
 */
export async function getAllBrands(
  cacheStrategy: RequestCache = 'no-store'
): Promise<Brand[]> {
  // Si un cache mémoire existe, le retourner directement
  if (brandsCache !== undefined) {
    return brandsCache;
  }

  const response = await fetch(BRANDS_DATA_URL, {
    cache: cacheStrategy,
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de charger les marques : ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();

  if (!isBrandArray(data)) {
    throw new Error(
      'Le fichier brands.json doit contenir un tableau de marques.'
    );
  }

  brandsCache = data;
  return brandsCache;
}

/**
 * Récupère une marque par son identifiant.
 *
 * @param id - L'identifiant de la marque recherchée
 * @returns La marque trouvée ou undefined
 */
export async function getBrandById(id: string): Promise<Brand | undefined> {
  const brands = await getAllBrands();
  return brands.find((brand) => brand.id === id);
}

/**
 * Récupère une marque par son slug.
 *
 * @param slug - Le slug de la marque recherchée
 * @returns La marque trouvée ou undefined
 */
export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const brands = await getAllBrands();
  return brands.find((brand) => brand.slug === slug);
}

/**
 * Récupère les marques filtrées par type.
 *
 * @param type - Le type de marque à filtrer (ex: 'restaurant')
 * @returns Liste des marques du type spécifié
 */
export async function getBrandsByType(type: string): Promise<Brand[]> {
  const brands = await getAllBrands();
  return brands.filter((brand) => brand.type.includes(type));
}

/**
 * Vide le cache mémoire. Le prochain appel à getAllBrands() rechargera
 * les données depuis le fichier JSON.
 */
export function clearBrandsCache(): void {
  brandsCache = undefined;
}