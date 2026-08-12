//@/lib/data/daysWeek.ts
/*
 role : Données statiques des jours de la semaine.
        Exporte la liste des jours avec leur index numérique (0-6) et libellé.
 import: Aucun (données pures)
 useBy : app/admin/brandManager/SiteForm.tsx, app/admin/brandManager/SiteDisplay.tsx
*/

/**
 * Interface d'un jour de la semaine.
 */
export interface DayOfWeek {
  /** Index du jour (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi) */
  value: number;
  /** Libellé complet en français */
  label: string;
  /** Abréviation courte (3 lettres) */
  short: string;
}

/**
 * Liste des jours de la semaine.
 * L'index 0 correspond à Dimanche (convention JavaScript/Date).
 */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  { value: 0, label: 'Dimanche', short: 'Dim' },
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
] as const;

/**
 * Retourne le libellé d'un jour à partir de son index.
 *
 * @param dayIndex - L'index du jour (0-6)
 * @returns Le libellé ou 'Inconnu' si hors plage
 */
export function getDayLabel(dayIndex: number): string {
  return DAYS_OF_WEEK.find((d) => d.value === dayIndex)?.label ?? 'Inconnu';
}

/**
 * Retourne l'abréviation d'un jour à partir de son index.
 *
 * @param dayIndex - L'index du jour (0-6)
 * @returns L'abréviation ou '???' si hors plage
 */
export function getDayShort(dayIndex: number): string {
  return DAYS_OF_WEEK.find((d) => d.value === dayIndex)?.short ?? '???';
}