//@ /actions/productManager.ts
/*
 role : Server Actions unifiées pour la gestion complète d'un produit et de ses relations.
        Ce fichier centralise la sauvegarde complète (saveProduct) et des actions atomiques.
        Tous les types sont dérivés du client Prisma (généré dans @/lib/generated/prisma).

        ⚠️ Correction vs version précédente : les clés d'include/select doivent respecter
        EXACTEMENT la casse des noms de champs de relation déclarés dans schema.prisma
        (ex: `ProductAllergen`, pas `productAllergens`). Prisma ne "devine" jamais un nom
        de relation, il utilise le nom du champ tel qu'écrit dans le model.
        Autre point important : `Gallery` n'a PAS de relation Prisma directe vers `Product`
        (pas de productId dans le model Gallery). C'est une relation polymorphique
        (targetType + targetId), donc elle ne peut pas être incluse via `include` — elle est
        gérée par des requêtes séparées.

 import:
   - prisma depuis @/lib/prisma
   - Prisma (types) + GalleryTargetType (valeur d'enum) depuis @/lib/generated/prisma/client
   - revalidatePath, revalidateTag depuis next/cache
 useBy : ProductStudioPage, composants outils, API routes, etc.
*/

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { GalleryTargetType, type Prisma } from "@/lib/generated/prisma/client";

// ============================================================
// 1. CONSTANTES & TYPES (source unique de vérité)
// ============================================================

// Les clés ci-dessous correspondent 1:1 aux noms de champs de relation
// définis dans le model Product de schema.prisma.
const PRODUCT_INCLUDE = {
  brand: true,
  categoryAssignments: { include: { categoryProduct: true } },
  productSpecs: true,
  productAllergens: true,
  productScores: true,
  nutritionalInfo: true,
  optionGroups: {
    include: { options: { include: { optionAllergens: true } } },
  },
  menu: {
    include: {
      menuSections: {
        include: {
          menuSectionItems: { include: { product: true } },
        },
      },
    },
  },
  productRelations: { include: { relatedProduct: true } },
  relatedProductRelations: { include: { product: true } },
} satisfies Prisma.ProductInclude;

// `gallery` n'existe pas comme relation Prisma sur Product : on l'ajoute
// manuellement au type puisqu'on la récupère via une requête séparée.
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}> & {
  gallery: Prisma.GalleryGetPayload<{ include: { images: true } }> | null;
};

export type ProductListItem = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    price: true;
    isAvailable: true;
    isMenu: true;
    brand: { select: { id: true; name: true } };
  };
}> & { thumbnailUrl: string | null };

// ============================================================
// 2. UTILITAIRES
// ============================================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureProductExists(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId, deletedAt: null },
    select: { id: true },
  });
  if (!product) throw new Error("Produit introuvable");
  return product;
}

// Récupère la galerie d'un produit (relation polymorphique, pas de FK Prisma).
async function getProductGallery(productId: string) {
  return prisma.gallery.findFirst({
    where: { targetType: GalleryTargetType.PRODUCT, targetId: productId },
    include: { images: true },
  });
}

// ============================================================
// 3. LECTURE
// ============================================================

export async function getProducts(): Promise<ProductListItem[]> {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: [{ orderdisplay: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        isAvailable: true,
        isMenu: true,
        brand: { select: { id: true, name: true } },
      },
    });

    // Un seul aller-retour pour toutes les vignettes (au lieu d'un par produit)
    const galleries = await prisma.gallery.findMany({
      where: {
        targetType: GalleryTargetType.PRODUCT,
        targetId: { in: products.map((p) => p.id) },
      },
      select: { targetId: true, mainImage: true },
    });
    const thumbnailByProductId = new Map(
      galleries.map((g) => [g.targetId, g.mainImage]),
    );

    return products.map((p) => ({
      ...p,
      thumbnailUrl: thumbnailByProductId.get(p.id) ?? null,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw new Error("Impossible de charger les produits");
  }
}

/**
 * Récupère un produit complet avec toutes ses relations (pour l'édition).
 * Utilise PRODUCT_INCLUDE et ajoute la galerie.
 */
export async function getProductWithRelations(
  id: string,
): Promise<ProductWithRelations | null> {
  try {
    const [product, gallery] = await Promise.all([
      prisma.product.findUnique({
        where: { id, deletedAt: null },
        include: PRODUCT_INCLUDE,
      }),
      getProductGallery(id),
    ]);

    if (!product) return null;
    return { ...product, gallery };
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id} :`, error);
    throw new Error("Impossible de charger le produit");
  }
}

/**
 * Récupère un produit avec seulement les données scalaires (sans les relations lourdes).
 * Idéal pour un affichage rapide ou un store léger.
 */
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        isAvailable: true,
        isMenu: true,
        nutriScore: true,
        orderdisplay: true,
        brandId: true,
        brand: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
    return product;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du produit ${id} (scalaire) :`,
      error,
    );
    throw new Error("Impossible de charger le produit");
  }
}

// ============================================================
// 4. SAUVEGARDE COMPLÈTE (PUT / PATCH)
// ============================================================

export async function saveProduct(productData: ProductWithRelations) {
  try {
    const { id, brandId, ...scalarData } = productData;

    const existingProduct = id
      ? await prisma.product.findUnique({ where: { id }, select: { id: true } })
      : null;

    const productPayload: Prisma.ProductCreateInput = {
      name: scalarData.name,
      slug: scalarData.slug || generateSlug(scalarData.name),
      description: scalarData.description,
      price: scalarData.price,
      isAvailable: scalarData.isAvailable,
      isMenu: scalarData.isMenu,
      nutriScore: scalarData.nutriScore,
      orderdisplay: scalarData.orderdisplay,
      brand: { connect: { id: brandId } },
      // pas besoin de forcer updatedAt : le champ est `@updatedAt`, Prisma le gère seul
    };

    let productId: string;
    if (!existingProduct) {
      const newProduct = await prisma.product.create({ data: productPayload });
      productId = newProduct.id;
    } else {
      await prisma.product.update({ where: { id }, data: productPayload });
      productId = id;
    }

    await updateAllRelations(productId, productData);

    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, productId };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du produit :", error);
    return { success: false, error: "Erreur lors de la sauvegarde" };
  }
}

/**
 * Met à jour toutes les relations d'un produit.
 * Stratégie "delete + recreate" pour les relations enfants (simple et sûre pour un
 * formulaire qui renvoie l'état complet à chaque sauvegarde).
 */
async function updateAllRelations(
  productId: string,
  productData: ProductWithRelations,
) {
  // --- 4.1 Catégories (table de liaison, on garde le diff add/remove) ---
  const currentCats = await prisma.categoryAssignmentProduct.findMany({
    where: { productId },
    select: { categoryProductId: true },
  });
  const currentIds = currentCats.map((c) => c.categoryProductId);
  const newIds =
    productData.categoryAssignments?.map((c) => c.categoryProductId) ?? [];

  for (const idToAdd of newIds.filter((cid) => !currentIds.includes(cid))) {
    await prisma.categoryAssignmentProduct.create({
      data: { productId, categoryProductId: idToAdd },
    });
  }
  for (const idToRemove of currentIds.filter((cid) => !newIds.includes(cid))) {
    await prisma.categoryAssignmentProduct.deleteMany({
      where: { productId, categoryProductId: idToRemove },
    });
  }

  // --- 4.2 Spécifications ---
  await prisma.productSpec.deleteMany({ where: { productId } });
  if (productData.productSpecs?.length) {
    await prisma.productSpec.createMany({
      data: productData.productSpecs.map((spec) => ({
        label: spec.label,
        value: spec.value,
        unit: spec.unit,
        productId,
      })),
    });
  }

  // --- 4.3 Allergènes (champ Product.productAllergens) ---
  await prisma.productAllergen.deleteMany({ where: { productId } });
  if (productData.productAllergens?.length) {
    await prisma.productAllergen.createMany({
      data: productData.productAllergens.map((a) => ({
        value: a.value,
        productId,
      })),
    });
  }

  // --- 4.4 Scores (champ Product.productScores) ---
  await prisma.productScore.deleteMany({ where: { productId } });
  if (productData.productScores?.length) {
    await prisma.productScore.createMany({
      data: productData.productScores.map((s) => ({
        type: s.type,
        score: s.score,
        productId,
      })),
    });
  }

  // --- 4.5 Nutrition (relation 1-1, champ Product.nutritionalInfo) ---
  if (productData.nutritionalInfo) {
    const {
      id: _nid,
      productId: _pid,
      ...nutrition
    } = productData.nutritionalInfo;
    await prisma.nutritionalInfo.upsert({
      where: { productId },
      update: nutrition,
      create: { ...nutrition, productId },
    });
  } else {
    await prisma.nutritionalInfo.deleteMany({ where: { productId } });
  }

  // --- 4.6 Options (champ Product.optionGroups) ---
  await prisma.optionGroup.deleteMany({ where: { productId } });
  if (productData.optionGroups?.length) {
    for (const group of productData.optionGroups) {
      const newGroup = await prisma.optionGroup.create({
        data: {
          name: group.name,
          type: group.type,
          minSelection: group.minSelection,
          maxSelection: group.maxSelection,
          productId,
        },
      });
      if (group.options?.length) {
        for (const option of group.options) {
          const newOption = await prisma.option.create({
            data: {
              name: option.name,
              extraPrice: option.extraPrice,
              isDefault: option.isDefault,
              optionGroupId: newGroup.id,
            },
          });
          if (option.optionAllergens?.length) {
            await prisma.optionAllergen.createMany({
              data: option.optionAllergens.map((oa) => ({
                value: oa.value,
                optionId: newOption.id,
              })),
            });
          }
        }
      }
    }
  }

  // --- 4.7 Menu (relation 1-1, champ Product.menu) ---
  await prisma.menu.deleteMany({ where: { productId } });
  if (productData.menu) {
    const newMenu = await prisma.menu.create({
      data: { title: productData.menu.title, productId },
    });
    if (productData.menu.menuSections?.length) {
      for (const section of productData.menu.menuSections) {
        const newSection = await prisma.menuSection.create({
          data: {
            name: section.name,
            minSelection: section.minSelection,
            maxSelection: section.maxSelection,
            menuId: newMenu.id,
          },
        });
        if (section.menuSectionItems?.length) {
          await prisma.menuSectionItem.createMany({
            data: section.menuSectionItems.map((item) => ({
              productId: item.productId,
              menuSectionId: newSection.id,
            })),
          });
        }
      }
    }
  }

  // --- 4.8 Galerie (PAS de FK Prisma : relation polymorphique targetType/targetId) ---
  await prisma.gallery.deleteMany({
    where: { targetType: GalleryTargetType.PRODUCT, targetId: productId },
  });
  if (productData.gallery) {
    const newGallery = await prisma.gallery.create({
      data: {
        name: productData.gallery.name,
        altText: productData.gallery.altText,
        description: productData.gallery.description,
        mainImage: productData.gallery.mainImage,
        targetType: GalleryTargetType.PRODUCT,
        targetId: productId,
      },
    });
    if (productData.gallery.images?.length) {
      await prisma.galleryImage.createMany({
        data: productData.gallery.images.map((img) => ({
          url: img.url,
          galleryId: newGallery.id,
        })),
      });
    }
  }

  // --- 4.9 Relations produit (upsell / cross-sell) ---
  await prisma.productRelation.deleteMany({
    where: { OR: [{ productId }, { relatedProductId: productId }] },
  });
  const allRelations = [
    ...(productData.productRelations ?? []),
    ...(productData.relatedProductRelations ?? []),
  ];
  if (allRelations.length) {
    await prisma.productRelation.createMany({
      data: allRelations.map((rel) => ({
        productId: rel.productId,
        relatedProductId: rel.relatedProductId,
        type: rel.type,
        orderdisplay: rel.orderdisplay || 0,
      })),
    });
  }
}

// ============================================================
// 5. ACTIONS ATOMIQUES (PATCH)
// Ces fonctions appellent le delegate Prisma directement (ex: prisma.productSpec.xxx),
// donc elles ne sont PAS concernées par la casse des noms de relation d'include/select —
// elles étaient déjà correctes.
// ============================================================

// --- 5.1 Spécifications ---
export async function addProductSpec(
  productId: string,
  data: { label: string; value: string; unit?: string },
) {
  try {
    await ensureProductExists(productId);
    const spec = await prisma.productSpec.create({
      data: { ...data, productId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, spec };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la spécification :", error);
    throw new Error("Impossible d'ajouter la spécification");
  }
}

export async function removeProductSpec(specId: string) {
  try {
    await prisma.productSpec.delete({ where: { id: specId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la spécification :", error);
    throw new Error("Impossible de supprimer la spécification");
  }
}

export async function updateProductSpec(
  specId: string,
  data: Partial<{ label: string; value: string; unit: string }>,
) {
  try {
    const spec = await prisma.productSpec.update({
      where: { id: specId },
      data,
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, spec };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la spécification :", error);
    throw new Error("Impossible de mettre à jour la spécification");
  }
}

// --- 5.2 Catégories ---
export async function addCategoryAssignment(
  productId: string,
  categoryProductId: string,
) {
  try {
    await ensureProductExists(productId);
    const assignment = await prisma.categoryAssignmentProduct.create({
      data: { productId, categoryProductId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, assignment };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie :", error);
    throw new Error("Impossible d'ajouter la catégorie");
  }
}

export async function removeCategoryAssignment(
  productId: string,
  categoryProductId: string,
) {
  try {
    await prisma.categoryAssignmentProduct.deleteMany({
      where: { productId, categoryProductId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie :", error);
    throw new Error("Impossible de supprimer la catégorie");
  }
}

// --- 5.3 Allergènes ---
export async function addAllergen(productId: string, value: string) {
  try {
    await ensureProductExists(productId);
    const allergen = await prisma.productAllergen.create({
      data: { value, productId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, allergen };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'allergène :", error);
    throw new Error("Impossible d'ajouter l'allergène");
  }
}

export async function removeAllergen(allergenId: string) {
  try {
    await prisma.productAllergen.delete({ where: { id: allergenId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'allergène :", error);
    throw new Error("Impossible de supprimer l'allergène");
  }
}

// --- 5.4 Scores ---
export async function addScore(
  productId: string,
  data: { type: string; score: number },
) {
  try {
    await ensureProductExists(productId);
    const score = await prisma.productScore.create({
      data: { ...data, productId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, score };
  } catch (error) {
    console.error("Erreur lors de l'ajout du score :", error);
    throw new Error("Impossible d'ajouter le score");
  }
}

export async function removeScore(scoreId: string) {
  try {
    await prisma.productScore.delete({ where: { id: scoreId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du score :", error);
    throw new Error("Impossible de supprimer le score");
  }
}

export async function updateScore(
  scoreId: string,
  data: Partial<{ type: string; score: number }>,
) {
  try {
    const score = await prisma.productScore.update({
      where: { id: scoreId },
      data,
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, score };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du score :", error);
    throw new Error("Impossible de mettre à jour le score");
  }
}

// --- 5.5 Nutrition ---
export async function upsertNutritionalInfo(
  productId: string,
  data: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fat: number;
    fiber?: number;
    salt?: number;
  },
) {
  try {
    await ensureProductExists(productId);
    const info = await prisma.nutritionalInfo.upsert({
      where: { productId },
      update: data,
      create: { ...data, productId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, info };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des infos nutritionnelles :",
      error,
    );
    throw new Error("Impossible de mettre à jour les infos nutritionnelles");
  }
}

export async function removeNutritionalInfo(productId: string) {
  try {
    await prisma.nutritionalInfo.deleteMany({ where: { productId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des infos nutritionnelles :",
      error,
    );
    throw new Error("Impossible de supprimer les infos nutritionnelles");
  }
}

// --- 5.6 Options ---
export async function addOptionGroup(
  productId: string,
  data: {
    name: string;
    type?: string;
    minSelection?: number;
    maxSelection?: number;
  },
) {
  try {
    await ensureProductExists(productId);
    const group = await prisma.optionGroup.create({
      data: {
        ...data,
        type: data.type || "OPTIONAL",
        minSelection: data.minSelection || 0,
        maxSelection: data.maxSelection || 1,
        productId,
      },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, group };
  } catch (error) {
    console.error("Erreur lors de l'ajout du groupe d'options :", error);
    throw new Error("Impossible d'ajouter le groupe d'options");
  }
}

export async function updateOptionGroup(
  groupId: string,
  data: Partial<{
    name: string;
    type: string;
    minSelection: number;
    maxSelection: number;
  }>,
) {
  try {
    const group = await prisma.optionGroup.update({
      where: { id: groupId },
      data,
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, group };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du groupe d'options :", error);
    throw new Error("Impossible de mettre à jour le groupe d'options");
  }
}

export async function removeOptionGroup(groupId: string) {
  try {
    await prisma.optionGroup.delete({ where: { id: groupId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du groupe d'options :", error);
    throw new Error("Impossible de supprimer le groupe d'options");
  }
}

export async function addOptionToGroup(
  groupId: string,
  data: {
    name: string;
    extraPrice?: number;
    isDefault?: boolean;
    allergens?: string[];
  },
) {
  try {
    const option = await prisma.option.create({
      data: {
        name: data.name,
        extraPrice: data.extraPrice || 0,
        isDefault: data.isDefault || false,
        optionGroupId: groupId,
      },
    });
    if (data.allergens?.length) {
      await prisma.optionAllergen.createMany({
        data: data.allergens.map((value) => ({ value, optionId: option.id })),
      });
    }
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, option };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'option :", error);
    throw new Error("Impossible d'ajouter l'option");
  }
}

export async function removeOptionFromGroup(optionId: string) {
  try {
    await prisma.option.delete({ where: { id: optionId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'option :", error);
    throw new Error("Impossible de supprimer l'option");
  }
}

export async function updateOption(
  optionId: string,
  data: Partial<{ name: string; extraPrice: number; isDefault: boolean }>,
) {
  try {
    const option = await prisma.option.update({
      where: { id: optionId },
      data,
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, option };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'option :", error);
    throw new Error("Impossible de mettre à jour l'option");
  }
}

// --- 5.7 Galerie (polymorphique : targetType = PRODUCT, targetId = productId) ---
export async function upsertProductGallery(
  productId: string,
  data: {
    name: string;
    altText: string;
    description?: string;
    mainImage: string;
    images?: { url: string }[];
  },
) {
  try {
    await ensureProductExists(productId);
    const existing = await getProductGallery(productId);

    const gallery = existing
      ? await prisma.gallery.update({
          where: { id: existing.id },
          data: {
            name: data.name,
            altText: data.altText,
            description: data.description,
            mainImage: data.mainImage,
          },
        })
      : await prisma.gallery.create({
          data: {
            name: data.name,
            altText: data.altText,
            description: data.description,
            mainImage: data.mainImage,
            targetType: GalleryTargetType.PRODUCT,
            targetId: productId,
          },
        });

    if (data.images) {
      await prisma.galleryImage.deleteMany({
        where: { galleryId: gallery.id },
      });
      if (data.images.length) {
        await prisma.galleryImage.createMany({
          data: data.images.map((img) => ({
            url: img.url,
            galleryId: gallery.id,
          })),
        });
      }
    }

    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, gallery };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la galerie :", error);
    throw new Error("Impossible de mettre à jour la galerie");
  }
}

export async function removeProductGallery(productId: string) {
  try {
    await prisma.gallery.deleteMany({
      where: { targetType: GalleryTargetType.PRODUCT, targetId: productId },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la galerie :", error);
    throw new Error("Impossible de supprimer la galerie");
  }
}

// --- 5.8 Relations produit (BetterSell) ---
export async function addProductRelation(
  productId: string,
  relatedProductId: string,
  type: string,
  orderdisplay?: number,
) {
  try {
    await ensureProductExists(productId);
    await ensureProductExists(relatedProductId);
    const relation = await prisma.productRelation.create({
      data: {
        productId,
        relatedProductId,
        type,
        orderdisplay: orderdisplay || 0,
      },
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, relation };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la relation produit :", error);
    throw new Error("Impossible d'ajouter la relation produit");
  }
}

export async function removeProductRelation(relationId: string) {
  try {
    await prisma.productRelation.delete({ where: { id: relationId } });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la relation produit :",
      error,
    );
    throw new Error("Impossible de supprimer la relation produit");
  }
}

export async function updateProductRelation(
  relationId: string,
  data: Partial<{ type: string; orderdisplay: number }>,
) {
  try {
    const relation = await prisma.productRelation.update({
      where: { id: relationId },
      data,
    });
    revalidatePath("/b2b/productionTool");
    revalidateTag("products", {});
    return { success: true, relation };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la relation produit :",
      error,
    );
    throw new Error("Impossible de mettre à jour la relation produit");
  }
}

// ============================================================
// 6. CATÉGORIES (CRUD indépendant)
// ============================================================

export async function getCategories() {
  try {
    return await prisma.categoryProduct.findMany({
      where: { parentId: null },
      orderBy: [{ orderdisplay: "asc" }, { name: "asc" }],
      include: { children: { include: { children: true } } },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    throw new Error("Impossible de charger les catégories");
  }
}

export async function createCategory(data: {
  name: string;
  categoryType: string;
  parentId?: string | null;
  orderdisplay?: number;
  description?: string;
  image?: string;
}) {
  try {
    const category = await prisma.categoryProduct.create({
      data: {
        name: data.name,
        categoryType: data.categoryType,
        parentId: data.parentId || null,
        orderdisplay: data.orderdisplay || 0,
        description: data.description || "",
        image: data.image || null,
      },
    });
    revalidatePath("/b2b/productionTool");
    return category;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    throw new Error("Impossible de créer la catégorie");
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    categoryType?: string;
    parentId?: string | null;
    orderdisplay?: number;
    description?: string;
    image?: string;
  },
) {
  try {
    const category = await prisma.categoryProduct.update({
      where: { id },
      data,
    });
    revalidatePath("/b2b/productionTool");
    return category;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la catégorie ${id} :`,
      error,
    );
    throw new Error("Impossible de mettre à jour la catégorie");
  }
}

export async function deleteCategory(id: string) {
  try {
    const hasChildren = await prisma.categoryProduct.count({
      where: { parentId: id },
    });
    if (hasChildren > 0) {
      throw new Error(
        "Impossible de supprimer une catégorie qui a des sous-catégories",
      );
    }
    const hasAssignments = await prisma.categoryAssignmentProduct.count({
      where: { categoryProductId: id },
    });
    if (hasAssignments > 0) {
      throw new Error(
        "Impossible de supprimer une catégorie assignée à des produits",
      );
    }
    await prisma.categoryProduct.delete({ where: { id } });
    revalidatePath("/b2b/productionTool");
    return { success: true };
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la catégorie ${id} :`,
      error,
    );
    throw new Error("Impossible de supprimer la catégorie");
  }
}

// ============================================================
// 7. ANCIENNES ACTIONS (conservées pour compatibilité)
// ============================================================

export async function getProductsByBrand(brandId: string) {
  try {
    return await prisma.product.findMany({
      where: { brandId, deletedAt: null },
      orderBy: [{ orderdisplay: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des produits de la marque ${brandId} :`,
      error,
    );
    throw new Error("Erreur lors du chargement des produits");
  }
}

export async function createProduct(
  data: Prisma.ProductCreateWithoutBrandInput & { brandId: string },
) {
  try {
    const { brandId, ...rest } = data;
    const slug = rest.slug || generateSlug(rest.name);
    const product = await prisma.product.create({
      data: { ...rest, slug, brand: { connect: { id: brandId } } },
    });
    revalidatePath("/admin/productManager");
    return product;
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    throw new Error("Erreur lors de la création du produit");
  }
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  try {
    const nameValue = typeof data.name === "string" ? data.name : undefined;
    const slug = nameValue ? generateSlug(nameValue) : undefined;
    const product = await prisma.product.update({
      where: { id },
      data: { ...data, ...(slug && { slug }) },
    });
    revalidatePath("/admin/productManager");
    return product;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id} :`, error);
    throw new Error("Erreur lors de la mise à jour du produit");
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { name: true },
    });
    revalidatePath("/admin/productManager");
    return product;
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id} :`, error);
    throw new Error("Erreur lors de la suppression du produit");
  }
}
