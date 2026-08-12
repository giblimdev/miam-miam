//@/lib/utils/slugify.ts
/*
 role : Utilitaire de génération de slugs à partir d'une chaîne de caractères.
        Convertit un texte en slug URL-friendly (minuscules, sans accents,
        espaces remplacés par des tirets).
 import: Aucun
 useBy : app/admin/brandManager/BrandForm.tsx, app/admin/brandManager/BrandManager.tsx
*/

/**
 * Options de configuration pour la génération de slug.
 */
interface SlugifyOptions {
  /** Séparateur utilisé entre les mots (défaut: '-') */
  separator?: string;
  /** Convertit en minuscules (défaut: true) */
  lowercase?: boolean;
  /** Longueur maximale du slug (défaut: 100) */
  maxLength?: number;
  /** Supprime les stop words français (défaut: false) */
  removeStopWords?: boolean;
}

/**
 * Liste des stop words français courants à supprimer si l'option est activée.
 */
const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'à', 'au', 'aux',
  'et', 'ou', 'en', 'sur', 'sous', 'avec', 'sans', 'pour', 'par',
]);

/**
 * Génère un slug URL-friendly à partir d'une chaîne de caractères.
 *
 * @param text - Le texte à convertir en slug
 * @param options - Options de configuration
 * @returns Le slug généré
 *
 * @example
 * slugify('McDonald\'s Restaurant') // 'mcdonalds-restaurant'
 * slugify('Café de la Gare') // 'cafe-de-la-gare'
 * slugify('Café de la Gare', { removeStopWords: true }) // 'cafe-gare'
 */
export function slugify(text: string, options: SlugifyOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    maxLength = 100,
    removeStopWords = false,
  } = options;

  let slug = text
    // Normalise les caractères Unicode (décompose les accents)
    .normalize('NFD')
    // Supprime les marques diacritiques (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Remplace les caractères spéciaux par des espaces (sauf lettres, chiffres, espaces, tirets)
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    // Remplace les espaces multiples par un espace unique
    .replace(/\s+/g, ' ')
    .trim();

  // Convertit en minuscules si demandé
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Supprime les stop words si demandé
  if (removeStopWords) {
    slug = slug
      .split(' ')
      .filter((word) => !FRENCH_STOP_WORDS.has(word))
      .join(' ');
  }

  // Remplace les espaces par le séparateur
  slug = slug.replace(/\s+/g, separator);

  // Supprime les séparateurs multiples
  slug = slug.replace(new RegExp(`${separator}+`, 'g'), separator);

  // Supprime les séparateurs en début et fin
  slug = slug.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');

  // Tronque à la longueur maximale
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Évite de couper au milieu d'un mot (coupe au dernier séparateur)
    const lastSeparatorIndex = slug.lastIndexOf(separator);
    if (lastSeparatorIndex > maxLength * 0.8) {
      slug = slug.substring(0, lastSeparatorIndex);
    }
  }

  // Si le slug est vide, retourne un fallback
  return slug || 'sans-nom';
}

/**
 * Vérifie si un slug est valide (format URL-friendly).
 *
 * @param slug - Le slug à vérifier
 * @returns true si le slug est valide
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}