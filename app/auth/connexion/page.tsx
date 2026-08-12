//@/app/auth/connexion/page.tsx
/* role : Page de connexion simulée – charge les utilisateurs depuis public/data/users.json,
   les affiche sous forme de cartes, et met à jour le store global avec l’utilisateur sélectionné.
   import : React, useEffect, useState, useRouter, useUserStore, Card, Button, Skeleton, Alert,
            getAllUsers, clearUsersCache, User (schema), StoreUser (interface locale)
   useBy : Route /auth/connexion
*/

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAllUsers, clearUsersCache } from '@/services/userService';
import { User } from '@/lib/types/shema';

/**
 * Interface correspondant au type attendu par useUserStore.setUser().
 * (déduite de l'erreur TypeScript : le store exige motDePasse)
 */
interface StoreUser {
  id: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: 'admin' | 'livreur' | 'restaurateur' | 'client';
}

/**
 * Convertit un User complet (schema) en objet compatible avec le store.
 * Détermine un rôle principal à partir des rôles de l'utilisateur.
 */
function mapUserToStore(user: User): StoreUser {
  const roleName = user.roles?.[0]?.name?.toLowerCase() ?? '';
  let role: StoreUser['role'] = 'client';
  if (roleName.includes('super_admin') || roleName.includes('admin')) role = 'admin';
  else if (roleName.includes('driver') || roleName.includes('livreur')) role = 'livreur';
  else if (roleName.includes('brand_admin') || roleName.includes('restaurateur')) role = 'restaurateur';

  return {
    id: user.id,
    nom: user.name,
    email: user.email,
    motDePasse: 'password', // valeur factice exigée par le store
    role,
  };
}

const ConnexionPage = () => {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.currentUser);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📄 [ConnexionPage] Rendu', {
      hasHydrated,
      isAuthenticated,
      currentUser: currentUser?.nom ?? null,
    });
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        clearUsersCache(); // optionnel : rafraîchir les données pendant le dev
        const data = await getAllUsers();
        setAllUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    const storeUser = mapUserToStore(user);
    console.log('🖱️ [ConnexionPage] Connexion :', storeUser.nom, storeUser.role);

    useUserStore.getState().setUser(storeUser);

    const stateAfter = useUserStore.getState();
    console.log('🖱️ [ConnexionPage] État après setUser :', {
      isAuthenticated: stateAfter.isAuthenticated,
      currentUser: stateAfter.currentUser,
    });

    router.push('/');
  };

  // ---- Rendu ----
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Connexion simulée
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sélectionnez un utilisateur pour vous connecter
        </p>

        {/* Débogage optionnel */}
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <p>hasHydrated: <strong>{String(hasHydrated)}</strong></p>
          <p>isAuthenticated: <strong>{String(isAuthenticated)}</strong></p>
          <p>currentUser: <strong>{currentUser?.nom ?? 'null'}</strong></p>
        </div>

        {currentUser && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Connecté en tant que : {currentUser.nom} ({currentUser.role})
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allUsers.map((user) => {
            const storeVersion = mapUserToStore(user);
            const isActive = currentUser?.id === user.id;

            return (
              <Card
                key={user.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  isActive ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email :</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Mot de passe :</span> ****
                    </p>
                    <div className="mt-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase">
                        {storeVersion.role}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant={isActive ? 'secondary' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserSelect(user);
                    }}
                  >
                    {isActive ? 'Connecté' : 'Se connecter'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;