//@/components/CarouselFoodType.tsx
/* role : Carrousel de types de cuisine, ultra‑compact, épuré et lisible.
   import : React, Image, Carousel (shadcn), foodImages
   useBy : page d'accueil
*/

'use client';

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { foodImages } from '@/app/CarouselFoodTypeData';

const CarouselFoodType = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
        dragFree: true,
      }}
      className="w-full"
    >
      {/* gap-0, marges et paddings forcés à zéro */}
      <CarouselContent className="flex !gap-0 !m-0 !p-0">
        {foodImages.map((item, index) => (
          <CarouselItem
            key={item.text || index}
            className="!p-0 flex-[0_0_auto] w-[56px] sm:w-[64px] md:w-[70px]"
          >
            <div className="flex flex-col items-center justify-center gap-0.5 py-0.5 px-0 cursor-pointer group hover:opacity-80 transition-opacity min-w-0 overflow-hidden bg-white/40 backdrop-blur-sm">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0">
                <Image
                  src={item.src}
                  alt={item.text}
                  fill
                  className="object-cover rounded-full"
                  sizes="64px"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 text-center leading-tight truncate w-full max-w-full group-hover:text-orange-500 transition-colors">
                {item.text}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-0 h-6 w-6 bg-white/80 shadow-sm hover:bg-white" />
      <CarouselNext className="right-0 h-6 w-6 bg-white/80 shadow-sm hover:bg-white" />
    </Carousel>
  );
};

export default CarouselFoodType;