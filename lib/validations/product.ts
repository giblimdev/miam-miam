//@ /lib/validations/product.ts
/*
 role : Schémas Zod pour la validation des produits (création/édition),
        et types dérivés utilisés par les server actions et ProductForm.tsx.
 useBy : /actions/productManager.ts, /app/admin/productManager/ProductForm.tsx
*/

import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  price: z.number().min(0, 'Le prix doit être positif ou nul'),
  isMenu: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E']).optional(),
  orderdisplay: z.number().int().default(0),
  brandId: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial().extend({
  brandId: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;