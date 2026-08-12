//@/app/admin/page.tsx
/* role : Page d'accueil de l'administration – hub de navigation avec descriptions détaillées des modules.
   import : React, composants shadcn/ui (Card, CardHeader, CardTitle, CardContent, Badge), icônes Lucide, Link.
   //@/components/admin/userManager/UserDisplay.tsx qui affiche la liste des utilisateurs dans un tableau responsive.
et un composant formulaire par la suite
   useBy : Route /admin (protégée par le layout d’administration) ou un midelware ou une verification au montage de la page sera implement" ulterieurement
   
*/

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Truck,
  Heart,
  Star,
  Megaphone,
  Headphones,
  BarChart3,
  Settings,
  Image,
  Bell,
  ShieldAlert,
  Route,
  FileText,
} from 'lucide-react';

// Descriptions détaillées basées sur le document fonctionnel fourni précédemment
const adminModules = [
  {
    title: 'Utilisateurs & Rôles',
    description:
      'Consultez la liste des utilisateurs, recherchez et filtrez par rôle ou statut. Accédez au profil complet : adresses, préférences alimentaires, allergies, comptes fidélité et historique de commandes. Gérez l’attribution des rôles (SuperAdmin, BrandAdmin, SiteManager, Support) et les permissions (lecture, écriture, suppression) par module. Validez les documents KYC des livreurs et marques.',
    icon: Users,
    href: '/admin/userManager',
    color: 'from-blue-500 to-cyan-400',
    badge: 'RBAC',
  },
   {
  title: 'Brands & Sites',
  description:
    'Gérez les marques (restaurants, épiceries) et leurs sites : coordonnées, horaires, zones de livraison, logos et FAQ. Ajoutez, modifiez ou supprimez des marques et leurs points de vente.',
  icon: Store,          // Icône représentant un magasin / une marque
  href: '/admin/brandManager',
  color: 'from-blue-500 to-cyan-400',   // Dégradé conservé (ou ajustez selon vos goûts)
  badge: 'Marques',     // Badge plus explicite que "RBAC"
},
  {
    title: 'Catalogue Produits',
    description:
      'Gérez le catalogue : produits (nom, prix, image, disponibilité), catégories avec ordre d’affichage, et menus composés de sections obligatoires/optionnelles. Définissez les options de personnalisation (sauces, suppléments, prix, allergènes). Renseignez les recettes, les allergènes, le NutriScore et les infos nutritionnelles. Suivez les stocks en temps réel par site avec seuils d’alerte.',
    icon: Package,
    href: '/admin/products',
    color: 'from-emerald-500 to-teal-400',
    badge: 'Produits',
  },
  {
    title: 'Commandes',
    description:
      'Visualisez toutes les commandes par statut (créée, payée, en préparation, prête, en livraison, livrée, annulée). Consultez le détail : articles, options, prix, adresse de livraison, frais et instructions. Effectuez des actions : changement de statut, annulation avec motif, remboursement. Gérez les commandes programmées et l’historique des remboursements.',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'from-yellow-500 to-orange-400',
    badge: 'Commandes',
  },
  {
    title: 'Livraisons & Livreurs',
    description:
      'Suivez les livraisons en temps réel (statuts, assignation, tracking GPS). Attribuez ou réassignez un livreur, générez et vérifiez le code OTP. Gérez les livreurs : statut, disponibilités, documents KYC, évaluations et gains. Traitez les commentaires livreur (panne, client injoignable).',
    icon: Truck,
    href: '/admin/deliveries',
    color: 'from-orange-500 to-red-400',
    badge: 'Livraisons',
  },
  {
    title: 'Fidélité & Parrainage',
    description:
      'Paramétrez le programme de fidélité : paliers (Bronze, Silver, Gold, Platinum), points par euro, récompenses. Consultez les soldes de points, l’historique des transactions et ajustez manuellement si nécessaire. Suivez les parrainages : codes, statuts, récompenses. Visualisez les favoris (marques, produits, sites) des utilisateurs.',
    icon: Heart,
    href: '/admin/loyalty',
    color: 'from-pink-500 to-rose-400',
    badge: 'Fidélité',
  },
  {
    title: 'Avis & Évaluations',
    description:
      'Modérez les avis des restaurants, produits, livreurs et application. Approuvez, rejetez ou signalez les contenus inappropriés. Gérez les signalements et configurez les critères de notation par type de cible.',
    icon: Star,
    href: '/admin/reviews',
    color: 'from-amber-500 to-yellow-600',
    badge: 'Avis',
  },
  {
    title: 'Promotions & Marketing',
    description:
      'Créez des promotions (pourcentage, montant fixe, "achetez X, obtenez Y") avec conditions, validité, limite d’utilisation et ciblage par site. Envoyez des campagnes ciblées (push, email, bannières) via les annonces globales. Créez des questionnaires (NPS, satisfaction) avec questions ouvertes, QCM ou échelle de Likert.',
    icon: Megaphone,
    href: '/admin/marketing',
    color: 'from-purple-500 to-fuchsia-500',
    badge: 'Marketing',
  },
  {
    title: 'Support Client',
    description:
      'Gérez les tickets de support avec priorité et statut. Échangez via une messagerie intégrée avec pièces jointes. Publiez et gérez les articles du blog (catégories : Nouveautés, Tutoriels, FAQ, Recettes) pour la base de connaissances.',
    icon: Headphones,
    href: '/admin/support',
    color: 'from-cyan-500 to-blue-500',
    badge: 'Support',
  },
  {
    title: 'Finances & Rapports',
    description:
      'Analysez le chiffre d’affaires brut, les commissions, les frais de livraison et le montant net par marque/période. Exportez des rapports détaillés avec calcul des taxes. Gérez les virements aux marques (payouts) et configurez les règles de TVA par pays et type de produit.',
    icon: BarChart3,
    href: '/admin/finances',
    color: 'from-green-500 to-emerald-600',
    badge: 'Finance',
  },
  {
    title: 'Système & Configuration',
    description:
      'Paramétrez les modes de paiement acceptés, les frais de service, les délais et horaires globaux de commande/livraison. Configurez les annonces globales (bannières, push, email) et les programmes qualité (badges).',
    icon: Settings,
    href: '/admin/settings',
    color: 'from-gray-500 to-slate-600',
    badge: 'Système',
  },
  {
    title: 'Médias',
    description:
      'Importez et gérez les images de la plateforme : logos, photos de produits, avis, preuves de livraison, etc.',
    icon: Image,
    href: '/admin/media',
    color: 'from-violet-500 to-purple-600',
    badge: 'Médias',
  },
  {
    title: 'Notifications',
    description:
      'Consultez l’historique des notifications envoyées (commande, promo, fidélité, système) et leur statut de lecture.',
    icon: Bell,
    href: '/admin/notifications',
    color: 'from-red-500 to-pink-500',
    badge: 'Notifications',
  },
  {
    title: 'Fraude & Sécurité',
    description:
      'Surveillez les alertes de fraude (sévérité basse/moyenne/haute). Enquêtez et résolvez les incidents suspects.',
    icon: ShieldAlert,
    href: '/admin/fraud',
    color: 'from-zinc-500 to-neutral-600',
    badge: 'Sécurité',
  },
  {
    title: 'Roadmap & Suggestions',
    description:
      'Gérez les suggestions des utilisateurs (UserVoice) : statuts (soumise, en examen, planifiée, en cours, livrée, refusée), votes et commentaires. Planifiez la roadmap produit.',
    icon: Route,
    href: '/admin/roadmap',
    color: 'from-lime-500 to-green-500',
    badge: 'Roadmap',
  },
  {
    title: 'Blog & Contenu',
    description:
      'Publiez et gérez les articles de blog (catégories : Nouveautés, Tutoriels, FAQ, Recettes). Gérez la mise en avant et la publication.',
    icon: FileText,
    href: '/admin/blog',
    color: 'from-sky-500 to-indigo-500',
    badge: 'Blog',
  },
];

// Indicateurs mockés
const stats = [
  { label: 'Utilisateurs', value: 248, change: '+12%', changeType: 'positive' },
  { label: 'Commandes du jour', value: 34, change: '+5%', changeType: 'positive' },
  { label: 'Revenus (mois)', value: '12 450 €', change: '+23%', changeType: 'positive' },
  { label: 'En attente', value: 12, change: '-3%', changeType: 'negative' },
];

/**
 * Page hub d’administration avec descriptions détaillées de chaque module.
 */
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Administration
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Gérez l’ensemble de la plateforme depuis ce tableau de bord central.
        </p>
      </div>

      {/* Indicateurs rapides */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <span
                className={`text-xs font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change} vs. semaine dernière
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grille de navigation avec descriptions complètes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {adminModules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group block" // lien bloc pour envelopper toute la carte
          >
            <Card className="cursor-pointer border border-gray-200/60 dark:border-gray-800/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-900/80 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  {module.title}
                </CardTitle>
                <module.icon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                {/* Description enrichie */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {module.description}
                </p>
                <Badge
                  className={`bg-gradient-to-r ${module.color} text-white border-0 text-xs`}
                >
                  {module.badge}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pied de page */}
      <p className="mt-16 text-center text-xs text-gray-400 dark:text-gray-600">
        Espace réservé aux administrateurs autorisés.
      </p>
    </div>
  );
}