//@/app/b2b/page.tsx
/*
  Rôle : Page principale B2B (Business to Business) 
  
  – Gestion des marques (Brand).
  - Gestion des établissements (Store, resto).
  - Gestion des produits (Product).
  - Gestion des recettes (Recipe).
  - Gestion des ingredients (Ingredient).
  - Gestion des stock (Stock).
  - Gestion des Fournisseurs (Supplier).
  
  
  
  Fichiers impliqués :




// /app/b2b/page.tsx
/*
  RÔLE : Page principale B2B (Business to Business)
  
  Cette page sert de tableau de bord central pour toutes les fonctionnalités
  de gestion B2B de la plateforme Miam-Miam.

  FONCTIONNALITÉS PRINCIPALES :
  - Gestion des marques (Brand)
  - Gestion des établissements (Store/Restaurant)
  - Gestion des produits (Product)
  - Gestion des recettes (Recipe)
  - Gestion des ingrédients (Ingredient)
  - Gestion des stocks (Stock)
  - Gestion des fournisseurs (Supplier)
  - Commandes B2B
  - Rapports et analytics

  STRUCTURE DE LA PAGE :
  1. En-tête avec bienvenue et indicateurs clés
  2. Cartes de navigation rapide vers les différentes sections
  3. Statistiques et métriques principales
  4. Activité récente
  5. Actions rapides

  FICHIERS IMPLIQUÉS :
  - /app/b2b/layout.tsx (Layout spécifique B2B)
  - /app/b2b/brands/page.tsx (Gestion des marques)
  - /app/b2b/stores/page.tsx (Gestion des établissements)
  - /app/b2b/products/page.tsx (Gestion des produits)
  - /app/b2b/recipes/page.tsx (Gestion des recettes)
  - /app/b2b/ingredients/page.tsx (Gestion des ingrédients)
  - /app/b2b/stock/page.tsx (Gestion des stocks)
  - /app/b2b/suppliers/page.tsx (Gestion des fournisseurs)
  - /app/b2b/orders/page.tsx (Commandes B2B)
  - /app/b2b/analytics/page.tsx (Analyses et rapports)
  - /components/b2b/DashboardStats.tsx (Statistiques)
  - /components/b2b/QuickActions.tsx (Actions rapides)
  - /components/b2b/RecentActivity.tsx (Activité récente)
  - /lib/types/brandType.ts (Types des marques)
  - /lib/types/storeType.ts (Types des établissements)
  - /lib/types/productType.ts (Types des produits)
  - /stores/useBrandStore.ts (Store des marques)
  - /stores/useProductStore.ts (Store des produits)
  - /services/brandService.ts (Service des marques)
  - /services/productService.ts (Service des produits)
*/

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Store,
  Package,
  UtensilsCrossed,
  Beef,
  Warehouse,
  Truck,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ============================================
// Types
// ============================================

interface DashboardStats {
  totalBrands: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  revenueChange: number;
  activeOrders: number;
  lowStockItems: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'brand' | 'store' | 'stock';
  action: string;
  entity: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed' | 'warning';
  user: string;
}

// ============================================
// Données simulées (à remplacer par les vraies données)
// ============================================

const mockStats: DashboardStats = {
  totalBrands: 24,
  totalStores: 156,
  totalProducts: 1243,
  totalOrders: 89,
  revenue: 284750,
  revenueChange: 12.5,
  activeOrders: 34,
  lowStockItems: 12,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'order',
    action: 'Nouvelle commande',
    entity: '#CMD-2024-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'success',
    user: 'Jean Dupont',
  },
  {
    id: '2',
    type: 'product',
    action: 'Produit ajouté',
    entity: 'Burger Deluxe',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'success',
    user: 'Marie Martin',
  },
  {
    id: '3',
    type: 'stock',
    action: 'Stock critique',
    entity: 'Pain burger (Stock: 5)',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'warning',
    user: 'Système',
  },
  {
    id: '4',
    type: 'order',
    action: 'Commande en attente',
    entity: '#CMD-2024-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    status: 'pending',
    user: 'Pierre Durand',
  },
  {
    id: '5',
    type: 'brand',
    action: 'Marque modifiée',
    entity: 'McDonald\'s',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    status: 'success',
    user: 'Sophie Lefèvre',
  },
];

// ============================================
// Composants internes
// ============================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg ${color || 'bg-primary/10'}`}>
        <Icon className={`h-5 w-5 ${color ? `text-${color}` : 'text-primary'}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center mt-2">
          {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
          {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
          <span
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}
          >
            {trendValue}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const NavigationCard = ({
  title,
  description,
  icon: Icon,
  href,
  count,
  color,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  count?: number;
  color?: string;
}) => (
  <Link href={href} className="block group">
    <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className={`p-3 rounded-lg w-fit ${color || 'bg-primary/10'} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-6 w-6 ${color ? `text-${color}` : 'text-primary'}`} />
            </div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {count !== undefined && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {count}
            </Badge>
          )}
        </div>
        <div className="flex items-center mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
          <span>Accéder</span>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const StatusBadge = ({ status }: { status: RecentActivity['status'] }) => {
  const config = {
    success: { label: 'Succès', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    pending: { label: 'En attente', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    failed: { label: 'Échoué', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
    warning: { label: 'Alerte', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  };

  const { label, className } = config[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

// ============================================
// Page principale
// ============================================

export default function B2BPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Simulation de chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStats(mockStats);
        setRecentActivity(mockRecentActivity);
      } catch (error) {
        console.error('Erreur de chargement des données B2B :', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================================
  // Rendu
  // ============================================

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ============================================ */}
      {/* En-tête */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de bord B2B
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez l'ensemble de votre activité B2B en un seul endroit
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => router.push('/b2b/brands/new')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle marque
          </Button>
        </div>
      </div>

      <Separator />

      {/* ============================================ */}
      {/* Statistiques */}
      {/* ============================================ */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Marques"
            value={stats.totalBrands}
            icon={Building2}
            description="Marques partenaires"
            trend="up"
            trendValue="+4 ce mois"
            color="text-blue-500 bg-blue-500/10"
          />
          <StatCard
            title="Établissements"
            value={stats.totalStores}
            icon={Store}
            description="Points de vente actifs"
            trend="up"
            trendValue="+12 ce mois"
            color="text-green-500 bg-green-500/10"
          />
          <StatCard
            title="Produits"
            value={stats.totalProducts}
            icon={Package}
            description="Références disponibles"
            trend="up"
            trendValue="+48 ce mois"
            color="text-purple-500 bg-purple-500/10"
          />
          <StatCard
            title="Commandes"
            value={stats.totalOrders}
            icon={ShoppingCart}
            description="Commandes en cours"
            trend="down"
            trendValue="-3% cette semaine"
            color="text-orange-500 bg-orange-500/10"
          />
        </div>
      )}

      {/* ============================================ */}
      {/* Navigation rapide */}
      {/* ============================================ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Navigation rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NavigationCard
            title="Marques"
            description="Gérer les marques partenaires"
            icon={Building2}
            href="/b2b/brands"
            count={stats?.totalBrands}
            color="bg-blue-500/10 text-blue-500"
          />
          <NavigationCard
            title="Établissements"
            description="Gérer les restaurants et points de vente"
            icon={Store}
            href="/b2b/stores"
            count={stats?.totalStores}
            color="bg-green-500/10 text-green-500"
          />
          <NavigationCard
            title="Produits"
            description="Catalogue de produits"
            icon={Package}
            href="/b2b/products"
            count={stats?.totalProducts}
            color="bg-purple-500/10 text-purple-500"
          />
          <NavigationCard
            title="Recettes"
            description="Gestion des recettes"
            icon={UtensilsCrossed}
            href="/b2b/recipes"
            color="bg-amber-500/10 text-amber-500"
          />
          <NavigationCard
            title="Ingrédients"
            description="Base d'ingrédients"
            icon={Beef}
            href="/b2b/ingredients"
            color="bg-red-500/10 text-red-500"
          />
          <NavigationCard
            title="Stocks"
            description="Gestion des stocks"
            icon={Warehouse}
            href="/b2b/stock"
            count={stats?.lowStockItems}
            color="bg-orange-500/10 text-orange-500"
          />
          <NavigationCard
            title="Fournisseurs"
            description="Gestion des fournisseurs"
            icon={Truck}
            href="/b2b/suppliers"
            color="bg-teal-500/10 text-teal-500"
          />
          <NavigationCard
            title="Commandes"
            description="Commandes B2B"
            icon={ShoppingCart}
            href="/b2b/orders"
            count={stats?.activeOrders}
            color="bg-indigo-500/10 text-indigo-500"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* Activité récente et métriques */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activité récente</CardTitle>
                <Link href="/b2b/activity">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Voir tout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Dernières actions effectuées sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-muted">
                            {activity.type === 'order' && <ShoppingCart className="h-4 w-4" />}
                            {activity.type === 'product' && <Package className="h-4 w-4" />}
                            {activity.type === 'brand' && <Building2 className="h-4 w-4" />}
                            {activity.type === 'store' && <Store className="h-4 w-4" />}
                            {activity.type === 'stock' && <Warehouse className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.action} - {activity.entity}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{activity.user}</span>
                              <span>•</span>
                              <span>
                                {new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
                                  Math.ceil((activity.timestamp.getTime() - Date.now()) / 60000),
                                  'minute'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={activity.status} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides et alertes */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Tâches courantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push('/b2b/brands/new')}
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter une marque
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push('/b2b/products/new')}
              >
                <Package className="h-4 w-4" />
                Ajouter un produit
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push('/b2b/orders/new')}
              >
                <ShoppingCart className="h-4 w-4" />
                Nouvelle commande
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push('/b2b/analytics')}
              >
                <BarChart3 className="h-4 w-4" />
                Voir les analyses
              </Button>
            </CardContent>
          </Card>

          {/* Alertes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Alertes
              </CardTitle>
              <CardDescription>Actions nécessaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats && stats.lowStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      Stock critique
                    </span>
                  </div>
                  <Badge variant="destructive">{stats.lowStockItems} articles</Badge>
                </div>
              )}
              {stats && stats.activeOrders > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      Commandes en attente
                    </span>
                  </div>
                  <Badge>{stats.activeOrders}</Badge>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    Chiffre d'affaires
                  </span>
                </div>
                <span className="font-semibold text-green-500">
                  +{stats?.revenueChange || 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============================================ */}
      {/* Pied de page */}
      {/* ============================================ */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>
          Plateforme B2B - Miam-Miam v1.0 - Tous droits réservés
        </p>
      </div>
    </div>
  );
}