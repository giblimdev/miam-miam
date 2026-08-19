// @/lib/dat/allergenData.ts

/**
 * Interface représentant un allergène.
 * Utilisée pour les listes d'allergènes (ProfilAllergy, ProductAllergen, OptionAllergen).
 */
export interface Allergen {
  id: string; // Identifiant unique
  orderDisplay: number; // Ordre d'affichage
  name: string; // Nom de l'allergène
  description?: string; // Description optionnelle (détails, sources)
  // Ajoutez d'autres champs si nécessaire (ex. cardDescription pour les cartes)
}

/**
 * Liste des allergènes courants (réglementation INCO / UE).
 * Chaque allergène est un objet avec un identifiant unique et un ordre d'affichage.
 */

/*réglementation européenne (règlement INCO 1169/2011) */
export const allergens: Allergen[] = [
  {
    id: "allergen-gluten",
    orderDisplay: 1,
    name: "Gluten",
    description:
      "Céréales contenant du gluten (blé, seigle, orge, avoine, épeautre, kamut).",
  },
  {
    id: "allergen-milk",
    orderDisplay: 2,
    name: "Lait",
    description: "Lait et produits laitiers (y compris lactose).",
  },
  {
    id: "allergen-egg",
    orderDisplay: 3,
    name: "Œuf",
    description: "Œufs et produits à base d'œufs.",
  },
  {
    id: "allergen-peanut",
    orderDisplay: 4,
    name: "Arachide",
    description: "Arachides et produits dérivés.",
  },
  {
    id: "allergen-soy",
    orderDisplay: 5,
    name: "Soja",
    description: "Soja et produits à base de soja.",
  },
  {
    id: "allergen-nuts",
    orderDisplay: 6,
    name: "Fruits à coque",
    description: "Amandes, noisettes, noix, noix de cajou, pistaches, etc.",
  },
  {
    id: "allergen-fish",
    orderDisplay: 7,
    name: "Poisson",
    description: "Poissons et produits à base de poisson.",
  },
  {
    id: "allergen-crustaceans",
    orderDisplay: 8,
    name: "Crustacés",
    description: "Crevettes, crabes, homards, langoustines, etc.",
  },
  {
    id: "allergen-celery",
    orderDisplay: 9,
    name: "Céleri",
    description: "Céleri et produits dérivés.",
  },
  {
    id: "allergen-mustard",
    orderDisplay: 10,
    name: "Moutarde",
    description: "Graines de moutarde et produits dérivés.",
  },
  {
    id: "allergen-sesame",
    orderDisplay: 11,
    name: "Sésame",
    description: "Graines de sésame et produits dérivés.",
  },
  {
    id: "allergen-sulfites",
    orderDisplay: 12,
    name: "Sulfites",
    description: "Anhydride sulfureux et sulfites (concentration > 10 mg/kg).",
  },
  {
    id: "allergen-lupin",
    orderDisplay: 13,
    name: "Lupin",
    description: "Lupin et produits à base de lupin.",
  },
  {
    id: "allergen-molluscs",
    orderDisplay: 14,
    name: "Mollusques",
    description: "Moules, huîtres, palourdes, escargots, etc.",
  },
];
