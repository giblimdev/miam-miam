//@/components/DetailProduct.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Objet produit complet conforme au modèle Prisma.
 * Sont exclus volontairement : brand, cartItems, orderItems, recipe.
 * composant responsive.
 */
const sampleProduct = {
  id: "clh9x8y7z0000u8d4e6f3a2b1",
  orderdisplay: 0,
  name: "Burger Deluxe",
  slug: "burger-deluxe",
  isMenu: false,
  description:
    "Un burger gourmand avec viande de bœuf, cheddar affiné, salade, tomates et sauce maison.",
  price: 12.5,
  isAvailable: true,
  nutriScore: "B",
  deletedAt: null,
  createdAt: "2025-03-01T10:00:00.000Z",
  updatedAt: "2025-03-10T14:30:00.000Z",
  brandId: "brand-001",

  // Relations (hors brand, cartItems, orderItems, recipe)
  menu: null,
  menuSectionItems: [],
  nutritionalInfo: {
    id: "nut-001",
    nutriScore: "B",
    calories: 850,
    proteins: 35,
    carbohydrates: 60,
    fat: 40,
    fiber: 5,
    salt: 2.5,
    productId: "clh9x8y7z0000u8d4e6f3a2b1",
  },
  optionGroups: [
    {
      id: "og-001",
      name: "Suppléments",
      type: "OPTIONAL",
      minSelection: 0,
      maxSelection: 3,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
      options: [
        {
          id: "opt-001",
          name: "Fromage supplémentaire",
          extraPrice: 1.5,
          isDefault: false,
          optionGroupId: "og-001",
          optionAllergens: [
            { id: "oa-001", value: "Lait", optionId: "opt-001" },
          ],
        },
        {
          id: "opt-002",
          name: "Bacon",
          extraPrice: 2.0,
          isDefault: false,
          optionGroupId: "og-001",
          optionAllergens: [],
        },
      ],
    },
    {
      id: "og-002",
      name: "Cuisson",
      type: "REQUIRED",
      minSelection: 1,
      maxSelection: 1,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
      options: [
        {
          id: "opt-003",
          name: "À point",
          extraPrice: 0,
          isDefault: true,
          optionGroupId: "og-002",
          optionAllergens: [],
        },
        {
          id: "opt-004",
          name: "Saignant",
          extraPrice: 0,
          isDefault: false,
          optionGroupId: "og-002",
          optionAllergens: [],
        },
      ],
    },
  ],
  productAllergens: [
    { id: "pa-001", value: "Gluten", productId: "clh9x8y7z0000u8d4e6f3a2b1" },
    { id: "pa-002", value: "Lait", productId: "clh9x8y7z0000u8d4e6f3a2b1" },
    { id: "pa-003", value: "Œuf", productId: "clh9x8y7z0000u8d4e6f3a2b1" },
  ],
  productScores: [
    {
      id: "ps-001",
      type: "taste",
      score: 4.5,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
    },
    {
      id: "ps-002",
      type: "value",
      score: 4.0,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
    },
  ],
  productStocks: [
    {
      id: "stk-001",
      quantityAvailable: 25,
      threshold: 10,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
      siteId: "site-001",
    },
    {
      id: "stk-002",
      quantityAvailable: 8,
      threshold: 5,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
      siteId: "site-002",
    },
  ],
  categoryAssignments: [
    {
      id: "ca-001",
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
      categoryProductId: "cat-001",
      product: null,
      categoryProduct: {
        id: "cat-001",
        name: "Burgers",
        categoryType: "FOOD",
        orderdisplay: 1,
        description: "Tous nos burgers",
        image: "https://exemple.com/burgers.jpg",
        parentId: null,
        parent: null,
        children: [],
        productAssignments: [],
      },
    },
  ],
  productSpecs: [
    {
      id: "spec-001",
      label: "Poids",
      value: "350g",
      unit: "g",
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
    },
    {
      id: "spec-002",
      label: "Température de conservation",
      value: "4°C",
      unit: null,
      productId: "clh9x8y7z0000u8d4e6f3a2b1",
    },
  ],
  productRelations: [],
  relatedProductRelations: [],

  images: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
  ],
};

/**
 * Badge réutilisable pour indiquer le modèle Prisma associé à une section.
 * Positionné sur la bordure grâce à absolute.
 */
function PrismaBadge({ model }: { model: string }) {
  return (
    <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-xs font-mono text-gray-700 rounded-full border border-gray-200 shadow-sm z-10">
      {model}
    </span>
  );
}

/**
 * Composant d'affichage détaillé d'un produit (modale ou page).
 * Utilise toutes les données disponibles du produit.
 * Bordures colorées + badges Prisma posés sur la bordure.
 */
function DetailProduct() {
  const [activeImage, setActiveImage] = useState(0);
  const product = sampleProduct;

  return (
    <div>
      {/* En-tête : Catégories */}
      <div className="relative border-2 rounded-2xl mx-2 mt-4 p-4 pt-5 border-red-500">
        <PrismaBadge model="CategoryProduct" />
        {product.categoryAssignments.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1">Catégories</h3>
            <div className="flex flex-wrap gap-1">
              {product.categoryAssignments.map((assignment) => (
                <span
                  key={assignment.id}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {assignment.categoryProduct.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Card className="max-w-2xl mx-auto my-6 shadow-xl border-4 border-black flex flex-col max-h-[80vh]">
        {/* Zone scrollable (tout sauf le bouton) */}
        <div className="flex-1 overflow-y-auto">
          <CardHeader className="pb-2 mt-4">
            {/* Titre + note + bouton favori */}
            <div className="relative border-2 rounded-2xl mx-2 p-4 pt-5 border-blue-500">
              <PrismaBadge model="Product / ProductScore" />
              <CardTitle className="flex items-center gap-3">
                <span className="font-bold text-2xl">{product.name}</span>

                {product.productScores.length > 0 && (
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-semibold">
                      {(
                        product.productScores.reduce(
                          (acc, s) => acc + s.score,
                          0,
                        ) / product.productScores.length
                      ).toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({product.productScores.length} critères)
                    </span>
                  </div>
                )}

                <Button variant="outline" size="lg" className="ml-auto">
                  ♡
                </Button>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Galerie d'images */}
            <div className="relative space-y-2 border-2 border-green-500 p-4 pt-5 rounded-lg">
              <PrismaBadge model="Gallery / GalleryImage" />
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg border"
              />
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      index === activeImage
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="relative border-2 border-yellow-500 p-4 pt-5 rounded-lg">
              <PrismaBadge model="Product.description" />
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Prix et disponibilité */}
            <div className="relative flex items-center justify-between border-2 border-purple-500 p-4 pt-5 rounded-lg">
              <PrismaBadge model="Product / ProductStock" />
              <span>
                nombre <span>select</span>
              </span>
              <span className="text-3xl font-bold text-green-600">
                {product.price.toFixed(2)} €
              </span>
              <span
                className={`text-sm font-medium ${
                  product.isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.isAvailable ? "Disponible" : "Indisponible"}
              </span>
            </div>

            {/* Options de personnalisation */}
            {product.optionGroups.length > 0 && (
              <div className="relative border-2 border-indigo-500 p-4 pt-5 rounded-lg">
                <PrismaBadge model="OptionGroup / Option" />
                <h3 className="font-semibold mb-2">Personnalisation</h3>
                {product.optionGroups.map((group) => (
                  <div key={group.id} className="mb-4">
                    <p className="font-medium">
                      {group.name}
                      {group.type === "REQUIRED" && (
                        <span className="text-red-500 text-sm"> *</span>
                      )}
                    </p>
                    <div className="mt-1 space-y-1">
                      {group.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type={
                              group.maxSelection === 1 ? "radio" : "checkbox"
                            }
                            name={group.id}
                            defaultChecked={option.isDefault}
                          />
                          <span>{option.name}</span>
                          {option.extraPrice > 0 && (
                            <span className="text-sm text-gray-500">
                              +{option.extraPrice.toFixed(2)} €
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Spécifications */}
            {product.productSpecs.length > 0 && (
              <div className="relative border-2 border-pink-500 p-4 pt-5 rounded-lg">
                <PrismaBadge model="ProductSpec" />
                <h3 className="font-semibold mb-1">Spécifications</h3>
                <ul className="text-sm">
                  {product.productSpecs.map((spec) => (
                    <li key={spec.id} className="py-1">
                      <span className="font-medium">{spec.label}</span> :{" "}
                      {spec.value}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Allergènes */}
            <div className="relative border-2 border-red-300 p-4 pt-5 rounded-lg">
              <PrismaBadge model="ProductAllergen" />
              <h3 className="font-semibold mb-1">Allergènes</h3>
              <div className="flex flex-wrap gap-1">
                {product.productAllergens.map((allergen) => (
                  <span
                    key={allergen.id}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
                  >
                    {allergen.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Informations nutritionnelles */}
            {product.nutritionalInfo && (
              <div className="relative border-2 border-teal-500 p-4 pt-5 rounded-lg">
                <PrismaBadge model="NutritionalInfo" />
                <h3 className="font-semibold mb-1">Valeurs nutritionnelles</h3>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <p>Calories : {product.nutritionalInfo.calories} kcal</p>
                  <p>Protéines : {product.nutritionalInfo.proteins}g</p>
                  <p>Glucides : {product.nutritionalInfo.carbohydrates}g</p>
                  <p>Lipides : {product.nutritionalInfo.fat}g</p>
                  <p>Fibres : {product.nutritionalInfo.fiber ?? "N/A"}g</p>
                  <p>Sel : {product.nutritionalInfo.salt ?? "N/A"}g</p>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        {/* Footer fixe avec le bouton d'ajout au panier */}
        <CardFooter className=" p-4">
          <div className="relative flex gap-2 w-full">
            <Button className="flex-1" size="lg">
              Ajouter au panier
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DetailProduct;
