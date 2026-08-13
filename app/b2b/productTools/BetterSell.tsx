//@ /components/product/tools/BetterSell.tsx
/*
role : Composant minimal pour BetterSell (produits complémentaires).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface BetterSellProps {
  onClose?: () => void;
}

export function BetterSell({ onClose }: BetterSellProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">BetterSell</h2>
      <p className="text-muted-foreground">
        Associez des produits en upsell, cross-sell ou accessoire.
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