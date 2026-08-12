// /components/ui/CarouselProductType.tsx
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
import { Card, CardContent } from '@/components/ui/card';
import { productImages } from '@/app/carouselProductTypeData';

const CarouselProductType = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2">
        {productImages.map((item, index) => (
          <CarouselItem
            key={index}
            className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
          >
            <Card className="overflow-hidden border-0 shadow-none">
              <CardContent className="p-0">
                <div className="relative w-full h-8 sm:h-9 md:h-10 lg:h-10">
                  <Image
                    src={item.src}
                    alt={item.text}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                  />
                </div>
                <h3 className="text-gray-800 text-[11px] sm:text-xs lg:text-sm font-medium text-center truncate leading-tight mt-1">
                  {item.text}
                </h3>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-1 h-6 w-6" />
      <CarouselNext className="right-1 h-6 w-6" />
    </Carousel>
  );
};

export default CarouselProductType;