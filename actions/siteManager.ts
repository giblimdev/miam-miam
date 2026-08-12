//@ /actions/siteManager.ts
/*
 role : Server Actions pour la gestion des sites (CRUD), scoping systématique
        par brandId. Toutes les interactions avec la base de données pour les sites.
 import:
   - prisma : @/lib/prisma
   - revalidatePath : next/cache
   - types : CreateSiteInput, UpdateSiteInput
   - sonner : toast
 useBy : app/admin/siteManager/SiteManager.tsx
*/

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';
import type { CreateSiteInput, UpdateSiteInput } from '@/lib/validations/site';

/**
 * Récupère tous les sites d'une marque donnée.
 */
export async function getSitesByBrand(brandId: string) {
  try {
    return await prisma.site.findMany({
      where: { brandId, deletedAt: null },
      include: {
        Address: true,
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des sites de la marque ${brandId} :`, error);
    toast.error('Erreur lors du chargement des sites');
    throw error;
  }
}

/**
 * Crée un nouveau site pour une marque.
 */
export async function createSite(data: CreateSiteInput) {
  try {
    const site = await prisma.site.create({ data });
    revalidatePath('/admin/siteManager');
    toast.success(`Site "${site.name}" créé avec succès !`);
    return site;
  } catch (error) {
    console.error('Erreur lors de la création du site :', error);
    toast.error('Erreur lors de la création du site');
    throw error;
  }
}

/**
 * Met à jour un site existant.
 */
export async function updateSite(id: string, data: UpdateSiteInput) {
  try {
    const site = await prisma.site.update({ where: { id }, data });
    revalidatePath('/admin/siteManager');
    toast.success(`Site "${site.name}" mis à jour avec succès !`);
    return site;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du site ${id} :`, error);
    toast.error('Erreur lors de la mise à jour du site');
    throw error;
  }
}

/**
 * Supprime un site (soft delete).
 */
export async function deleteSite(id: string) {
  try {
    const site = await prisma.site.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { name: true },
    });
    revalidatePath('/admin/siteManager');
    toast.success(`Site "${site.name}" supprimé avec succès !`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du site ${id} :`, error);
    toast.error('Erreur lors de la suppression du site');
    throw error;
  }
}