//@ /components/product/tools/VisualDeck.tsx
/*
role : Composant minimal pour Visual Deck (gestion des images).
import : Button
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage
*/
'use client';

import { Button } from '@/components/ui/button';

interface VisualDeckProps {
  onClose?: () => void;
}

export function VisualDeck({ onClose }: VisualDeckProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Visual Deck</h2>
      <p className="text-muted-foreground">
        Téléchargez l’image principale et les images de galerie.
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