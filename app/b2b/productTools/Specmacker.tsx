//@ /components/product/tools/Specmacker.tsx
/*
role : Composant minimal pour Specmacker (spécifications produit).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface SpecmackerProps {
  onClose?: () => void;
}

export function Specmacker({ onClose }: SpecmackerProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Specmacker</h2>
      <p className="text-muted-foreground">
        Ajoutez, modifiez ou supprimez des spécifications techniques (poids, volume, etc.).
      </p>
      <p className="text-sm text-muted-foreground">(Fonctionnalités à venir)</p>
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
}