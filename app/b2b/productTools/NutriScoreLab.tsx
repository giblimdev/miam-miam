//@ /components/product/tools/NutriScoreLab.tsx
/*
role : Composant minimal pour Nutri & Score Lab (allergènes, infos nutritionnelles, scores).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface NutriScoreLabProps {
  onClose?: () => void;
}

export function NutriScoreLab({ onClose }: NutriScoreLabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nutri & Score Lab</h2>
      <p className="text-muted-foreground">
        Gérez les allergènes, les valeurs nutritionnelles et les scores (Nutri-Score, éco-score, etc.).
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