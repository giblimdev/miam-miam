//@ /components/showsStores/ShowsStores.tsx
/*
 role : Composant d'affichage "chemin de fer" montrant l'utilisateur connecté, la marque sélectionnée et/ou le produit sélectionné selon le contexte. La prop `state` détermine le type de chemin affiché :
         - "product" : affiche Utilisateur → Marque → Produit
         - "site"    : affiche Utilisateur → Site (et éventuellement Marque si disponible)
 import: React, useSession depuis @/lib/auth/auth-client, useBrandStore depuis @/stores/useBrandStore, useProductStore depuis @/stores/useProductStore, useSiteStore depuis @/stores/useSiteStore, icônes lucide-react, Skeleton de shadcn/ui
 props transmise : state?: 'product' | 'site' (défaut 'product')
 props recus : aucune
 useBy : app/admin/siteManager/SiteManager.tsx, app/admin/brandManager/BrandManager.tsx, toute page nécessitant un affichage contextuel utilisateur/marque/produit/site.
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : Client Component utilisant plusieurs hooks pour accéder à la session utilisateur et aux stores Zustand. Le rendu est conditionné par la prop `state` pour sélectionner les données à afficher.
 - Choix techniques : Utilisation de Zustand pour l'état global (marque, produit, site). Better Auth pour la session. Les stores sont synchrones ; seul le chargement de la session est géré avec un skeleton.
 - Flux de données : Les données proviennent des stores et de la session. Le composant ne reçoit pas de props métier, uniquement la prop `state` qui oriente l'affichage.
 - Interactions UX : Affichage d'un fil d'Ariane stylisé avec icônes et séparateurs. Des textes de remplacement ("Non défini", "Non connecté") apparaissent si les données sont manquantes. Un skeleton est affiché pendant le chargement de la session.
*/
/* IMPERATIF :
architecture de l'ensemble des fichiers impliqués :
- /components/showsStores/ShowsStores.tsx (ce fichier)
- /stores/useBrandStore.ts
- /stores/useProductStore.ts (simplifié)
- /stores/useSiteStore.ts
- /lib/auth/auth-client.ts
*/

"use client";

import React from "react";
import { useSession } from "@/lib/auth/auth-client";
import { useBrandStore } from "@/stores/useBrandStore";
import { useProductStore } from "@/stores/useProductIdStore";
import { useSiteStore } from "@/stores/useSiteStore";
import { User, Building2, Package, Globe, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type ShowsStoresState = "product" | "site";

interface ShowsStoresProps {
  /** Définit le type de chemin affiché : "product" ou "site" */
  state?: ShowsStoresState;
}

/**
 * Composant d'affichage contextuel sous forme de fil d'Ariane.
 * Utilise les stores globaux pour afficher les noms de l'utilisateur, de la marque, du produit et/ou du site.
 */
export function ShowsStores({ state = "product" }: ShowsStoresProps) {
  // Récupération de la session utilisateur
  const { data: session, isPending: isSessionLoading } = useSession();
  const userName = session?.user?.name ?? null;

  // Stores pour marque, produit et site
  const { selectedBrandName } = useBrandStore();
  const { selectedProductName } = useProductStore(); // ← nom du produit uniquement
  const { selectedSiteName } = useSiteStore();

  // Affichage du skeleton si la session est en cours de chargement
  if (isSessionLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Skeleton className="h-5 w-24" />
        <ChevronRight className="h-4 w-4" />
        <Skeleton className="h-5 w-28" />
        {state === "product" && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Skeleton className="h-5 w-20" />
          </>
        )}
      </div>
    );
  }

  // Élément utilisateur (toujours présent)
  const userDisplay = userName ? (
    <span className="flex items-center gap-1.5 font-medium text-foreground">
      <User className="h-4 w-4 text-primary" />
      {userName}
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-muted-foreground italic">
      <User className="h-4 w-4" />
      Non connecté
    </span>
  );

  // Construction du fil d'Ariane en fonction de l'état
  let steps: React.ReactNode[] = [];

  if (state === "product") {
    // Chemin : Utilisateur → Marque → Produit
    const brandDisplay = selectedBrandName ? (
      <span className="flex items-center gap-1.5 font-medium text-foreground">
        <Building2 className="h-4 w-4 text-blue-500" />
        {selectedBrandName}
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-muted-foreground italic">
        <Building2 className="h-4 w-4" />
        Aucune marque
      </span>
    );

    const productDisplay = selectedProductName ? (
      <span className="flex items-center gap-1.5 font-medium text-foreground">
        <Package className="h-4 w-4 text-green-500" />
        {selectedProductName}
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-muted-foreground italic">
        <Package className="h-4 w-4" />
        Aucun produit
      </span>
    );

    steps = [userDisplay, brandDisplay, productDisplay];
  } else {
    // state === "site"
    const siteDisplay = selectedSiteName ? (
      <span className="flex items-center gap-1.5 font-medium text-foreground">
        <Globe className="h-4 w-4 text-purple-500" />
        {selectedSiteName}
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-muted-foreground italic">
        <Globe className="h-4 w-4" />
        Aucun site
      </span>
    );

    const brandDisplay = selectedBrandName ? (
      <span className="flex items-center gap-1.5 font-medium text-foreground">
        <Building2 className="h-4 w-4 text-blue-500" />
        {selectedBrandName}
      </span>
    ) : null;

    steps = [userDisplay, siteDisplay];
    if (brandDisplay) {
      steps.push(brandDisplay);
    }
  }

  // Construction du rendu avec séparateurs
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {step}
          {index < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
