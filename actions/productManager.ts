//@ /actions/productManager.ts
/*
 role : Server Actions pour la gestion des produits (CRUD), scoping systématique
        par brandId. Toutes les interactions avec la base de données pour les produits.
 import:
   - prisma : @/lib/prisma
   - revalidatePath : next/cache
   - types : CreateProductInput, UpdateProductInput
   - sonner : toast
 useBy : app/admin/productManager/ProductManager.tsx
*/

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations/product';

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
    toast.error('Erreur lors du chargement des produits');
    throw error;
  }
}

/**
 * Crée un nouveau produit pour une marque.
 */
export async function createProduct(data: CreateProductInput) {
  try {
    const product = await prisma.product.create({ data });
    revalidatePath('/admin/productManager');
    toast.success(`Produit "${product.name}" créé avec succès !`);
    return product;
  } catch (error) {
    console.error('Erreur lors de la création du produit :', error);
    toast.error('Erreur lors de la création du produit');
    throw error;
  }
}

/**
 * Met à jour un produit existant.
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  try {
    const product = await prisma.product.update({ where: { id }, data });
    revalidatePath('/admin/productManager');
    toast.success(`Produit "${product.name}" mis à jour avec succès !`);
    return product;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id} :`, error);
    toast.error('Erreur lors de la mise à jour du produit');
    throw error;
  }
}

/**
 * Supprime un produit (soft delete).
 */
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { name: true },
    });
    revalidatePath('/admin/productManager');
    toast.success(`Produit "${product.name}" supprimé avec succès !`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id} :`, error);
    toast.error('Erreur lors de la suppression du produit');
    throw error;
  }
}