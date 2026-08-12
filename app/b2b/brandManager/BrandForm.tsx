//@ /app/admin/brandManager/BrandForm.tsx
/*
 role : Formulaire de création/édition d'une marque, dans un Dialog.
        Même principe que SiteForm.tsx/ProductForm.tsx : react-hook-form + zod.
        Le champ "type" (BrandType[]) est une sélection multiple sous forme de
        checkboxes, alimentée par BRAND_TYPES (lib/data/brandTypeData.ts).
 import:
   - react-hook-form : useForm
   - @hookform/resolvers/zod : zodResolver
   - zod : z (schéma local, aligné sur createBrandSchema/updateBrandSchema)
   - server actions : @/actions/brandManager (createBrand, updateBrand)
   - @/lib/data/brandTypeData : BRAND_TYPES
   - shadcn/ui : Dialog, Input, Label, Textarea, Checkbox, Button
   - lucide-react : Wand2 (bouton "générer le slug")
   - @/lib/generated/prisma/client : type Brand
 useBy : app/admin/brandManager/BrandManager.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Schéma local `brandFormSchema` : validation côté client, calquée sur
     createBrandSchema/updateBrandSchema (lib/validations/brand.ts).
   * `slugify()` : génère un slug à partir du nom (bouton dédié, pas d'auto-sync
     silencieux — on ne veut pas écraser un slug déjà personnalisé par erreur).
   * Sélection de types : cases à cocher listant BRAND_TYPES, stockées comme
     tableau de `value` dans le formulaire (correspond à BrandType[] côté Prisma).
   * handleFormSubmit : appelle createBrand ou updateBrand selon la présence de `brand`.
 - Choix techniques :
   * Client Component ('use client'), formulaire contrôlé par react-hook-form.
   * Mode création vs édition déterminé par la prop `brand` (null/undefined = création).
   * `reset()` appelé à chaque ouverture ; en édition, `type` est réhydraté à partir
     de `brand.BrandType` (relation), avec repli sur tableau vide si absente.
 - Flux de données :
   * Props (open, brand, onOpenChange, onSuccess) → useForm (defaultValues)
   * submit → createBrand/updateBrand (server action) → toast → onSuccess() → onOpenChange(false)
*/

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrand, updateBrand } from '@/actions/brandManager';
import { BRAND_TYPES } from '@/lib/data/brandTypeData';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import type { Brand } from '@/lib/generated/prisma/client';

// ------------------------------------------------------------
// Utilitaire local
// ------------------------------------------------------------

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ------------------------------------------------------------
// Schéma local
// ------------------------------------------------------------

const brandFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  description: z.string().min(1, 'La description est requise'),
  logo: z.string().url('URL invalide').optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  type: z.array(z.string()).min(1, 'Sélectionnez au moins un type'),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

const EMPTY_VALUES: BrandFormValues = {
  name: '',
  slug: '',
  description: '',
  logo: '',
  website: '',
  type: [],
};

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

interface BrandWithRelations extends Brand {
  BrandType?: { id: string; value: string }[];
}

interface BrandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Marque à éditer ; absent/null = mode création */
  brand?: BrandWithRelations | null;
  /** Callback après sauvegarde réussie (ex: refetch côté parent) */
  onSuccess?: () => void;
}

// ------------------------------------------------------------
// Composant
// ------------------------------------------------------------

export function BrandForm({ open, onOpenChange, brand, onSuccess }: BrandFormProps) {
  const isEditing = !!brand;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  /**
   * Réinitialise le formulaire à chaque ouverture, selon le mode (création/édition).
   */
  useEffect(() => {
    if (!open) return;
    reset(
      brand
        ? {
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            logo: brand.logo ?? '',
            website: brand.website ?? '',
            type: brand.BrandType?.map((t) => t.value) ?? [],
          }
        : EMPTY_VALUES
    );
  }, [open, brand, reset]);

  const nameValue = watch('name');
  const typeValue = watch('type');

  /**
   * Génère le slug à partir du nom courant (action explicite, pas d'auto-sync).
   */
  const handleGenerateSlug = () => {
    setValue('slug', slugify(nameValue || ''), { shouldValidate: true });
  };

  /**
   * Ajoute/retire un type de la sélection.
   */
  const toggleType = (value: string, checked: boolean) => {
    const next = checked
      ? [...typeValue, value]
      : typeValue.filter((v) => v !== value);
    setValue('type', next, { shouldValidate: true });
  };

  /**
   * Soumission : création ou mise à jour selon le mode.
   */
  const onSubmit = async (values: BrandFormValues) => {
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        logo: values.logo || undefined,
        website: values.website || undefined,
        type: values.type,
      };

      if (isEditing && brand) {
        await updateBrand(brand.id, payload);
      } else {
        await createBrand(payload);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la marque :', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier la marque' : 'Nouvelle marque'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="brand-name">Nom</Label>
            <Input id="brand-name" {...register('name')} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand-slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="brand-slug" className="font-mono" {...register('slug')} />
              <Button type="button" variant="outline" size="icon" onClick={handleGenerateSlug}>
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
            {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand-description">Description</Label>
            <Textarea id="brand-description" rows={3} {...register('description')} />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand-logo">Logo (URL)</Label>
            <Input id="brand-logo" {...register('logo')} />
            {errors.logo && <p className="text-xs text-red-600">{errors.logo.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand-website">Site web</Label>
            <Input id="brand-website" {...register('website')} />
            {errors.website && <p className="text-xs text-red-600">{errors.website.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Types</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-3">
              {BRAND_TYPES.map((t) => (
                <div key={t.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-type-${t.value}`}
                    checked={typeValue.includes(t.value)}
                    onCheckedChange={(checked) => toggleType(t.value, !!checked)}
                  />
                  <Label htmlFor={`brand-type-${t.value}`} className="text-sm font-normal">
                    {t.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-600">{errors.type.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}