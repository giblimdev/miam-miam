//@ /components/product/tools/PriceAlchemist.tsx
/*
role : Composant minimal pour Price Alchemist (calcul des coûts et prix).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface PriceAlchemistProps {
  onClose?: () => void;
}

export function PriceAlchemist({ onClose }: PriceAlchemistProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Price Alchemist</h2>
      <p className="text-muted-foreground">
        Calculez le coût de revient et proposez un prix de vente.
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