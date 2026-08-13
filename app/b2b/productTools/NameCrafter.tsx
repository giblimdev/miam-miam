//@ /components/product/tools/NameCrafter.tsx
/*
role : Composant minimal pour Name Crafter (génération automatique de nom).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface NameCrafterProps {
  onClose?: () => void;
}

export function NameCrafter({ onClose }: NameCrafterProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Name Crafter</h2>
      <p className="text-muted-foreground">
        Générez automatiquement un nom à partir des catégories et spécifications.
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