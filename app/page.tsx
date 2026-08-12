//@/app/page.tsx
/*
role de la page : Page d'accueil publique
utilise /heroPublicS.png en fond pour mobile, /heroPublicM.png pour tablette et /heroPublicL.png pour desktop
au dessus affiche le composant HeaderPublic, le composant CarouselHero et le composant Footer

import HeaderPublique from '@/components/layout/public/HeaderPublic';
import Footer from '@/components/layout/footer/Footer';
import CarouselHero from '@/app/CarouselHero';
import Image from 'next/image';
*/

import HeaderPublique from '@/components/layout/public/header/HeaderPublic';
import Footer from '@/components/layout/public/footer/Footer';
import CarouselHero from '@/app/CarouselHero';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Header au-dessus de l'image */}
      <div className="relative z-30">
        <HeaderPublique />
      </div>

      {/* CarouselHero */}
      <div className="relative z-20 w-full">
        <CarouselHero />
      </div>

      {/* Zone de texte avec fond sombre à gauche */}
      <div className="relative z-20 flex-1 flex items-center pl-8 md:pl-16 lg:pl-24">
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap">
            Bienvenue sur ListaMiam
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-bold text-white whitespace-nowrap">
            Découvrez nos produits livrés chez vous
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Images de fond responsives */}
      <div className="absolute top-20 inset-0 z-0">
        {/* Mobile */}
        <Image
          src="/heroPublicS.png"
          alt="Hero background mobile"
          fill
          sizes="(max-width: 640px) calc(100vw - 2rem), 100vw"
          priority
          className="block sm:hidden object-cover"
        />
        {/* Tablette */}
        <Image
          src="/heroPublicM.png"
          alt="Hero background tablet"
          fill
          sizes="(max-width: 1024px) calc(100vw - 2rem), 100vw"
          priority
          className="hidden sm:block lg:hidden object-cover"
        />
        {/* Desktop */}
        <Image
          src="/publicL.png"
          alt="Hero background desktop"
          fill
          sizes="100vw"
          priority
          className="hidden lg:block object-cover"
        />
      </div> 
    </main>
  );
}