//@/app/CarouselMagasinType.tsx
/* role : Carrousel en bandeau affichant plusieurs images de magasins à la fois (type magasins)
   import : React, useState, useEffect, Image, ChevronLeft, ChevronRight
   useBy : components/ui/CarouselHero.tsx
*/

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MagasinImage {
  src: string;
  text: string;
}

const magasinImages: MagasinImage[] = [
  { src: '/magasintype/magasin1.png', text: 'Épiceries fines' },
  { src: '/magasintype/magasin2.png', text: 'Boutiques locales' },
  { src: '/magasintype/magasin3.png', text: 'Marchés traditionnels' },
  { src: '/magasintype/magasin4.png', text: 'Commerces de proximité' },
  { src: '/magasintype/tienda1.png', text: 'Spécialités régionales' },
  { src: '/magasintype/magasin1.png', text: 'Produits frais' },
  { src: '/magasintype/magasin2.png', text: 'Artisanat local' },
];

const CarouselMagasinType = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Déterminer le nombre d'éléments visibles selon la taille d'écran
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(2);
      else if (width < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const totalSlides = magasinImages.length;
  const maxIndex = Math.max(0, totalSlides - slidesPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-défilement
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Calcul de la largeur de chaque slide en pourcentage
  const slideWidth = 100 / slidesPerView;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
      {/* Conteneur du carrousel */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * slideWidth}%)`,
          width: `${magasinImages.length * slideWidth}%`,
        }}
      >
        {magasinImages.map((item, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 p-2"
            style={{ width: `${slideWidth}%` }}
          >
            <div className="relative h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src={item.src}
                alt={item.text}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="text-white text-sm sm:text-base md:text-lg font-bold text-center drop-shadow-md">
                  {item.text}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
        aria-label="Précédent"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
        aria-label="Suivant"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Indicateurs de page */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à la page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselMagasinType;