//@ /app/admin/siteManager/SiteForm.tsx
/*
 role : Formulaire de création/édition d'un site, dans un Dialog.
        Extrait de SiteManager.tsx pour être réutilisable et testable isolément,
        sur le même principe que BrandForm.tsx.
 import:
   - react-hook-form : useForm
   - @hookform/resolvers/zod : zodResolver
   - zod : z (schéma local, aligné sur createSiteSchema/updateSiteSchema)
   - server actions : @/actions/siteManager (createSite, updateSite)
   - shadcn/ui : Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
                 Input, Label, Switch, Button
   - sonner : toast
   - @/lib/generated/prisma/client : type Site
 useBy : app/admin/siteManager/SiteManager.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Schéma local `siteFormSchema` : validation côté client, calquée sur
     createSiteSchema/updateSiteSchema (lib/validations/site.ts) mais sans brandId
     (celui-ci est passé en prop, pas saisi par l'utilisateur).
   * useForm : gère l'état du formulaire, la validation et les erreurs inline.
   * handleFormSubmit : appelle createSite ou updateSite selon la présence de `site`,
     puis déclenche onSuccess (refetch côté parent) et ferme le Dialog.
 - Choix techniques :
   * Client Component ('use client'), formulaire contrôlé par react-hook-form.
   * Mode création vs édition déterminé par la prop `site` (null/undefined = création).
   * `reset()` appelé à chaque ouverture pour repartir des bonnes valeurs par défaut
     (évite qu'un ancien site édité reste affiché si on rouvre en création).
 - Flux de données :
   * Props (open, site, brandId, onOpenChange, onSuccess) → useForm (defaultValues)
   * submit → createSite/updateSite (server action) → toast → onSuccess() → onOpenChange(false)
*/

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSite, updateSite } from '@/actions/siteManager';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Site } from '@/lib/generated/prisma/client';

// ------------------------------------------------------------
// Schéma local (sans brandId, injecté séparément)
// ------------------------------------------------------------

const siteFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  isOpen: z.boolean(),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

const EMPTY_VALUES: SiteFormValues = { name: '', phone: '', email: '', isOpen: true };

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

interface SiteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Marque à laquelle le site sera rattaché (création) */
  brandId: string;
  /** Site à éditer ; absent/null = mode création */
  site?: Site | null;
  /** Callback après sauvegarde réussie (ex: refetch côté parent) */
  onSuccess?: () => void;
}

// ------------------------------------------------------------
// Composant
// ------------------------------------------------------------

export function SiteForm({ open, onOpenChange, brandId, site, onSuccess }: SiteFormProps) {
  const isEditing = !!site;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  /**
   * Réinitialise le formulaire à chaque ouverture, selon le mode (création/édition).
   */
  useEffect(() => {
    if (!open) return;
    reset(
      site
        ? {
            name: site.name,
            phone: site.phone ?? '',
            email: site.email ?? '',
            isOpen: site.isOpen,
          }
        : EMPTY_VALUES
    );
  }, [open, site, reset]);

  const isOpenValue = watch('isOpen');

  /**
   * Soumission : création ou mise à jour selon le mode.
   */
  const onSubmit = async (values: SiteFormValues) => {
    try {
      const payload = {
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        isOpen: values.isOpen,
        brandId,
      };

      if (isEditing && site) {
        await updateSite(site.id, payload);
      } else {
        await createSite(payload);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      // Le toast d'erreur est déjà géré côté server action ; on log pour le debug.
      console.error('Erreur lors de la sauvegarde du site :', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le site' : 'Nouveau site'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="site-name">Nom</Label>
            <Input id="site-name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="site-phone">Téléphone</Label>
            <Input id="site-phone" {...register('phone')} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="site-email">Email</Label>
            <Input id="site-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="site-isopen"
              checked={isOpenValue}
              onCheckedChange={(checked) => setValue('isOpen', checked)}
            />
            <Label htmlFor="site-isopen">Site ouvert</Label>
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