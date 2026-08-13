//@ /components/product/tools/IdentityForge.tsx
/*
role : Composant minimal pour l'outil IdentityForge (identité du produit). À terme, il permettra de modifier le nom, slug, description, prix, etc.
import : Button (shadcn/ui)
props transmise :[]
props recus : { onClose?: () => void }
useBy : ProductStudioPage (modale)
*/
'use client';

import { Button } from '@/components/ui/button';

interface IdentityForgeProps {
  onClose?: () => void;
}

export function IdentityForge({ onClose }: IdentityForgeProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Identity Forge</h2>
      <p className="text-muted-foreground">
        Gérez le nom, le slug, la description, le prix, la disponibilité, la marque et le Nutri-Score.
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