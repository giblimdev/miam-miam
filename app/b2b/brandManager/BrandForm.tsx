// app/b2b/brandManager/BrandForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBrand, updateBrand } from '@/actions/brandManager';
import type { CreateBrandInput, UpdateBrandInput } from '@/lib/validations/brand';

interface BrandFormProps {
  initialData?: CreateBrandInput & { id?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BrandForm({ initialData, onSuccess, onCancel }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Champs du formulaire
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [logo, setLogo] = useState(initialData?.logo || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [types, setTypes] = useState<string[]>(initialData?.type || []);
  const [newType, setNewType] = useState('');

  const isEdit = !!initialData?.id;

  const addType = () => {
    const trimmed = newType.trim();
    if (trimmed && !types.includes(trimmed)) {
      setTypes([...types, trimmed]);
      setNewType('');
    }
  };

  const removeType = (type: string) => {
    setTypes(types.filter(t => t !== type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, slug, description, logo, website, type: types };
      if (isEdit) {
        await updateBrand(initialData.id!, data as UpdateBrandInput);
        toast.success('Marque mise à jour');
      } else {
        await createBrand(data as CreateBrandInput);
        toast.success('Marque créée');
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Nom *</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Pizzeria Bella"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium">Slug *</label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex: pizzeria-bella"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la marque"
        />
      </div>

      <div>
        <label htmlFor="logo" className="block text-sm font-medium">Logo (URL)</label>
        <Input
          id="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium">Site web</label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Types de marque</label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Ajouter un type"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addType())}
          />
          <Button type="button" onClick={addType} variant="outline">
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {types.map((type) => (
            <span
              key={type}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
            >
              {type}
              <button
                type="button"
                onClick={() => removeType(type)}
                className="hover:text-destructive"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}