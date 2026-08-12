// @/app/admin/navAdmin.ts

import { 
  ListOrdered, 
  Users, 
  Building2, 
  Tags, 
  Shield, 
  Settings 
} from "lucide-react"

export interface NavAdminItem {
  title: string
  href: string
  icon: any
  description: string
  badge?: string
}

export interface NavAdminCategory {
  categoryTitle: string
  items: NavAdminItem[]
}

export const navAdmin: NavAdminCategory[] = [
  {
    categoryTitle: "Administration Principale",
    items: [
      {
        title: "Administration des marques",
        href: "/admin/brandAdmin",
        icon: Building2,
        description: "Gestion des marques, sites, produits et promotions",
        badge: "Brands"
      },
      {
        title: "Administration des Utilisateurs",
        href: "/admin/userAdmin",
        icon: Users,
        description: "Gestion des utilisateurs, rôles et permissions",
        badge: "Users"
      },
      {
        title: "Modèles Génériques",
        href: "/admin/utilityModel",
        icon: ListOrdered,
        description: "Listes, énumérations et données de référence",
        badge: "Utils"
      }
    ]
  },
  {
    categoryTitle: "Configuration",
    items: [
      {
        title: "Rôles & Permissions",
        href: "/admin/roles",
        icon: Shield,
        description: "Gestion des rôles et contrôle d'accès RBAC"
      },
      {
        title: "Paramètres Généraux",
        href: "/admin/settings",
        icon: Settings,
        description: "Configuration globale de la plateforme"
      },
      {
        title: "Catégories & Tags",
        href: "/admin/categories",
        icon: Tags,
        description: "Gestion des catégories et métadonnées"
      }
    ]
  }
]