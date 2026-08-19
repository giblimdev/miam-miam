//@- @/app/b2b/productTools/betterSell/page.tsx

/* @/components/ShowStore.tsx
- @/components/ProductSelector.tsx
bouton qui affiche  @/components/ShowStore.tsx
- @/components/ProductSelector.tsx 



*/
import React from "react";
import { ShowsStores } from "@/components/ShowStore";
import { ProductSelector } from "@/components/ProductSelector";

import { Button } from "@base-ui/react/button";
function page() {
  return (
    <div>
      <h1>Better Sell/page</h1>
      ShowsStores
      <button>changer de Produit</button>
      <section>
        {" "}
        "Construire les relations commerciales entre produits : upsell,
        cross‑sell, accessoire, recommandation, alternative, avec ordre de
        priorité.",
      </section>
    </div>
  );
}

export default page;
