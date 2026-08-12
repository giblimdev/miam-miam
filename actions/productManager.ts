//@ /actions/productManager.ts
/*
 role : Server Actions pour la gestion des produits (CRUD), scoping systématique
        par brandId. Toutes les interactions avec la base de données pour les produits.
 import:
   - prisma : @/lib/prisma
   - revalidatePath : next/cache
   - types : CreateProductInput, UpdateProductInput
 useBy : app/admin/productManager/ProductManager.tsx, app/b2b/brandManager/ProductManager.tsx
*/

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations/product';

// Fonction utilitaire pour générer un slug (sans suffixe aléatoire)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Récupère tous les produits d'une marque donnée.
 */
export async function getProductsByBrand(brandId: string) {
  try {
    return await prisma.product.findMany({
      where: { brandId, deletedAt: null },
      orderBy: [{ orderdisplay: 'asc' }, { name: 'asc' }],
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la marque ${brandId} :`, error);
    throw new Error('Erreur lors du chargement des produits');
  }
}

/**
 * Crée un nouveau produit pour une marque.
 */
export async function createProduct(data: CreateProductInput) {
  try {
    const slug = generateSlug(data.name);

    const product = await prisma.product.create({
      data: {
        slug,
        ...data,
        updatedAt: new Date(),
        // L'ID est généré automatiquement par Prisma (@default(cuid()))
      },
    });
    revalidatePath('/admin/productManager');
    return product;
  } catch (error) {
    console.error('Erreur lors de la création du produit :', error);
    throw new Error('Erreur lors de la création du produit');
  }
}

/**
 * Met à jour un produit existant.
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  try {
    const slug = data.name ? generateSlug(data.name) : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        ...(slug && { slug }),
      },
    });
    revalidatePath('/admin/productManager');
    return product;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id} :`, error);
    throw new Error('Erreur lors de la mise à jour du produit');
  }
}

/**
 * Supprime un produit (soft delete).
 */
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
      select: { name: true },
    });
    revalidatePath('/admin/productManager');
    return product;
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id} :`, error);
    throw new Error('Erreur lors de la suppression du produit');
  }
}