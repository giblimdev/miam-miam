/*
  Chemin : /components/layout/public/Located.tsx
  Rôle : Sélecteur d'adresse de livraison utilisant useLocationStore
*/

'use client';

import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocationStore } from '@/stores/useLocationStore';
import { Address } from '@/lib/types/shema';
import AddressForm from './PublicAddressForm'; // Import corrigé selon votre convention

interface LocatedProps {
  className?: string;
}

const Located = ({ className }: LocatedProps) => {
  const { address, setAddress, clearAddress } = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayAddress = address
    ? `${address.street} - ${address.city}`
    : 'Ajouter une adresse';

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSubmit = (addressData: Address) => {
    setIsLoading(true);
    setTimeout(() => {
      setAddress(addressData);
      setIsLoading(false);
      setIsOpen(false);
    }, 300);
  };

  const handleDelete = () => {
    clearAddress();
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger>
          <span
            className={`
              group inline-flex h-12 min-w-[200px] max-w-[500px] w-full cursor-pointer items-center gap-3 rounded-xl px-4 transition-all duration-200
              ${address ? 'bg-white hover:bg-orange-50' : 'bg-orange-50 hover:bg-orange-100'}
              border-2 ${address ? 'border-orange-500 hover:border-orange-400' : 'border-orange-300 hover:border-orange-400'}
            `}
          >
            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors
                ${address ? 'bg-orange-100 text-orange-600' : 'bg-orange-500 text-white'}
              `}
            >
              <MapPin className="h-5 w-5" />
            </span>

            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 whitespace-nowrap">
                Livraison
              </span>

              <span className="truncate text-sm font-semibold text-gray-800 group-hover:text-orange-600">
                {displayAddress}
              </span>
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
          </span>
        </DialogTrigger>

        <DialogContent className="w-[calc(100%-24px)] max-w-[560px] max-h-[90vh] overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-0 shadow-2xl">
          <DialogHeader className="border-b-2 border-gray-200 bg-gradient-to-br from-orange-50 to-white px-6 py-5 pr-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {address
                    ? 'Votre adresse de livraison'
                    : 'Où souhaitez-vous être livré ?'}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-gray-500">
                  {address
                    ? 'Modifiez votre adresse de livraison'
                    : 'Renseignez votre adresse pour commander'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[calc(90vh-110px)] overflow-y-auto px-6 py-5">
            <AddressForm
              initialData={address}
              onSubmit={handleSubmit}       // prop qui permet de fermer le dialogue après enregistrement
              onDelete={handleDelete}
              isLoading={isLoading}
              submitLabel={address ? 'Enregistrer les modifications' : "Enregistrer l'adresse"}
              deleteLabel="Supprimer"
              showDelete={!!address}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Located;