// @/app/b2b/productTools/identityForge/page.tsx

//
// ============================================================
// Identity Forge
// ============================================================
//
// Rôle :
//   Outil de construction de l'identité de base d'un produit.
//
// Responsabilités de la page :
//   - Lire le produit sélectionné
//   - Synchroniser le store produit
//   - Gérer le store de vignette
//   - Maintenir l'état local du formulaire
//   - Afficher l'aperçu
//   - Afficher le ProductSelector
//
// Le formulaire est délégué à :
//   /components/ProductForm.tsx
//
// ============================================================

"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";

// ============================================================
// Composants application
// ============================================================

import { ShowsStores } from "@/components/ShowStore";
import { ProductSelector } from "@/components/ProductSelector";
import { VignetteProduct } from "@/components/VignetteProduct";
import { ProductForm, type ProductFormData } from "@/components/ProductForm";

// ============================================================
// Stores
// ============================================================

import { useProductVignetteStore } from "@/stores/useProductVignetteStore";

import { useProductStore } from "@/stores/useProductIdStore";

// ============================================================
// Shadcn UI
// ============================================================

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ============================================================
// Types
// ============================================================

type Currency = "COP" | "EUR";

// ============================================================
// Constantes
// ============================================================

const DEFAULT_CURRENCY: Currency = "COP";

// ============================================================
// Composant principal
// ============================================================

export default function IdentityForgePage() {
  // ==========================================================
  // Store Vignette
  // ==========================================================

  const {
    name,
    description,
    price,
    currency,
    isMenu,
    image,
    rating,
    reviewCount,

    updateVignette,
    setFromProduct,
  } = useProductVignetteStore();

  // ==========================================================
  // Store Produit
  // ==========================================================

  const { selectedProductId } = useProductStore();

  // ==========================================================
  // Formulaire local
  // ==========================================================

  const [formData, setFormData] = useState<ProductFormData>(() => ({
    name: name || "",

    description: description || "",

    price: Number.isFinite(price) ? price : 0,

    currency:
      currency === "EUR" || currency === "COP" ? currency : DEFAULT_CURRENCY,

    isMenu: Boolean(isMenu),

    image: image || "",

    rating: Number.isFinite(rating) ? rating : 0,

    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
  }));

  // ==========================================================
  // Dialog ProductSelector
  // ==========================================================

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // ==========================================================
  // Synchronisation Store → Formulaire
  // ==========================================================

  useEffect(() => {
    setFormData({
      name: name || "",

      description: description || "",

      price: Number.isFinite(price) ? price : 0,

      currency:
        currency === "EUR" || currency === "COP" ? currency : DEFAULT_CURRENCY,

      isMenu: Boolean(isMenu),

      image: image || "",

      rating: Number.isFinite(rating) ? rating : 0,

      reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    });
  }, [name, description, price, currency, isMenu, image, rating, reviewCount]);

  // ==========================================================
  // Produit sélectionné
  // ==========================================================
  //
  // Le chargement réel via productManager doit être branché
  // ici lorsque la signature exacte de l'action est définie.
  //
  // setFromProduct() attend :
  //
  // {
  //   name,
  //   description,
  //   price,
  //   currency,
  //   isMenu,
  //   image,
  //   rating,
  //   reviewCount
  // }
  //
  // ==========================================================

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }

    /*
    Exemple lorsque productManager sera branché :

    const loadProduct = async () => {
      try {
        const product = await getProductById(
          selectedProductId
        );

        if (!product) {
          toast.error(
            "Produit introuvable."
          );

          return;
        }

        setFromProduct(product);

      } catch (error) {
        console.error(error);

        toast.error(
          "Impossible de charger le produit."
        );
      }
    };

    loadProduct();
    */
  }, [selectedProductId, setFromProduct]);

  // ==========================================================
  // Modification d'un champ du formulaire
  // ==========================================================

  const handleFormChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================================
  // Enregistrement
  // ==========================================================

  const handleSubmit = () => {
    // --------------------------------------------------------
    // Nom
    // --------------------------------------------------------

    const cleanName = formData.name.trim();

    if (!cleanName) {
      toast.error("Le nom du produit est obligatoire.");

      return;
    }

    // --------------------------------------------------------
    // Prix
    // --------------------------------------------------------

    if (!Number.isFinite(formData.price) || formData.price < 0) {
      toast.error("Le prix du produit est invalide.");

      return;
    }

    // --------------------------------------------------------
    // Note
    // --------------------------------------------------------

    if (
      !Number.isFinite(formData.rating) ||
      formData.rating < 0 ||
      formData.rating > 100
    ) {
      toast.error("La note doit être comprise entre 0 et 100.");

      return;
    }

    // --------------------------------------------------------
    // Nombre d'avis
    // --------------------------------------------------------

    if (!Number.isFinite(formData.reviewCount) || formData.reviewCount < 0) {
      toast.error("Le nombre d'avis est invalide.");

      return;
    }

    // --------------------------------------------------------
    // Mise à jour Zustand
    // --------------------------------------------------------

    updateVignette({
      name: cleanName,

      description: formData.description.trim(),

      price: formData.price,

      currency: formData.currency,

      isMenu: formData.isMenu,

      image: formData.image.trim() || null,

      rating: formData.rating,

      reviewCount: Math.floor(formData.reviewCount),
    });

    // --------------------------------------------------------
    // Confirmation
    // --------------------------------------------------------

    toast.success("Identité du produit mise à jour !");
  };

  // ==========================================================
  // Réinitialisation
  // ==========================================================

  const handleReset = () => {
    setFormData({
      name: name || "",

      description: description || "",

      price: Number.isFinite(price) ? price : 0,

      currency:
        currency === "EUR" || currency === "COP" ? currency : DEFAULT_CURRENCY,

      isMenu: Boolean(isMenu),

      image: image || "",

      rating: Number.isFinite(rating) ? rating : 0,

      reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    });

    toast.info("Champs réinitialisés.");
  };

  // ==========================================================
  // Rendu
  // ==========================================================

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ======================================================
          Contexte User / Brand / Product
          ====================================================== */}

      <ShowsStores state="product" />

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mt-6 space-y-8"
      >
        {/* ====================================================
            En-tête
            ==================================================== */}

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Identity Forge
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Construction de l'identité et de la vignette du produit.
            </p>
          </div>

          {/* ==================================================
              Product Selector
              ================================================== */}

          <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSelectorOpen(true)}
            >
              Changer de produit
            </Button>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Sélectionner un produit</DialogTitle>
              </DialogHeader>

              <ProductSelector
                onSelect={() => setIsSelectorOpen(false)}
                className="max-h-96"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* ====================================================
            Description
            ==================================================== */}

        <aside
          className="
            rounded-lg
            border border-blue-200
            bg-blue-50
            p-4
            text-sm
            text-blue-800
          "
        >
          <p className="font-semibold">Identity Forge</p>

          <p className="mt-1">
            Construisez l'identité de base de la vignette produit : nom,
            description, prix, devise, type de produit, image, note et nombre
            d'avis.
          </p>

          <p className="mt-1">
            Devises disponibles : <strong>COP</strong> et <strong>EUR</strong>.
          </p>
        </aside>

        {/* ====================================================
            Aperçu
            ==================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Aperçu en temps réel
            </h2>

            <p className="text-sm text-slate-500">
              L'aperçu utilise les valeurs actuellement saisies dans le
              formulaire.
            </p>
          </div>

          <VignetteProduct
            name={formData.name}
            description={formData.description}
            price={formData.price}
            currency={formData.currency}
            image={formData.image || null}
            isMenu={formData.isMenu}
            rating={formData.rating}
            reviewCount={formData.reviewCount}
          />
        </section>

        {/* ====================================================
            Références visuelles
            ==================================================== */}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Références de vignettes
          </h2>

          <div className="flex flex-wrap gap-4">
            <Image
              src="/produitVignetteUber.png"
              alt="Exemple de vignette produit Uber Eats"
              width={400}
              height={300}
              className="
                h-auto
                w-[400px]
                rounded-md
                object-contain
              "
            />

            <Image
              src="/produitVignetteRappi.png"
              alt="Exemple de vignette produit Rappi"
              width={400}
              height={300}
              className="
                h-auto
                w-[400px]
                rounded-md
                object-contain
              "
            />

            <Image
              src="/produitVignetteDeliveroo.png"
              alt="Exemple de vignette produit Deliveroo"
              width={400}
              height={300}
              className="
                h-auto
                w-[400px]
                rounded-md
                object-contain
              "
            />
          </div>
        </section>

        {/* ====================================================
            Formulaire
            ==================================================== */}

        <ProductForm
          value={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </motion.div>
    </div>
  );
}
