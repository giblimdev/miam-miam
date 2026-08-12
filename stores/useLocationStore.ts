/*
  Chemin : /stores/useLocationStore.ts
  Rôle : Gère l'adresse de livraison avec persistance localStorage
*/

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '@/lib/types/shema';

interface LocationState {
  address: Address | null;
  isAddressSet: boolean;
  
  setAddress: (address: Address) => void;
  updateAddress: (address: Partial<Address>) => void;
  clearAddress: () => void;
  getFullAddress: () => string;
  getShortAddress: () => string;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      address: null,
      isAddressSet: false,

      setAddress: (address) => 
        set({ 
          address, 
          isAddressSet: true 
        }),

      updateAddress: (addressData) =>
        set((state) => ({
          address: state.address 
            ? { ...state.address, ...addressData }
            : null,
        })),

      clearAddress: () =>
        set({ 
          address: null, 
          isAddressSet: false 
        }),

      getFullAddress: () => {
        const { address } = get();
        if (!address) return '';
        const parts = [
          address.street,
          address.complement,
          address.floor ? `Étage ${address.floor}` : '',
          address.door ? `Porte ${address.door}` : '',
          `${address.postalCode || ''} ${address.city}`,
          address.state,
          address.countryCode,
        ].filter(Boolean);
        return parts.join(', ');
      },

      getShortAddress: () => {
        const { address } = get();
        if (!address) return '';
        return `${address.street}, ${address.city}`;
      },
    }),
    {
      name: 'delivery-address',
      partialize: (state) => ({
        address: state.address,
        isAddressSet: state.isAddressSet,
      }),
    }
  )
);  