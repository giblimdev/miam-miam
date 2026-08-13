//@ /components/product/tools/OptionForge.tsx
/*
role : Composant minimal pour Option Forge (groupes d'options et personnalisations).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface OptionForgeProps {
  onClose?: () => void;
}

export function OptionForge({ onClose }: OptionForgeProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Option Forge</h2>
      <p className="text-muted-foreground">
        Créez des groupes d’options, des choix avec prix supplémentaires et allergènes.
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