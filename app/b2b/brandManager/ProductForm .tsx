//@ /app/admin/productManager/ProductForm.tsx
/*
 role : Formulaire de création/édition d'un produit, dans un Dialog.
        Même principe que SiteForm.tsx : react-hook-form + zod.
 import:
   - react-hook-form : useForm
   - @hookform/resolvers/zod : zodResolver
   - zod : z (schéma local, aligné sur createProductSchema/updateProductSchema)
   - server actions : @/actions/productManager (createProduct, updateProduct)
   - shadcn/ui : Dialog, Input, Label, Switch, Select, Textarea, Button
   - sonner : toast
   - @/lib/generated/prisma/client : type Product
 useBy : app/admin/productManager/ProductManager.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Schéma local `productFormSchema` : validation côté client, calquée sur
     createProductSchema/updateProductSchema (lib/validations/product.ts) mais sans
     brandId (passé en prop, pas saisi par l'utilisateur).
   * useForm : gère l'état du formulaire, la validation et les erreurs inline.
   * handleFormSubmit : appelle createProduct ou updateProduct selon la présence de `product`,
     puis déclenche onSuccess (refetch côté parent) et ferme le Dialog.
 - Choix techniques :
   * Client Component ('use client'), formulaire contrôlé par react-hook-form.
   * Mode création vs édition déterminé par la prop `product` (null/undefined = création).
   * `reset()` appelé à chaque ouverture pour repartir des bonnes valeurs par défaut.
   * `price` saisi en input number, converti en Float ; `nutriScore` en select A-E (optionnel).
   * Catégories (CategoryProduct) et stock par site (ProductStock) hors scope de ce
     formulaire — extension future, sur le même principe si besoin.
 - Flux de données :
   * Props (open, product, brandId, onOpenChange, onSuccess) → useForm (defaultValues)
   * submit → createProduct/updateProduct (server action) → toast → onSuccess() → onOpenChange(false)
*/

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProduct, updateProduct } from '@/actions/productManager';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/generated/prisma/client';

// ------------------------------------------------------------
// Schéma local (sans brandId, injecté séparément)
// ------------------------------------------------------------

const productFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Le prix doit être positif ou nul'),
  isMenu: z.boolean(),
  isAvailable: z.boolean(),
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E', 'NONE']),
  orderdisplay: z.coerce.number().int(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const EMPTY_VALUES: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  isMenu: false,
  isAvailable: true,
  nutriScore: 'NONE',
  orderdisplay: 0,
};

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Marque à laquelle le produit sera rattaché (création) */
  brandId: string;
  /** Produit à éditer ; absent/null = mode création */
  product?: Product | null;
  /** Callback après sauvegarde réussie (ex: refetch côté parent) */
  onSuccess?: () => void;
}

// ------------------------------------------------------------
// Composant
// ------------------------------------------------------------

export function ProductForm({ open, onOpenChange, brandId, product, onSuccess }: ProductFormProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  /**
   * Réinitialise le formulaire à chaque ouverture, selon le mode (création/édition).
   */
  useEffect(() => {
    if (!open) return;
    reset(
      product
        ? {
            name: product.name,
            description: product.description ?? '',
            price: product.price,
            isMenu: product.isMenu,
            isAvailable: product.isAvailable,
            nutriScore: (product.nutriScore as ProductFormValues['nutriScore']) ?? 'NONE',
            orderdisplay: product.orderdisplay,
          }
        : EMPTY_VALUES
    );
  }, [open, product, reset]);

  const isMenuValue = watch('isMenu');
  const isAvailableValue = watch('isAvailable');
  const nutriScoreValue = watch('nutriScore');

  /**
   * Soumission : création ou mise à jour selon le mode.
   */
  const onSubmit = async (values: ProductFormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        isMenu: values.isMenu,
        isAvailable: values.isAvailable,
        nutriScore: values.nutriScore === 'NONE' ? undefined : values.nutriScore,
        orderdisplay: values.orderdisplay,
        brandId,
      };

      if (isEditing && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du produit :', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le produit' : 'Nouveau produit'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="product-name">Nom</Label>
            <Input id="product-name" {...register('name')} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-description">Description</Label>
            <Textarea id="product-description" rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="product-price">Prix (€)</Label>
              <Input id="product-price" type="number" step="0.01" min="0" {...register('price')} />
              {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="product-orderdisplay">Ordre d'affichage</Label>
              <Input id="product-orderdisplay" type="number" step="1" {...register('orderdisplay')} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-nutriscore">Nutri-Score</Label>
            <Select
              value={nutriScoreValue}
              onValueChange={(v) => setValue('nutriScore', v as ProductFormValues['nutriScore'])}
            >
              <SelectTrigger id="product-nutriscore">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">— Aucun</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="product-ismenu"
              checked={isMenuValue}
              onCheckedChange={(checked) => setValue('isMenu', checked)}
            />
            <Label htmlFor="product-ismenu">Ce produit est un menu</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="product-isavailable"
              checked={isAvailableValue}
              onCheckedChange={(checked) => setValue('isAvailable', checked)}
            />
            <Label htmlFor="product-isavailable">Disponible à la vente</Label>
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