//@/app/b2b/productionTool/page.tsx
/*
toujours concerver 
// ============================================================
// 5. PRODUITS & MENUS
// ============================================================

// ==========================================
// PRODUIT
// ==========================================
model Product {
  id              String   @id @default(cuid())
  orderdisplay    Int      @default(0)
  name            String
  slug            String   @unique // 
  isMenu          Boolean  @default(false)
  description     String?
  price           Float
  isAvailable     Boolean  @default(true)
  nutriScore      String?
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  brandId String
  brand   Brand   @relation(fields: [brandId], references: [id])

  // Relations existantes
  CartItem        CartItem[]
  Gallery         Gallery?
  Menu            Menu?
  MenuSectionItem MenuSectionItem[]
  NutritionalInfo NutritionalInfo?
  OptionGroup     OptionGroup[]
  OrderItem       OrderItem[]
  ProductAllergen ProductAllergen[]
  ProductScore    ProductScore[]
  ProductStock    ProductStock[]
  Recipe          Recipe?

  // Liaison many-to-many avec les catégories
  categoryAssignments CategoryAssignmentProduct[]

  // Spécifications produit (table dédiée)
  productSpecs ProductSpec[]
}

// ==========================================
// CATÉGORIES (avec sous-catégories auto-référencées)
// ==========================================
model CategoryProduct {
  id           String  @id @default(cuid())
  name         String
  categoryType String  // ex: "FOOD", "DRINK", "MENU", "CLEANING", "PACK"
  orderdisplay Int     @default(0)
  description  String  @default("")
  image        String?

  // Hiérarchie parent/enfant
  parentId String?
  parent   CategoryProduct?  @relation("CategoryChildren", fields: [parentId], references: [id], onDelete: SetNull)
  children CategoryProduct[] @relation("CategoryChildren")

  // Liaison many-to-many avec les produits
  productAssignments CategoryAssignmentProduct[]

  @@index([parentId])
}

// ==========================================
// TABLE DE LIAISON : Produit ↔ Catégorie
// ==========================================
model CategoryAssignmentProduct {
  id                String @id @default(cuid())
  productId         String
  categoryProductId String

  product          Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryProduct  CategoryProduct @relation(fields: [categoryProductId], references: [id], onDelete: Cascade)

  @@unique([productId, categoryProductId])
  @@index([productId])
  @@index([categoryProductId])
}

// ==========================================
// SPÉCIFICATIONS PRODUIT
// ==========================================
model ProductSpec {
  id        String  @id @default(cuid())
  label     String  // ex: "Poids", "Volume", "Matière", "Température de conservation"
  value     String  // ex: "500g", "1L", "Coton", "4°C"
  unit      String? // ex: "g", "ml", "cm"

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductAllergen {
  id        String  @id @default(cuid())
  value     String
  productId String
  Product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductScore {
  id        String  @id @default(cuid())
  type      String
  score     Float
  productId String
  Product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model NutritionalInfo {
  id            String  @id @default(cuid())
  calories      Float
  proteins      Float
  carbohydrates Float
  fat           Float
  fiber         Float?
  salt          Float?
  productId     String  @unique
  Product       Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// ----- OPTIONS & GROUPES -----

model OptionGroup {
  id           String   @id @default(cuid())
  name         String
  type         String   @default("OPTIONAL")
  minSelection Int      @default(0)
  maxSelection Int      @default(1)
  productId    String
  Option       Option[]
  Product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model Option {
  id             String           @id @default(cuid())
  name           String
  extraPrice     Float            @default(0)
  isDefault      Boolean          @default(false)
  optionGroupId  String
  OptionGroup    OptionGroup      @relation(fields: [optionGroupId], references: [id], onDelete: Cascade)
  OptionAllergen OptionAllergen[]

  @@index([optionGroupId])
}

model OptionAllergen {
  id       String @id @default(cuid())
  value    String
  optionId String
  Option   Option @relation(fields: [optionId], references: [id], onDelete: Cascade)

  @@index([optionId])
}

// ----- MENUS -----

model Menu {
  id          String        @id @default(cuid())
  title       String
  productId   String        @unique
  Product     Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  MenuSection MenuSection[]
}

model MenuSection {
  id              String            @id @default(cuid())
  name            String
  minSelection    Int               @default(0)
  maxSelection    Int               @default(1)
  menuId          String
  Menu            Menu              @relation(fields: [menuId], references: [id], onDelete: Cascade)
  MenuSectionItem MenuSectionItem[]
  @@index([menuId])
}
model MenuSectionItem {
  id            String      @id @default(cuid())
  menuSectionId String
  productId     String
  Product       Product     @relation(fields: [productId], references: [id])
  MenuSection   MenuSection @relation(fields: [menuSectionId], references: [id], onDelete: Cascade)
  @@index([menuSectionId])
}
*/

/*
1. ClassMaster.tsx – Gestion des catégories
Objectif :
Gérer les catégories de produits et leur hiérarchie (catégories parentes / sous-catégories). Permet d’assigner un produit à une ou plusieurs catégories.
Fonctionnalités clés :
Créer, modifier, supprimer des catégories (CategoryProduct).
Gérer la hiérarchie via le champ parentId (catégorie parente, sous-catégories).
Assigner/désassigner un produit à des catégories via la table de liaison CategoryAssignmentProduct.
Réorganiser l’ordre d’affichage (orderdisplay).
Filtrer les catégories par type (categoryType : FOOD, DRINK, MENU, CLEANING, PACK…).
Tables Prisma concernées :
CategoryProduct
CategoryAssignmentProduct
Exemple d’interface :
Liste des catégories avec icônes, cases à cocher pour l’assignation, bouton “Ajouter une sous-catégorie”, drag & drop pour hiérarchie.

2. Spec Craft – Gestion des spécifications produit
Objectif :
Créer et gérer des spécifications dynamiques pour un produit (poids, volume, matière, température, etc.). Ces spécifications sont stockées dans une table dédiée ProductSpec qui n’existe pas encore en base et doit être créée.
Fonctionnalités clés :
Ajouter des spécifications sous forme de paires label / value / unit.
Éditer ou supprimer des spécifications.
Regrouper éventuellement par thème (ex. “Dimensions”, “Conservation”) via une table optionnelle SpecificationGroup.
Réutiliser des libellés courants (autocomplétion).
Tables Prisma concernées :
ProductSpec (à créer)
Optionnel : SpecificationGroup (à créer si regroupement souhaité)
Remarque :
Le nom “Spec Craft” peut être vu comme une extension de l’ancienne notion de catégorie, mais il s’agit bien d’une table séparée pour éviter de surcharger CategoryProduct.

3. Allergen Guard – Gestion des allergènes
Objectif :
Lister et gérer les allergènes associés à un produit.
Fonctionnalités clés :
Ajouter / supprimer des allergènes (ex. gluten, lactose, fruits à coque…).
Afficher la liste des allergènes sous forme de badges.
Interface simple avec suggestions d’allergènes courants.
Tables Prisma concernées :
ProductAllergen (déjà présente dans le schéma)

4. Score Forge – Scores composites
Objectif :
Gérer des scores multiples pour un produit (nutri-score, éco-score, note de qualité, etc.) sous forme de paires type / valeur.
Fonctionnalités clés :
Ajouter des scores avec un type (ex. “ECO_SCORE”, “QUALITY”) et une valeur numérique.
Afficher les scores sous forme de jauges ou badges.
Permettre la mise à jour rapide.
Tables Prisma concernées :
ProductScore

5. Visual Deck – Gestion des images
Objectif :
Gestionnaire d’images réutilisable pour tout objet possédant un identifiant (produit, marque, catégorie, etc.). Permet d’associer une image principale et une galerie.
Fonctionnalités clés :
Uploader une image principale (mainImage).
Ajouter plusieurs images de galerie (GalleryImage).
Réutiliser le composant pour d’autres entités grâce à une relation polymorphique (via targetType / targetId ou des clés étrangères optionnelles).
Redimensionnement, aperçu, suppression.
Tables Prisma concernées :
Gallery
GalleryImage
Remarque :
Dans le schéma actuel, Gallery a un productId unique et un brandId optionnel. Pour le rendre réutilisable pour tout ID, il faudrait le généraliser (ajouter targetType et targetId) ou créer des tables séparées par type.

6. Name Crafter – Générateur de nom
Objectif :
Générer automatiquement un nom de produit à partir des catégories, spécifications et d’autres attributs, en utilisant une table de règles de conversion et de concaténation.
Fonctionnalités clés :
Définir des modèles de nom (ex. [Catégorie] - [Spécification principale]).
Agrégation intelligente : par exemple “Pack Eau 6x1L” à partir de la catégorie “Pack”, du produit “Eau”, de la spec “Volume: 1L”.
Table de conversion pour normaliser les termes (ex. “Eau” -> “Eau minérale”).
Prévisualisation en temps réel et validation manuelle.
Tables Prisma concernées :
Product, CategoryProduct, ProductSpec
Nouvelle table NamingRule ou NameTemplate (à créer)

7. Nutritional Lab – Informations nutritionnelles
Objectif :
Saisir et afficher les valeurs nutritionnelles pour 100 g / 100 ml / portion.
Fonctionnalités clés :
Formulaire pour renseigner calories, protéines, glucides, lipides, fibres, sel.
Calcul automatique éventuel (si portion définie).
Affichage sous forme de tableau nutritionnel.
Tables Prisma concernées :
NutritionalInfo

8. Upsell – Ventes croisées / complémentaires
Objectif :
Associer des produits complémentaires pour proposer des ventes croisées (ex. “Ajouter une boisson” pour un plat).
Fonctionnalités clés :
Sélectionner des produits liés (relation many-to-many).
Définir un type de relation (upsell, cross-sell, accessoire).
Gérer l’ordre de priorité.
Tables Prisma concernées :
Nouvelle table ProductRelation (ou Upsell) avec productId, relatedProductId, type, order.

9. Option Forge – Options et personnalisation
Objectif :
Créer des groupes d’options (ex. taille, sauce, supplément) et les options associées, avec prix additionnels.
onctionnalités clés :
Créer un OptionGroup (nom, type, min/max sélection).
Ajouter des Option (nom, extraPrice, isDefault).
Associer des allergènes spécifiques à une option (OptionAllergen).
Interface intuitive avec listes imbriquées.
Tables Prisma concernées :
OptionGroup
Option
OptionAllergen

10. Menu Builder – Composition des menus
Objectif :
Pour les produits de type menu (isMenu = true), construire la structure du menu : sections et éléments.
Fonctionnalités clés :
Créer des sections (MenuSection) avec nom, min/max sélection.
Ajouter des produits existants comme éléments (MenuSectionItem).
Gérer l’ordre des sections et des items.
Tables Prisma concernées :
Menu
MenuSection
MenuSectionItem

*/
/*
affiche le produit seltione vie le stores/storeProductStore.ts si vide invites a selectinner un prosuit affiche ProductDidpay.ts


affiche une ligne qui permet de selectioner un outil
ouvre le composant corespondant


affiche la card produit mignature
et 
le composant de presentation l'ensemble du produit
via useProductStudioStore (nouveau)
Contient une copie locale du produit et de ses relations (catégories, specs, etc.) en cours d’édition.

Actions : initFromProduct, updateField, addRelation, removeRelation, reset, etc.

Permet la mise à jour en temps réel de l’aperçu sans toucher immédiatement à la base.
*/
/*
tite de la page : prooduct Studio
affiche le produit present dans useProductStore.ts et un boutton seltioner un autreprosuit si vide afficher ProductSelector (à<qui utilise actions/productManager.ts)
bandeau des vignette produit
grourpe boutton <<  < o > >> debut de la liste precedant suivant fin de la liste 
affiche le produit selctionné vignette (cardProduct) et vudétaillé (a nommer)
mise a jour en temps reel en fonction de l'evolution des data transmise via les outils
presente les outils sous forme de card clicable pour ouvrir la modale avec le composant del'outils(fichier distinct).
bouton enregistrer a l fin ou uptdate des champs en temp reel

*/
/*
1. IdentityForge
Description : Construire l’identité de base du produit : nom, slug, description, prix, disponibilité, marque, type menu, ordre d’affichage. C’est le cœur éditorial du produit.

Fonctionnalités clés

Saisie du nom, slug (auto‑généré ou manuel), description, prix.

Bascule isMenu, isAvailable, orderdisplay.

Rattachement à la marque (généralement hérité du contexte).

Gestion du Nutri‑Score directement dans ce formulaire (champ nutriScore).

Tables Prisma concernées

Product

2. CategoryQuest
Description : Classer le produit dans une ou plusieurs catégories, gérer les sous‑catégories et l’ordre d’affichage.

Fonctionnalités clés

Créer, modifier, supprimer des catégories (CategoryProduct).

Gérer la hiérarchie via parentId.

Assigner/désassigner le produit via CategoryAssignmentProduct.

Réordonner les catégories (orderdisplay).

Filtrer par type (categoryType).

Tables Prisma concernées

CategoryProduct

CategoryAssignmentProduct

3. Specmacker
Description : Construire les caractéristiques techniques/commerciales du produit : poids, volume, dimensions, conservation, matière, température, etc. Gestion dynamique label / value / unit.

Fonctionnalités clés

Ajouter / modifier / supprimer des spécifications.

Chaque spécification possède un libellé, une valeur et une unité (ex. label: "Volume", value: "1", unit: "L").

Regroupement optionnel par thème (via une table SpecificationGroup).

Autocomplétion sur les libellés courants.

Tables Prisma concernées

ProductSpec (table déjà créée)

Optionnel : SpecificationGroup (à créer si regroupement souhaité)

4. Nutri&ScoreLab
Description : Gérer tout le profil santé/qualité du produit : allergènes, informations nutritionnelles, Nutri‑Score et autres scores composites.

Fonctionnalités clés

Gestion des allergènes (ajout / suppression, badges).

Saisie des valeurs nutritionnelles (calories, protéines, glucides, lipides, fibres, sel).

Gestion des scores multiples (type / valeur) : éco‑score, note qualité, etc.

Affichage synthétique sous forme de jauges ou badges.

Tables Prisma concernées

ProductAllergen

NutritionalInfo

ProductScore

Product (champ nutriScore)

5. VisualDeck
Description : Construire l’identité visuelle : image principale, galerie, ordre des visuels, aperçu. Les visuels alimentent directement la vignette et la présentation détaillée.

Fonctionnalités clés

Uploader une image principale.

Ajouter plusieurs images de galerie.

Réorganiser les images (drag & drop).

Aperçu en temps réel.

Composant réutilisable pour d’autres entités (marque, catégorie) via polymorphisme (targetType / targetId).

Tables Prisma concernées

Gallery

GalleryImage
Note : le schéma actuel lie Gallery à Product et Brand. Pour une réutilisation générique, une refonte polymorphique est recommandée.

6. PriceAlchemist
Description : Calculer le prix de revient puis proposer un prix de vente à partir des coûts d’achat, ingrédients, temps de préparation/cuisson et conditionnement.

Fonctionnalités clés

Saisie des coûts de matières premières, main d’œuvre, emballage, etc.

Calcul automatique du coût de revient.

Application d’une marge pour proposer un prix de vente.

Historique des prix.

Tables Prisma concernées

Product (champ price)

Nouvelles tables de coûts à définir (ex. ProductCost, CostComponent)

7. BetterSell
Description : Construire les relations commerciales entre produits : upsell, cross‑sell, accessoire, recommandation, alternative, avec ordre de priorité.

Fonctionnalités clés

Sélectionner des produits liés.

Définir le type de relation (upsell, crosssell, accessory, alternative).

Gérer l’ordre d’affichage des recommandations.

Tables Prisma concernées

Nouvelle table ProductRelation (à créer)

Champs : id, productId, relatedProductId, type, orderdisplay

8. Option Forge
Description : Construire les personnalisations du produit : groupes d’options, choix, suppléments de prix et allergènes liés aux options.

Fonctionnalités clés

Créer un OptionGroup (nom, type, min/max sélection).

Ajouter des Option (nom, extraPrice, isDefault).

Associer des allergènes spécifiques à une option via OptionAllergen.

Interface imbriquée avec listes dynamiques.

Tables Prisma concernées

OptionGroup

Option

OptionAllergen

9. MenuBuilder
Description : Construire un menu à partir de sections et de produits existants. Gestion des sélections min/max et de l’ordre.

Fonctionnalités clés

Créer des sections (MenuSection) avec nom, min/max sélection.

Ajouter des produits existants comme éléments (MenuSectionItem).

Gérer l’ordre des sections et des items.

Tables Prisma concernées

Menu

MenuSection

MenuSectionItem

10. NameCrafter
Description : Générer/proposer automatiquement des noms à partir des catégories, spécifications et règles de nommage.

Fonctionnalités clés

Définir des modèles de nom (ex. [Catégorie] - [Spécification principale]).

Agrégation intelligente (ex. “Pack Eau 6×1L”).

Table de normalisation des termes (NamingRule).

Prévisualisation en temps réel et validation manuelle.

Tables Prisma concernées

Product

CategoryProduct

ProductSpec

Nouvelle table NamingRule (ou NameTemplate) à créer
 */



import React from 'react'

function pages() {
  return (
    <div><h1>Product Toools</h1></div>
  )
}

export default pages