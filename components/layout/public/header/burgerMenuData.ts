// /data/burgerMenuData.ts
import { NavLink } from '@/lib/types/burgerMenuType';

export const burgerMenuData: NavLink[] = [
  // Section 1 : B2C - Restaurants, Dépanneurs, Magasins
  { id: 'restaurants', href: '#', label: 'Restaurants', icon: 'UtensilsCrossed' },
  { id: 'depanneurs', href: '#', label: 'Dépanneurs', icon: 'Store' },
  { id: 'magasins', href: '#', label: 'Magasins', icon: 'Store' },
  { id: 'promotions', href: '#', label: 'Promotions', icon: 'Percent' },
  
  // Section 2 : B2B - 
  { id: 'ajouter-etablissement', href: '/b2b/brandManager', label: 'Ajouter votre établissement', icon: 'PlusCircle' },
  { id: 'devenir-livreur', href: '/partenaire/devenir-livreur', label: 'Devenir Livreur', icon: 'Truck' },
  
  // Section 3 : admin et r&d 
  { id: 'accueil', href: '/', label: 'Accueil', icon: 'Home' },
  { id: 'admin', href: '/admin', label: 'Admin', icon: 'UtensilsCrossed' },
  { id: 'r&d', href: '/r&d', label: 'R&D', icon: 'UtensilsCrossed' },
  // section 4 : Contact 
  { id: 'contact', href: '/contact', label: 'Contact', icon: 'Phone' },
];