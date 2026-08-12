/*
  Chemin : /components/layout/public/PublicAddressForm.tsx
  Rôle : Formulaire d'adresse de livraison réutilisable avec préremplissage d'adresses fictives
*/

'use client';

import React, { useState } from 'react';
import {
  Loader2,
  Navigation,
  Home,
  Building2,
  BriefcaseBusiness,
  Trash2,
  Save,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Address } from '@/lib/types/shema';
import { useLocationStore } from '@/stores/useLocationStore';

// Adresses fictives pour Popayán, Colombie
const FAKE_ADDRESSES: Address[] = [
  {
    id: 'fake-1',
    typeAdress: 'deliveryAddress',
    street: 'Carrera 9 # 24-10',
    city: 'Popayán',
    postalCode: '190001',
    countryCode: 'CO',
    state: 'Cauca',
    neighborhood: 'Centro',
    urbanization: '',
    complement: '',
    buildingName: 'Edificio Don Bosco',
    floor: '2',
    door: '201',
    additionalInfo: 'Cerca de la Catedral',
    lat: 2.4448,
    lng: -76.6147,
    label: 'Maison',
    isDefault: true,
    instructions: 'Tocar el timbre 201',
  },
  {
    id: 'fake-2',
    typeAdress: 'deliveryAddress',
    street: 'Calle 5 # 10-25',
    city: 'Popayán',
    postalCode: '190002',
    countryCode: 'CO',
    state: 'Cauca',
    neighborhood: 'La Pamba',
    urbanization: 'Conjunto Los Alpes',
    complement: 'Entrada peatonal',
    buildingName: 'Torre 3',
    floor: '5',
    door: '502',
    additionalInfo: '',
    lat: 2.448,
    lng: -76.609,
    label: 'Travail',
    isDefault: false,
    instructions: 'Dejar en recepción',
  },
  {
    id: 'fake-3',
    typeAdress: 'deliveryAddress',
    street: 'Calle 13 # 8-50',
    city: 'Popayán',
    postalCode: '190003',
    countryCode: 'CO',
    state: 'Cauca',
    neighborhood: 'El Empedrado',
    urbanization: '',
    complement: 'Casa azul',
    buildingName: '',
    floor: '',
    door: '',
    additionalInfo: 'Al lado de la panadería',
    lat: 2.441,
    lng: -76.606,
    label: 'Autre',
    isDefault: false,
    instructions: '',
  },
  {
    id: 'fake-4',
    typeAdress: 'deliveryAddress',
    street: 'Carrera 6 # 17-30',
    city: 'Popayán',
    postalCode: '190004',
    countryCode: 'CO',
    state: 'Cauca',
    neighborhood: 'Santa Clara',
    urbanization: 'Urbanización Campestre',
    complement: 'Portón blanco',
    buildingName: 'Casa 12',
    floor: '',
    door: '',
    additionalInfo: '',
    lat: 2.439,
    lng: -76.612,
    label: 'Maison',
    isDefault: true,
    instructions: 'Llamar antes de llegar',
  },
];

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit?: (address: Address) => void;   // réintroduite pour Located
  onDelete?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  deleteLabel?: string;
  showDelete?: boolean;
}

const AddressForm = ({
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
  submitLabel = 'Enregistrer',
  deleteLabel = 'Supprimer',
  showDelete = false,
}: AddressFormProps) => {
  const setAddress = useLocationStore((state) => state.setAddress);

  // État du formulaire
  const [formData, setFormData] = useState<Partial<Address>>(() => {
    if (initialData) {
      return {
        id: initialData.id || '',
        typeAdress: initialData.typeAdress || 'deliveryAddress',
        street: initialData.street || '',
        city: initialData.city || '',
        postalCode: initialData.postalCode || '',
        countryCode: initialData.countryCode || 'CO',
        state: initialData.state || '',
        neighborhood: initialData.neighborhood || '',
        urbanization: initialData.urbanization || '',
        complement: initialData.complement || '',
        buildingName: initialData.buildingName || '',
        floor: initialData.floor || '',
        door: initialData.door || '',
        additionalInfo: initialData.additionalInfo || '',
        lat: initialData.lat,
        lng: initialData.lng,
        label: initialData.label || 'Maison',
        isDefault: initialData.isDefault ?? true,
        instructions: initialData.instructions || '',
      };
    }
    return {
      id: '',
      typeAdress: 'deliveryAddress',
      street: '',
      city: '',
      postalCode: '',
      countryCode: 'CO',
      state: '',
      neighborhood: '',
      urbanization: '',
      complement: '',
      buildingName: '',
      floor: '',
      door: '',
      additionalInfo: '',
      lat: undefined,
      lng: undefined,
      label: 'Maison',
      isDefault: true,
      instructions: '',
    };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLabelChange = (label: string) => {
    setFormData((prev: any) => ({ ...prev, label }));
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('⚠️ La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev: any) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
      },
      () => {
        alert('⚠️ Impossible de récupérer votre position.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePrefill = (address: Address) => {
    setFormData({
      id: '',
      typeAdress: address.typeAdress,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      countryCode: address.countryCode,
      state: address.state,
      neighborhood: address.neighborhood,
      urbanization: address.urbanization,
      complement: address.complement,
      buildingName: address.buildingName,
      floor: address.floor,
      door: address.door,
      additionalInfo: address.additionalInfo,
      lat: address.lat,
      lng: address.lng,
      label: address.label,
      isDefault: address.isDefault,
      instructions: address.instructions,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.street?.trim() || !formData.city?.trim()) return;

    const now = new Date();
    const address: Address = {
      id: formData.id || crypto.randomUUID(),
      typeAdress: formData.typeAdress || 'deliveryAddress',
      street: formData.street!.trim(),
      city: formData.city!.trim(),
      postalCode: formData.postalCode?.trim() || undefined,
      countryCode: formData.countryCode?.trim().toUpperCase() || 'CO',
      state: formData.state?.trim() || undefined,
      neighborhood: formData.neighborhood?.trim() || undefined,
      urbanization: formData.urbanization?.trim() || undefined,
      complement: formData.complement?.trim() || undefined,
      buildingName: formData.buildingName?.trim() || undefined,
      floor: formData.floor?.trim() || undefined,
      door: formData.door?.trim() || undefined,
      additionalInfo: formData.additionalInfo?.trim() || undefined,
      lat: formData.lat,
      lng: formData.lng,
      label: formData.label?.trim() || 'Livraison',
      isDefault: formData.isDefault ?? true,
      instructions: formData.instructions?.trim() || undefined,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    setAddress(address); // Mise à jour du store

    if (onSubmit) {
      onSubmit(address); // Appeler la fonction passée par Located
    } else {
      alert('Adresse enregistrée avec succès !');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Boutons de préremplissage */}
      <div className="mb-4">
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Adresses d'exemple (Popayán)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {FAKE_ADDRESSES.map((addr, index) => (
            <Button
              key={addr.id}
              type="button"
              variant="outline"
              onClick={() => handlePrefill(addr)}
              className="h-auto flex-col items-start p-2 text-left border-gray-200 hover:bg-orange-50"
            >
              <span className="text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Exemple {index + 1}
              </span>
              <span className="text-[10px] text-gray-500 truncate w-full">
                {addr.street}, {addr.city}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Géolocalisation */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGeolocation}
        disabled={isLoading}
        className="mb-5 h-12 w-full justify-start rounded-xl border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-700"
      >
        {isLoading ? (
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="mr-3 h-4 w-4" />
        )}
        <span className="flex flex-col items-start">
          <span className="text-sm font-semibold">Utiliser ma position actuelle</span>
          <span className="text-[11px] font-normal text-orange-600/70">
            Détecter automatiquement mes coordonnées
          </span>
        </span>
      </Button>

      {/* Label */}
      <div className="mb-5">
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Cette adresse est...
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {['Maison', 'Travail', 'Autre'].map((lbl) => (
            <Button
              key={lbl}
              type="button"
              variant="outline"
              onClick={() => handleLabelChange(lbl)}
              className={`h-11 rounded-xl ${formData.label === lbl ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200'}`}
            >
              {lbl === 'Maison' && <Home className="mr-2 h-4 w-4" />}
              {lbl === 'Travail' && <BriefcaseBusiness className="mr-2 h-4 w-4" />}
              {lbl === 'Autre' && <Building2 className="mr-2 h-4 w-4" />}
              {lbl}
            </Button>
          ))}
        </div>
      </div>

      {/* Adresse principale */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-900">Adresse</h3>
          <p className="text-xs text-gray-400">Informations principales de livraison</p>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="street" className="mb-1.5 block text-xs font-semibold text-gray-600">
              Adresse <span className="text-orange-500">*</span>
            </Label>
            <Input id="street" name="street" placeholder="12 rue Victor Hugo" value={formData.street || ''} onChange={handleChange} required className="h-11 rounded-xl border-gray-200" />
          </div>
          <div className="grid grid-cols-[1fr_110px_65px] gap-2">
            <div>
              <Label htmlFor="city" className="mb-1.5 block text-xs font-semibold text-gray-600">Ville <span className="text-orange-500">*</span></Label>
              <Input id="city" name="city" placeholder="Paris" value={formData.city || ''} onChange={handleChange} required className="h-11 rounded-xl border-gray-200" />
            </div>
            <div>
              <Label htmlFor="postalCode" className="mb-1.5 block text-xs font-semibold text-gray-600">Code postal</Label>
              <Input id="postalCode" name="postalCode" placeholder="75001" value={formData.postalCode || ''} onChange={handleChange} className="h-11 rounded-xl border-gray-200" />
            </div>
            <div>
              <Label htmlFor="countryCode" className="mb-1.5 block text-xs font-semibold text-gray-600">Pays</Label>
              <Input id="countryCode" name="countryCode" placeholder="CO" value={formData.countryCode || ''} onChange={handleChange} maxLength={2} required className="h-11 rounded-xl border-gray-200 text-center font-semibold uppercase" />
            </div>
          </div>
        </div>
      </section>

      {/* Précisions géographiques */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-900">Précisions géographiques</h3>
          <p className="text-xs text-gray-400">Utilisées selon les besoins du pays</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="state" className="mb-1.5 block text-xs font-semibold text-gray-600">Région / État</Label>
            <Input id="state" name="state" placeholder="Île-de-France" value={formData.state || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
          </div>
          <div>
            <Label htmlFor="neighborhood" className="mb-1.5 block text-xs font-semibold text-gray-600">Quartier / Barrio</Label>
            <Input id="neighborhood" name="neighborhood" placeholder="El Centro" value={formData.neighborhood || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
          </div>
          <div>
            <Label htmlFor="urbanization" className="mb-1.5 block text-xs font-semibold text-gray-600">Urbanisation</Label>
            <Input id="urbanization" name="urbanization" placeholder="Urbanización..." value={formData.urbanization || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
          </div>
        </div>
      </section>

      {/* Complément d'adresse */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-900">Complément d'adresse</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="buildingName" className="mb-1.5 block text-xs font-semibold text-gray-600">Bâtiment / Résidence</Label>
              <Input id="buildingName" name="buildingName" placeholder="Torres del Parque" value={formData.buildingName || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
            </div>
            <div>
              <Label htmlFor="complement" className="mb-1.5 block text-xs font-semibold text-gray-600">Complément</Label>
              <Input id="complement" name="complement" placeholder="Entrée principale" value={formData.complement || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="floor" className="mb-1.5 block text-xs font-semibold text-gray-600">Étage</Label>
              <Input id="floor" name="floor" placeholder="3" value={formData.floor || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
            </div>
            <div>
              <Label htmlFor="door" className="mb-1.5 block text-xs font-semibold text-gray-600">Appartement / Porte</Label>
              <Input id="door" name="door" placeholder="302 / B" value={formData.door || ''} onChange={handleChange} className="h-10 rounded-xl border-gray-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Instructions livreur */}
      <section>
        <Label htmlFor="instructions" className="mb-1.5 block text-xs font-semibold text-gray-600">Instructions pour le livreur</Label>
        <Input id="instructions" name="instructions" placeholder="Sonner au portail, appeler avant d'arriver..." value={formData.instructions || ''} onChange={handleChange} className="h-11 rounded-xl border-gray-200" />
      </section>

      {/* Informations supplémentaires */}
      <section>
        <Label htmlFor="additionalInfo" className="mb-1.5 block text-xs font-semibold text-gray-600">Informations supplémentaires</Label>
        <Input id="additionalInfo" name="additionalInfo" placeholder="Entrée située derrière le bâtiment..." value={formData.additionalInfo || ''} onChange={handleChange} className="h-11 rounded-xl border-gray-200" />
      </section>

      {/* Position GPS */}
      {formData.lat !== undefined && formData.lng !== undefined && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <Navigation className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-xs font-semibold text-green-800">Position GPS enregistrée</p>
            <p className="text-[10px] text-green-700">{formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 border-t border-gray-100 pt-5">
        {showDelete && onDelete && (
          <Button type="button" variant="outline" onClick={onDelete} className="h-11 rounded-xl border-red-200 px-4 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteLabel}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="h-11 flex-1 rounded-xl bg-orange-500 font-semibold text-white shadow-lg shadow-orange-100 hover:bg-orange-600">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;