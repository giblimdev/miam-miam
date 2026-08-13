/*
 role : Server Actions pour la gestion des marques (CRUD).
        Toutes les interactions avec la base de données pour les marques.
 import:
   - prisma : @/lib/prisma
   - revalidatePath : next/cache
   - types : CreateBrandInput, UpdateBrandInput
 useBy : app/admin/brandManager/BrandManager.tsx, app/b2b/brandManager/BrandManager.tsx
*/

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { CreateBrandInput, UpdateBrandInput } from '@/lib/validations/brand';

/**
 * Récupère toutes les marques avec leurs types et sites.
 */
export async function getBrands() {
  try {
    return await prisma.brand.findMany({
      where: { deletedAt: null },
      include: {
        brandTypes: {
          select: { value: true },
        },
        sites: {
          where: { deletedAt: null },
          select: { id: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des marques :', error);
    throw new Error('Erreur lors du chargement des marques');
  }
}

/**
 * Récupère une marque par son ID.
 */
export async function getBrandById(id: string) {
  try {
    return await prisma.brand.findUnique({
      where: { id, deletedAt: null },
      include: {
        brandTypes: {
          select: { value: true },
        },
        sites: {
          where: { deletedAt: null },
          select: { id: true, name: true },
        },
      },
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération de la marque ${id} :`, error);
    throw new Error('Erreur lors du chargement de la marque');
  }
}

/**
 * Crée une nouvelle marque.
 */
export async function createBrand(data: CreateBrandInput) {
  try {
    const { type, ...brandData } = data;

    const brand = await prisma.brand.create({
      data: {
        ...brandData,
        brandTypes: {
          create: type.map((value) => ({ value })),
        },
      },
      include: {
        brandTypes: {
          select: { value: true },
        },
        sites: {
          where: { deletedAt: null },
          select: { id: true, name: true },
        },
      },
    });

    revalidatePath('/admin/brandManager');
    revalidatePath('/b2b/brandManager');
    return brand;
  } catch (error) {
    console.error('Erreur lors de la création de la marque :', error);
    throw new Error('Erreur lors de la création de la marque');
  }
}

/**
 * Met à jour une marque existante.
 */
export async function updateBrand(id: string, data: UpdateBrandInput) {
  try {
    const { type, ...brandData } = data;

    await prisma.brandType.deleteMany({
      where: { brandId: id },
    });

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...brandData,
        brandTypes: {
          create: type.map((value) => ({ value })),
        },
      },
      include: {
        brandTypes: {
          select: { value: true },
        },
        sites: {
          where: { deletedAt: null },
          select: { id: true, name: true },
        },
      },
    });

    revalidatePath('/admin/brandManager');
    revalidatePath('/b2b/brandManager');
    return brand;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la marque ${id} :`, error);
    throw new Error('Erreur lors de la mise à jour de la marque');
  }
}

/**
 * Supprime une marque (soft delete).
 */
export async function deleteBrand(id: string) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { name: true },
    });

    revalidatePath('/admin/brandManager');
    revalidatePath('/b2b/brandManager');
    return brand;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la marque ${id} :`, error);
    throw new Error('Erreur lors de la suppression de la marque');
  }
}

/**
 * Restaure une marque supprimée.
 */
export async function restoreBrand(id: string) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: { deletedAt: null },
      select: { name: true },
    });

    revalidatePath('/admin/brandManager');
    revalidatePath('/b2b/brandManager');
    return brand;
  } catch (error) {
    console.error(`Erreur lors de la restauration de la marque ${id} :`, error);
    throw new Error('Erreur lors de la restauration de la marque');
  }
}