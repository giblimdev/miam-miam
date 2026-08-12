//@/services/userService.ts
/* role : Service de lecture des données utilisateur simulées.
   responsabilités :
    - Charger la liste des utilisateurs depuis public/data/users.json.
    - Valider que la réponse reçue correspond à un tableau.
    - Permettre de vider le cache pour rafraîchir les données (utile en développement).
   import : User depuis @/lib/types/shema
   useBy : app/admin/userManager/page.tsx, app/admin/page.tsx (via UserDisplay)
*/

import { User } from '@/lib/types/shema';

const USERS_DATA_URL = '/data/user.json';

/**
 * Cache mémoire, stocké dans une variable de module.
 * Réinitialisé lorsque le module est rechargé (rechargement de page complet)
 * ou via la fonction clearUsersCache().
 */
let usersCache: User[] | undefined;

/**
 * Vérifie que la valeur reçue est un tableau.
 */
function isUserArray(value: unknown): value is User[] {
  return Array.isArray(value);
}

/**
 * Récupère tous les utilisateurs depuis public/data/users.json.
 *
 * Par défaut, utilise `cache: 'no-store'` pour éviter tout cache navigateur
 * et obtenir la dernière version du fichier (adapté au développement).
 * Vous pouvez passer `cache: 'force-cache'` en paramètre pour la production.
 *
 * @param cacheStrategy - Stratégie de cache pour fetch (par défaut 'no-store')
 * @returns Liste des utilisateurs.
 * @throws Error si le fichier JSON ne peut pas être chargé ou si les données ne sont pas un tableau.
 */
export async function getAllUsers(
  cacheStrategy: RequestCache = 'no-store'
): Promise<User[]> {
  // Si un cache mémoire existe, le retourner directement (optimisation)
  // Pour toujours avoir les données fraîches en développement, commentez cette ligne
  // ou utilisez clearUsersCache() avant l'appel.
  if (usersCache !== undefined) {
    return usersCache;
  }

  const response = await fetch(USERS_DATA_URL, {
    cache: cacheStrategy,
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de charger les utilisateurs : ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!isUserArray(data)) {
    throw new Error(
      'Le fichier users.json doit contenir un tableau d’utilisateurs.',
    );
  }

  usersCache = data;
  return usersCache;
}

/**
 * Vide le cache mémoire. Le prochain appel à getAllUsers() rechargera
 * les données depuis le fichier JSON.
 */
export function clearUsersCache(): void {
  usersCache = undefined;
}