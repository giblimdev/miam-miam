//@ /components/ui/CarouselHero.tsx
/* role : Composant conteneur du carrousel principal, affiche le type de carrousel sélectionné (food, product, magasin)
import : React, CarouselFoodType, CarouselProductType, CarouselMagasinType, useCarouselStore
useBy : app/page.tsx (page d'accueil)
*/

'use client';

import React from 'react';
import CarouselFoodType from './CarouselFoodType';
import CarouselProductType from './CarouselProductType';
import CarouselMagasinType from './CarouselMagasinType';
import { useCarouselStore } from '@/stores/carouselStore';

const CarouselHero = () => {
const { selectedType } = useCarouselStore();

// Sélection du carousel en fonction du type
const renderCarousel = () => {
switch (selectedType) {
case 'foodtype':
return <CarouselFoodType />;
case 'producttype':
return <CarouselProductType />;
case 'magasintype':
return <CarouselMagasinType />;
default:
return <CarouselFoodType />; // fallback
}
};

return (

<div className="w-full mt-5"> <div className="rounded-b-xl overflow-hidden"> {renderCarousel()} </div> </div> ); };
export default CarouselHero;