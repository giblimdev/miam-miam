/*
  Chemin : /components/layout/public/MainLogo.tsx
  Rôle : Logo du site, lien vers la page d'accueil. Utilise une image optimisée.
  Imports : React, Link, Image de Next, image importée
  Dépendances : next/image
  Fichiers liés : /assets/images/MainLogo.png (ou autre chemin)
*/

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MainLogoProps {
  className?: string;
}

const MainLogo = ({ className }: MainLogoProps) => {
  return (
    <Link
      href="/"
      className={`inline-block transition-opacity hover:opacity-80 ${className || ''}`}
      aria-label="Accueil"
    >
      <Image
        src="/mainLogo.png"
        alt="MonShop - Accueil"
        width={160}        // ajustez
        height={40}        // ajustez
        priority
        className="h-auto w-auto"
      />
    </Link>
  );
};

export default MainLogo;