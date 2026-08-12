//@ /lib/validations/site.ts
/*
 role : Schémas Zod pour la validation des sites (création/édition),
        et types dérivés utilisés par les server actions et SiteForm.tsx.
 useBy : /actions/siteManager.ts, /app/admin/siteManager/SiteForm.tsx
*/

import { z } from 'zod';

export const createSiteSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  isOpen: z.boolean().default(true),
  brandId: z.string().min(1),
});

export const updateSiteSchema = createSiteSchema.partial().extend({
  brandId: z.string().min(1),
});

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;