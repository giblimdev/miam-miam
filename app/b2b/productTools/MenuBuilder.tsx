//@ /components/product/tools/MenuBuilder.tsx
/*
role : Composant minimal pour Menu Builder (construction des menus).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface MenuBuilderProps {
  onClose?: () => void;
}

export function MenuBuilder({ onClose }: MenuBuilderProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Menu Builder</h2>
      <p className="text-muted-foreground">
        Construisez des menus avec sections et éléments (produits existants).
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