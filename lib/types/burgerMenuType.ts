/*
  Chemin : /lib/types/burgerMenuType.ts
  Rôle : Types pour le menu burger.
*/

import { ReactNode } from 'react';

export interface NavLink {
  id: string;
  href: string;
  label: string;
  icon: string; 
}