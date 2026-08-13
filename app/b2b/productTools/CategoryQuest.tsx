//@ /components/product/tools/CategoryQuest.tsx
/*
role : Composant minimal pour CategoryQuest (gestion des catégories).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface CategoryQuestProps {
  onClose?: () => void;
}

export function CategoryQuest({ onClose }: CategoryQuestProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Category Quest</h2>
      <p className="text-muted-foreground">
        Assignez le produit à des catégories et gérez la hiérarchie.
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