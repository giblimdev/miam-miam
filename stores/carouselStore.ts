// /store/carouselStore.ts

/*
expose le type de caroussel souhaité
*/


import { create } from 'zustand';

interface CarouselStore {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export const useCarouselStore = create<CarouselStore>((set) => ({
  selectedType: 'foodtype',
  setSelectedType: (type) => {
    console.log('🔄 CarouselStore changé :', type);
    set({ selectedType: type });
  },
}));