//@ /actions/siteManager.ts
/*
 role : Server Actions pour la gestion des sites (CRUD), scoping systématique
        par brandId. Toutes les interactions avec la base de données pour les sites.
 import:
   - prisma : @/lib/prisma
   - revalidatePath : next/cache
   - types : CreateSiteInput, UpdateSiteInput
 useBy : app/admin/siteManager/SiteManager.tsx, app/b2b/brandManager/SiteManager.tsx
*/

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { CreateSiteInput, UpdateSiteInput } from '@/lib/validations/site';

/**
 * Récupère tous les sites d'une marque donnée.
 */
export async function getSitesByBrand(brandId: string) {
  try {
    return await prisma.site.findMany({
      where: { brandId, deletedAt: null },
      include: {
        address: true,
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des sites de la marque ${brandId} :`, error);
    throw new Error('Erreur lors du chargement des sites');
  }
}

/**
 * Crée un nouveau site pour une marque.
 */
export async function createSite(data: CreateSiteInput) {
  try {
    const site = await prisma.site.create({
      data: {
        ...data,
        // L'ID est généré automatiquement par Prisma via @default(cuid())
        // Pas besoin de le générer manuellement
      },
    });
    revalidatePath('/admin/siteManager');
    return site;
  } catch (error) {
    console.error('Erreur lors de la création du site :', error);
    throw new Error('Erreur lors de la création du site');
  }
}

/**
 * Met à jour un site existant.
 */
export async function updateSite(id: string, data: UpdateSiteInput) {
  try {
    const site = await prisma.site.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    revalidatePath('/admin/siteManager');
    return site;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du site ${id} :`, error);
    throw new Error('Erreur lors de la mise à jour du site');
  }
}

/**
 * Supprime un site (soft delete).
 */
export async function deleteSite(id: string) {
  try {
    const site = await prisma.site.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
      select: { name: true },
    });
    revalidatePath('/admin/siteManager');
    return site;
  } catch (error) {
    console.error(`Erreur lors de la suppression du site ${id} :`, error);
    throw new Error('Erreur lors de la suppression du site');
  }
}

/**
 * Restaure un site supprimé.
 */
export async function restoreSite(id: string) {
  try {
    const site = await prisma.site.update({
      where: { id },
      data: { deletedAt: null, updatedAt: new Date() },
      select: { name: true },
    });
    revalidatePath('/admin/siteManager');
    return site;
  } catch (error) {
    console.error(`Erreur lors de la restauration du site ${id} :`, error);
    throw new Error('Erreur lors de la restauration du site');
  }
}