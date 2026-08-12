// /components/layout/public/MenuBurgerNav.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  UtensilsCrossed,
  Percent,
  Phone,
  Store,
  PlusCircle,
  Truck,
  Menu,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { burgerMenuData } from './burgerMenuData';
import { NavLink } from '@/lib/types/burgerMenuType';
import { useCarouselStore } from '@/stores/carouselStore';

// Mapping des noms d'icônes vers les composants lucide-react
const iconMap: Record<string, React.ElementType> = {
  Home: Home,
  UtensilsCrossed: UtensilsCrossed,
  Percent: Percent,
  Phone: Phone,
  Store: Store,
  PlusCircle: PlusCircle,
  Truck: Truck,
};

// Séparer les données en 4 sections
const section1 = burgerMenuData.slice(0, 4);
const section2 = burgerMenuData.slice(4, 6);
const section3 = burgerMenuData.slice(6, 9);
const section4 = burgerMenuData.slice(9);

interface MenuBurgerNavProps {
  className?: string;
}

const MenuBurgerNav = ({ className }: MenuBurgerNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedType } = useCarouselStore();

  const closeMenu = () => setIsOpen(false);

  const handleLinkClick = (item: NavLink) => {
    // Met à jour le store en fonction du lien cliqué
    if (item.id === 'restaurants') {
      setSelectedType('foodtype');
    } else if (item.id === 'depanneurs') {
      setSelectedType('producttype');
    } else if (item.id === 'magasins') {
      setSelectedType('magasintype');
    }

    // Ferme le menu après avoir exécuté l'action
    closeMenu();
  };

  const renderLinks = (items: NavLink[]) => {
    return items.map((item) => {
      const Icon = iconMap[item.icon];
      return (
        <Link
          key={item.id}
          href={item.href}
          onClick={(e) => {
            if (item.href === '#') {
              e.preventDefault(); // Empêche la navigation pour les actions
            }
            handleLinkClick(item);
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 text-gray-700 font-medium"
        >
          {Icon && <Icon className="w-5 h-5 text-orange-500" />}
          {item.label}
        </Link>
      );
    });
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <span
            className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </span>
        </DialogTrigger>
        <DialogContent className="w-[300px] sm:w-[350px] p-0 border-0 shadow-2xl rounded-xl left-0 top-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl font-bold text-orange-500">Menu</span>
            </DialogTitle>
          </DialogHeader>

          <nav className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Section 1 : B2C */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
                Commander
              </div>
              {renderLinks(section1)}
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* Section 2 : B2B */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
                Pro & Partenaires
              </div>
              {renderLinks(section2)}
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* Section 3 : Admin */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
                Administration
              </div>
              {renderLinks(section3)}
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* Section 4 : Contact */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
                Support
              </div>
              {renderLinks(section4)}
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuBurgerNav;