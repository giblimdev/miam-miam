//@/lib/data/countryData.ts
/*
 role : Données statiques des pays disponibles pour les adresses.
        Exporte la liste des pays francophones avec leur code ISO et libellé.
 import: Aucun (données pures)
 useBy : app/admin/brandManager/SiteForm.tsx, app/admin/userManager/UserForm.tsx
*/

/**
 * Interface d'un pays.
 */
export interface Country {
  /** Code ISO 3166-1 alpha-2 (2 lettres) */
  value: string;
  /** Libellé affiché avec drapeau émoji */
  label: string;
  /** Drapeau émoji seul */
  emoji: string;
}

/**
 * Liste des pays disponibles pour les adresses.
 */
export const COUNTRIES: Country[] = [
  { value: 'FR', label: '🇫🇷 France', emoji: '🇫🇷' },
  { value: 'BE', label: '🇧🇪 Belgique', emoji: '🇧🇪' },
  { value: 'CH', label: '🇨🇭 Suisse', emoji: '🇨🇭' },
  { value: 'LU', label: '🇱🇺 Luxembourg', emoji: '🇱🇺' },
  { value: 'MC', label: '🇲🇨 Monaco', emoji: '🇲🇨' },
  { value: 'DE', label: '🇩🇪 Allemagne', emoji: '🇩🇪' },
  { value: 'ES', label: '🇪🇸 Espagne', emoji: '🇪🇸' },
  { value: 'IT', label: '🇮🇹 Italie', emoji: '🇮🇹' },
  { value: 'GB', label: '🇬🇧 Royaume-Uni', emoji: '🇬🇧' },
  { value: 'CA', label: '🇨🇦 Canada', emoji: '🇨🇦' },
  
] as const;

/**
 * Retourne le libellé complet d'un pays à partir de son code.
 *
 * @param code - Le code ISO du pays recherché
 * @returns Le libellé ou le code brut si non trouvé
 */
export function getCountryLabel(code: string): string {
  return COUNTRIES.find((c) => c.value === code)?.label ?? code;
}

/**
 * Retourne l'émoji drapeau d'un pays à partir de son code.
 *
 * @param code - Le code ISO du pays recherché
 * @returns L'émoji ou '🌍' par défaut
 */
export function getCountryEmoji(code: string): string {
  return COUNTRIES.find((c) => c.value === code)?.emoji ?? '🌍';
}