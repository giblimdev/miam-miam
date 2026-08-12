"use client"
import React from 'react';
import MenuBurgerNav from '@/components/layout/public/header/MenuBurgerNav';
import MainLogo from '@/components/layout/public/header/MainLogo';
import Located from '@/components/layout/public/header/Located';
import SearchBarre from '@/components/layout/public/header/SearchBarre';
import Isconnected from '@/components/layout/public/header/Isconnected';
import Chart from '@/components/layout/public/header/Chart';
import Help from '@/components/layout/public/header/Help';

function HeaderPublique() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 p-4 md:flex-nowrap md:gap-4">
      
      {/* Bloc gauche : menu burger (mobile) + logo */}
      <div className="flex flex-1 items-center gap-2 md:flex-none">
        <div className="block">
          <MenuBurgerNav />
        </div>
        <MainLogo />
      </div>


      {/* Bloc droit : localisation, connexion, panier, aide */}
      <div className="flex items-center gap-2">
        <Located />
              </div>
            {/* Barre de recherche : prend toute la largeur sur mobile, flex-1 sur desktop */}
      <div className="order-last w-full md:order-none md:flex-1">
        <SearchBarre />
      </div>

        <Isconnected />
        <div className="hidden sm:inline-block">
          <Chart />
        </div>
        <div className="hidden sm:inline-block">
          <Help />
        </div>

    </header>
  );
}

export default HeaderPublique;