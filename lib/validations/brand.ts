//@ /lib/validations/brand.ts
/*
 role : Schémas Zod pour la validation des marques (création/édition),
        et types dérivés utilisés par les server actions et BrandForm.tsx.
 useBy : /actions/brandManager.ts, /app/admin/brandManager/BrandForm.tsx
*/

import { z } from 'zod';

export const createBrandSchema = z.object({
  slug: z.string().min(1, 'Le slug est requis'),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  logo: z.string().optional(),
  website: z.string().optional(),
  /** Liste des BrandType.value à créer/remplacer */
  type: z.array(z.string()).min(1, 'Sélectionnez au moins un type'),
});

export const updateBrandSchema = createBrandSchema.partial().extend({
  type: z.array(z.string()).min(1, 'Sélectionnez au moins un type'),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;