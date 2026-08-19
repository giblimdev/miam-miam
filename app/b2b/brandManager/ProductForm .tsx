// @/app/admin/brandManager/ProductForm.tsx

/*
  Rôle :
    Formulaire de création / édition d'un produit dans un Dialog.

  Responsabilités :
    - Nom
    - Slug
    - Description
    - Prix
    - Type de produit : menu / produit simple
    - Disponibilité
    - NutriScore silencieux avec valeur par défaut "NC"
    - Ordre d'affichage

  Architecture :
    - Client Component
    - react-hook-form
    - zod
    - server actions productManager
    - shadcn/ui

  NutriCare :
    - Aucune gestion UI spécifique
    - Aucune logique métier
    - Valeur par défaut : "NC"
    - Le champ n'est pas affiché dans le formulaire

  Utilisé par :
    - app/admin/brandManager/ProductManager.tsx
*/

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createProduct, updateProduct } from "@/actions/productManager";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import type { Product } from "@/lib/generated/prisma/client";

// ============================================================
// Schéma
// ============================================================

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),

  slug: z
    .string()
    .trim()
    .min(1, "Le slug est requis")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets",
    ),

  description: z.string().optional(),

  price: z.number().min(0, "Le prix doit être positif ou nul"),

  isMenu: z.boolean(),

  isAvailable: z.boolean(),

  /*
    NutriCare est volontairement silencieux.

    "NC" est transmis comme valeur par défaut.
    Le champ n'est pas affiché dans l'interface.
  */
  nutriScore: z.enum(["A", "B", "C", "D", "E", "NC"]),

  orderdisplay: z.number().int().min(0),
});

// ============================================================
// Type du formulaire
// ============================================================

type ProductFormValues = z.infer<typeof productFormSchema>;

// ============================================================
// Valeurs par défaut
// ============================================================

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  isMenu: false,
  isAvailable: true,

  // NutriCare silencieux
  nutriScore: "NC",

  orderdisplay: 0,
};

// ============================================================
// Props
// ============================================================

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
  product?: Product | null;
  onSuccess?: () => void;
}

// ============================================================
// Composant
// ============================================================

export function ProductForm({
  open,
  onOpenChange,
  brandId,
  product,
  onSuccess,
}: ProductFormProps) {
  const isEditing = Boolean(product);

  // ==========================================================
  // React Hook Form
  // ==========================================================

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

  // ==========================================================
  // Synchronisation ouverture / produit
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!product) {
      reset(EMPTY_VALUES);
      return;
    }

    reset({
      name: product.name ?? "",

      slug: product.slug ?? "",

      description: product.description ?? "",

      price: Number.isFinite(product.price) ? product.price : 0,

      isMenu: Boolean(product.isMenu),

      isAvailable: Boolean(product.isAvailable),

      /*
        Les anciens produits peuvent éventuellement
        avoir une valeur absente/null.
        Dans ce cas on utilise NC.
      */
      nutriScore:
        product.nutriScore === "A" ||
        product.nutriScore === "B" ||
        product.nutriScore === "C" ||
        product.nutriScore === "D" ||
        product.nutriScore === "E"
          ? product.nutriScore
          : "NC",

      orderdisplay: Number.isFinite(product.orderdisplay)
        ? product.orderdisplay
        : 0,
    });
  }, [open, product, reset]);

  // ==========================================================
  // Valeurs observées
  // ==========================================================

  const isMenuValue = watch("isMenu");
  const isAvailableValue = watch("isAvailable");

  // ==========================================================
  // Soumission
  // ==========================================================

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const payload = {
        name: values.name.trim(),

        slug: values.slug.trim(),

        description: values.description?.trim() || undefined,

        price: values.price,

        isMenu: values.isMenu,

        isAvailable: values.isAvailable,

        /*
          NutriCare reste silencieux.
          La valeur est néanmoins envoyée à la base.
        */
        nutriScore: values.nutriScore,

        orderdisplay: values.orderdisplay,

        brandId,
      };

      // ======================================================
      // Modification
      // ======================================================

      if (isEditing && product) {
        await updateProduct(product.id, payload);
      }

      // ======================================================
      // Création
      // ======================================================
      else {
        await createProduct(payload);
      }

      // ======================================================
      // Succès
      // ======================================================

      onSuccess?.();

      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du produit :", error);
    }
  };

  // ==========================================================
  // Rendu
  // ==========================================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* ====================================================
            En-tête
            ==================================================== */}

        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le produit" : "Nouveau produit"}
          </DialogTitle>
        </DialogHeader>

        {/* ====================================================
            Formulaire
            ==================================================== */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ==================================================
              Nom
              ================================================== */}

          <div className="space-y-1">
            <Label htmlFor="product-name">Nom</Label>

            <Input
              id="product-name"
              {...register("name")}
              placeholder="Ex : Burger Deluxe"
            />

            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* ==================================================
              Slug
              ================================================== */}

          <div className="space-y-1">
            <Label htmlFor="product-slug">Slug</Label>

            <Input
              id="product-slug"
              {...register("slug")}
              placeholder="burger-deluxe"
            />

            {errors.slug && (
              <p className="text-xs text-red-600">{errors.slug.message}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Identifiant URL du produit.
            </p>
          </div>

          {/* ==================================================
              Description
              ================================================== */}

          <div className="space-y-1">
            <Label htmlFor="product-description">Description</Label>

            <Textarea
              id="product-description"
              rows={3}
              {...register("description")}
              placeholder="Description du produit..."
            />
          </div>

          {/* ==================================================
              Prix / Ordre
              ================================================== */}

          <div className="grid grid-cols-2 gap-3">
            {/* Prix */}

            <div className="space-y-1">
              <Label htmlFor="product-price">Prix</Label>

              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  valueAsNumber: true,
                })}
              />

              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Ordre */}

            <div className="space-y-1">
              <Label htmlFor="product-orderdisplay">Ordre d'affichage</Label>

              <Input
                id="product-orderdisplay"
                type="number"
                step="1"
                min="0"
                {...register("orderdisplay", {
                  valueAsNumber: true,
                })}
              />

              {errors.orderdisplay && (
                <p className="text-xs text-red-600">
                  {errors.orderdisplay.message}
                </p>
              )}
            </div>
          </div>

          {/* ==================================================
              Type Menu
              ================================================== */}

          <div className="flex items-center gap-3">
            <Switch
              id="product-ismenu"
              checked={isMenuValue}
              onCheckedChange={(checked) =>
                setValue("isMenu", checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />

            <Label htmlFor="product-ismenu">Ce produit est un menu</Label>
          </div>

          {/* ==================================================
              Disponibilité
              ================================================== */}

          <div className="flex items-center gap-3">
            <Switch
              id="product-isavailable"
              checked={isAvailableValue}
              onCheckedChange={(checked) =>
                setValue("isAvailable", checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />

            <Label htmlFor="product-isavailable">Disponible à la vente</Label>
          </div>

          {/* ==================================================
              NutriCare
              ==================================================

              Pas d'affichage volontaire.

              Le formulaire conserve simplement :
                  nutriScore = "NC"

              et le transmet à createProduct/updateProduct.
              ================================================== */}

          {/* ==================================================
              Actions
              ================================================== */}

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
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
