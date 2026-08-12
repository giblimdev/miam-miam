//@/app/sitemap.ts
/*
 role : Génère dynamiquement le sitemap XML pour le SEO.
        Liste toutes les URLs publiques indexables avec leur priorité et fréquence de mise à jour.
 import: MetadataRoute depuis next, getAllBrands, getAllProducts (services)
 useBy : Moteurs de recherche - Route /sitemap.xml
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * URLs statiques : pages fixes avec priorité et fréquence de changement
   * URLs dynamiques : marques et produits chargés depuis les services
   * Chaque entrée inclut : url, lastModified, changeFrequency, priority
 - Choix techniques :
   * Next.js Route Handler natif (Next.js 13.3+)
   * Données chargées depuis les fichiers JSON (via les services)
   * Cache possible avec revalidation périodique
 - Flux de données :
   * sitemap() → fetch données → map → tableau d'entrées → réponse XML
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/sitemap.ts (ce fichier)
- /app/robots.ts (référence le sitemap)
- /services/brandService.ts (getAllBrands)
- /services/productService.ts (getAllProducts)
*/

import type { MetadataRoute } from 'next';

/**
 * Génère le sitemap XML complet du site.
 * 
 * Combine :
 * - Les pages statiques (accueil, recherche, catégories)
 * - Les pages dynamiques (marques, produits)
 * 
 * @returns Tableau d'entrées de sitemap pour Next.js.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://appfood.com';

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Pages dynamiques : marques
  let brandPages: MetadataRoute.Sitemap = [];
  try {
    // const brands = await getAllBrands(); // À activer quand le service est prêt
    // brandPages = brands.map((brand) => ({
    //   url: `${baseUrl}/brand/${brand.slug}`,
    //   lastModified: brand.updatedAt || brand.createdAt || new Date(),
    //   changeFrequency: 'daily' as const,
    //   priority: 0.9,
    // }));
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap des marques:', error);
  }

  // Pages dynamiques : produits
  let productPages: MetadataRoute.Sitemap = [];
  try {
    // const products = await getAllProducts(); // À activer quand le service est prêt
    // productPages = products.map((product) => ({
    //   url: `${baseUrl}/product/${product.id}`,
    //   lastModified: product.updatedAt || product.createdAt || new Date(),
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.7,
    // }));
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap des produits:', error);
  }

  return [...staticPages, ...brandPages, ...productPages];
}