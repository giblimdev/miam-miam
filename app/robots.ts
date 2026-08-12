//@/app/robots.ts
/*
 role : Génère dynamiquement le fichier robots.txt pour les moteurs de recherche.
        Contrôle l'indexation et le crawling du site selon l'environnement.
 import: MetadataRoute depuis next
 useBy : Moteurs de recherche (Google, Bing, etc.) - Route /robots.txt
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Définition des règles d'exploration par agent (Googlebot, Bingbot, etc.)
   * Gestion des chemins autorisés/interdits selon l'environnement (prod vs dev/preview)
   * Configuration du sitemap pour guider les crawlers
 - Choix techniques :
   * Next.js Route Handler natif via le fichier robots.ts (Next.js 13.3+)
   * Condition environnementale : en production, tout est crawlable sauf /admin.
     En dev/preview, tout est interdit pour éviter l'indexation.
   * URL du sitemap absolue basée sur la variable d'environnement NEXT_PUBLIC_SITE_URL.
 - Flux de données :
   * robots() → règles → réponse HTTP Content-Type: text/plain
   * Aucun état ou props, fonction pure.
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/robots.ts (ce fichier)
- /app/sitemap.ts (génération du sitemap XML)
- .env.local ou .env.production (variable NEXT_PUBLIC_SITE_URL)
*/

import type { MetadataRoute } from 'next';

/**
 * Génère les règles du fichier robots.txt.
 * 
 * En production :
 * - Autorise tous les crawlers
 * - Interdit l'accès à la section admin
 * - Spécifie l'URL du sitemap
 * 
 * En développement/preview :
 * - Interdit tout crawling pour éviter l'indexation
 * 
 * @returns Configuration robots.txt conforme à la spec Robots Exclusion Protocol.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://appfood.com';
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // En développement ou preview, on bloque tout
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  // En production, configuration normale
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',           // Back-office
          '/api/',             // API routes
          '/dashboard/',       // Dashboard privé
          '/profile/',         // Profils utilisateurs
          '/orders/',          // Commandes personnelles
          '/checkout/',        // Processus de paiement
          '/*?*',              // Évite les URLs avec paramètres (doublons)
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',         // Bloque l'IA d'OpenAI si souhaité
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}