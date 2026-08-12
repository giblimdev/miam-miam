// /stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: 'admin' | 'livreur' | 'restaurateur' | 'client';
}

interface UserStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        console.log('💧 [Store] setHasHydrated →', state);
        set({ _hasHydrated: state });
      },

      setUser: (user) => {
        console.log('🟢 [Store] setUser appelé avec :', user);
        set({ currentUser: user, isAuthenticated: true });
        console.log('🟢 [Store] État après setUser :', get());
      },

      logout: () => {
        console.log('🔴 [Store] logout() appelé');
        console.log('🔴 [Store] État AVANT logout :', get());

        // 1. Reset l'état en mémoire
        set({ currentUser: null, isAuthenticated: false });

        // 2. Vide le storage de persist (API officielle Zustand)
        try {
          useUserStore.persist.clearStorage();
          console.log('🔴 [Store] persist.clearStorage() OK');
        } catch (e) {
          console.error('🔴 [Store] clearStorage erreur :', e);
        }

        // 3. Filet de sécurité
        try {
          localStorage.removeItem('user-storage');
          console.log('🔴 [Store] localStorage.removeItem OK');
        } catch (e) {
          console.error('🔴 [Store] removeItem erreur :', e);
        }

        console.log('🔴 [Store] État APRÈS logout :', get());
      },
    }),
    {
      name: 'user-storage',
      // Ne pas persister _hasHydrated
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        console.log('💧 [Store] Début rehydration...');
        return (state, error) => {
          if (error) {
            console.error('💧 [Store] Erreur rehydration :', error);
          } else {
            console.log('💧 [Store] Rehydration terminée :', state);
          }
          state?.setHasHydrated(true);
        };
      },
    }
  )
);