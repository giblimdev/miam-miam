//@ /lib/data/brandTypeData.ts
/*
 role : Données statiques des types de marque disponibles dans l'application.
        Exporte la liste complète des types avec leur valeur, libellé et icône émoji.
 import: Aucun (données pures)
 useBy : app/admin/brandManager/BrandForm.tsx, app/admin/brandManager/BrandDisplay.tsx
*/

/**
 * Interface d'un type de marque.
 */
export interface BrandType {
  /** Valeur unique du type (utilisée comme identifiant) */
  value: string;
  /** Libellé affiché avec émoji */
  label: string;
  /** Émoji seul (pour affichage compact) */
  emoji: string;
}

/**
 * Liste complète des types de marque disponibles.
 */
export const BRAND_TYPES: BrandType[] = [
  { value: 'restaurant', label: '🍽️ Restaurant', emoji: '🍽️' },
  { value: 'fast-food', label: '🍔 Fast-Food', emoji: '🍔' },
  { value: 'cafe', label: '☕ Café', emoji: '☕' },
  { value: 'boulangerie', label: '🥖 Boulangerie', emoji: '🥖' },
  { value: 'patisserie', label: '🧁 Pâtisserie', emoji: '🧁' },
  { value: 'traiteur', label: '🍱 Traiteur', emoji: '🍱' },
  { value: 'epicerie', label: '🛒 Épicerie', emoji: '🛒' },
  { value: 'bar', label: '🍷 Bar', emoji: '🍷' },
  { value: 'brasserie', label: '🍺 Brasserie', emoji: '🍺' },
  { value: 'food-truck', label: '🚚 Food Truck', emoji: '🚚' },
  { value: 'sandwicherie', label: '🥪 Sandwicherie', emoji: '🥪' },
  { value: 'pizzeria', label: '🍕 Pizzeria', emoji: '🍕' },
  { value: 'sushis', label: '🍣 Sushis', emoji: '🍣' },
  { value: 'asiatique', label: '🥢 Cuisine asiatique', emoji: '🥢' },
  { value: 'italien', label: '🇮🇹 Cuisine italienne', emoji: '🇮🇹' },
  { value: 'francais', label: '🇫🇷 Cuisine française', emoji: '🇫🇷' },
  { value: 'vegetarien', label: '🥗 Végétarien', emoji: '🥗' },
  { value: 'vegan', label: '🌱 Vegan', emoji: '🌱' },
  { value: 'sans-gluten', label: '🌾 Sans gluten', emoji: '🌾' },
  { value: 'halal', label: '🕌 Halal', emoji: '🕌' },
  { value: 'casher', label: '✡️ Casher', emoji: '✡️' },
  { value: 'boucherie', label: '🥩 Boucherie', emoji: '🥩' },
  { value: 'poissonnerie', label: '🐟 Poissonnerie', emoji: '🐟' },
  { value: 'caviste', label: '🍷 Caviste', emoji: '🍷' },
  { value: 'dark-kitchen', label: '🏭 Dark Kitchen', emoji: '🏭' },
  { value: 'glacier', label: '🍦 Glacier', emoji: '🍦' },
  { value: 'fromager', label: '🧀 Fromager', emoji: '🧀' },
  { value: 'primeur', label: '🥬 Primeur', emoji: '🥬' },
] as const;

/**
 * Retourne le libellé complet d'un type à partir de sa valeur.
 *
 * @param value - La valeur du type recherché
 * @returns Le libellé ou la valeur brute si non trouvé
 */
export function getBrandTypeLabel(value: string): string {
  return BRAND_TYPES.find((t) => t.value === value)?.label ?? value;
}

/**
 * Retourne l'émoji d'un type à partir de sa valeur.
 *
 * @param value - La valeur du type recherché
 * @returns L'émoji ou '🏷️' par défaut
 */
export function getBrandTypeEmoji(value: string): string {
  return BRAND_TYPES.find((t) => t.value === value)?.emoji ?? '🏷️';
}