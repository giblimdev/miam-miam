// @/components/ProductForm.tsx

/*
  ============================================================
  ProductForm
  ============================================================

  Rôle :
    Formulaire générique d'édition de l'identité d'un produit.

  Champs :
    - Nom
    - Description
    - Prix
    - Devise : COP / EUR
    - Produit menu
    - Image (URL ou fichier local)
    - Note
    - Nombre d'avis

  Architecture :
    - Aucun accès à Zustand
    - Aucun accès à l'API
    - Aucune logique métier de sauvegarde
    - Composant contrôlé par le parent

  Le parent fournit :
    - value
    - onChange
    - onSubmit
    - onReset

  Utilisation :
    IdentityForge
    Product Studio
    autres outils d'édition produit
*/

"use client";

import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================
// Types
// ============================================================

export type ProductCurrency = "COP" | "EUR";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: ProductCurrency;
  isMenu: boolean;
  image: string;
  rating: number;
  reviewCount: number;
}

export interface ProductFormProps {
  value: ProductFormData;

  onChange: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => void;

  onSubmit: () => void;

  onReset: () => void;
}

// ============================================================
// Composant
// ============================================================

export function ProductForm({
  value,
  onChange,
  onSubmit,
  onReset,
}: ProductFormProps) {
  // ==========================================================
  // Référence pour l'input fichier caché
  // ==========================================================

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================================
  // Nom
  // ==========================================================

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange("name", event.target.value);
  };

  // ==========================================================
  // Description
  // ==========================================================

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange("description", event.target.value);
  };

  // ==========================================================
  // Prix
  // ==========================================================

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      onChange("price", 0);
      return;
    }

    const numericValue = Number(rawValue);

    onChange("price", Number.isFinite(numericValue) ? numericValue : 0);
  };

  // ==========================================================
  // Devise
  // ==========================================================

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    if (value !== "COP" && value !== "EUR") {
      return;
    }

    onChange("currency", value);
  };

  // ==========================================================
  // Menu
  // ==========================================================

  const handleMenuChange = (checked: boolean) => {
    onChange("isMenu", checked);
  };

  // ==========================================================
  // Image (fichier local ou URL)
  // ==========================================================

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Vérification du type MIME
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        onChange("image", e.target.result as string);
      }
    };

    reader.onerror = () => {
      alert("Erreur lors de la lecture du fichier.");
    };

    reader.readAsDataURL(file);

    // Réinitialiser la valeur pour permettre de sélectionner le même fichier
    event.target.value = "";
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange("image", event.target.value);
  };

  // ==========================================================
  // Note
  // ==========================================================

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      onChange("rating", 0);
      return;
    }

    const numericValue = Number(rawValue);

    onChange("rating", Number.isFinite(numericValue) ? numericValue : 0);
  };

  // ==========================================================
  // Nombre d'avis
  // ==========================================================

  const handleReviewCountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      onChange("reviewCount", 0);
      return;
    }

    const numericValue = Number(rawValue);

    onChange(
      "reviewCount",
      Number.isFinite(numericValue) ? Math.floor(numericValue) : 0,
    );
  };

  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit();
  };

  // ==========================================================
  // Rendu
  // ==========================================================

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Éditer les informations du produit</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ==================================================
              Informations principales
              ================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Nom */}

            <div className="space-y-2">
              <Label htmlFor="product-name">Nom du produit</Label>

              <Input
                id="product-name"
                name="name"
                value={value.name}
                onChange={handleNameChange}
                placeholder="Ex : Burger Deluxe"
                required
              />
            </div>

            {/* Prix et Devise regroupés */}

            <div className="space-y-2">
              <Label htmlFor="product-price">Prix et devise</Label>

              <div className="flex gap-2">
                <Input
                  id="product-price"
                  name="price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={value.price}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  required
                  className="flex-1"
                />

                <select
                  id="product-currency"
                  name="currency"
                  value={value.currency}
                  onChange={handleCurrencyChange}
                  className="
                    w-32
                    h-10 rounded-md
                    border border-input
                    bg-background
                    px-3 py-2
                    text-sm
                    ring-offset-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-ring
                    focus:ring-offset-2
                  "
                >
                  <option value="COP">COP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {/* Menu */}

            <div className="flex items-center gap-3">
              <Switch
                id="product-menu"
                checked={value.isMenu}
                onCheckedChange={handleMenuChange}
              />

              <Label htmlFor="product-menu">Le produit est un menu</Label>
            </div>

            {/* ==================================================
                Note
                ================================================== */}

            <div className="space-y-2">
              <Label htmlFor="product-rating">Note</Label>

              <Input
                id="product-rating"
                name="rating"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.1"
                value={value.rating}
                onChange={handleRatingChange}
                placeholder="Ex : 90"
              />

              <p className="text-xs text-slate-500">
                Note sur 5 ou pourcentage. Exemple : 4,5 ou 90.
              </p>
            </div>

            {/* Nombre d'avis */}

            <div className="space-y-2">
              <Label htmlFor="product-review-count">Nombre d'avis</Label>

              <Input
                id="product-review-count"
                name="reviewCount"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={value.reviewCount}
                onChange={handleReviewCountChange}
                placeholder="Ex : 25"
              />
            </div>

            {/* Image */}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-image">Image du produit</Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choisir une image
                </Button>

                <span className="text-sm text-slate-500">
                  ou saisir une URL :
                </span>

                <Input
                  id="product-image-url"
                  name="imageUrl"
                  value={value.image.startsWith("data:") ? "" : value.image}
                  onChange={handleImageUrlChange}
                  placeholder="https://exemple.com/image.jpg"
                  className="flex-1 min-w-[200px]"
                />
              </div>

              {value.image && (
                <div className="mt-2">
                  <img
                    src={value.image}
                    alt="Aperçu du produit"
                    className="h-24 w-24 rounded-md object-cover border"
                  />
                </div>
              )}

              <p className="text-xs text-slate-500">
                Formats acceptés : JPG, PNG, GIF. Taille maximale recommandée :
                2 Mo.
              </p>
            </div>

            {/* Description */}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-description">Description</Label>

              <Textarea
                id="product-description"
                name="description"
                value={value.description}
                onChange={handleDescriptionChange}
                placeholder="Description du produit..."
                rows={4}
              />
            </div>
          </div>

          {/* ==================================================
              Actions
              ================================================== */}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onReset}>
              Réinitialiser
            </Button>

            <Button type="submit">Enregistrer les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
