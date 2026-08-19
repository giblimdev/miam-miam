//@ /components/product/ProductSelector.tsx
/*
role : Composant affichant une liste de produits avec recherche et filtrage par marque.
        Un clic sur un produit sélectionne celui-ci dans le store global (useProductStore) en enregistrant son ID et son nom.
import :
  - Composants UI : Input, Button, ScrollArea (shadcn/ui)
  - Icônes : Search, Loader2
  - Hooks : useState, useEffect, useMemo
  - Action : getProducts (depuis @/actions/productManager)
  - Stores : useProductStore, useBrandStore
props transmise :[]
props recus :
  - onSelect ?: (id: string) => void – fonction optionnelle appelée lors de la sélection (par défaut, utilise le store)
  - className ?: string – classes CSS additionnelles pour le conteneur
useBy : ProductStudioPage (et potentiellement d'autres pages)
*/

"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { getProducts } from "@/actions/productManager";
import { useProductStore } from "@/stores/useProductIdStore";
import { useBrandStore } from "@/stores/useBrandStore";
import { cn } from "@/lib/utils";

// Type local correspondant à ce que retourne getProducts()
type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  isAvailable: boolean;
  isMenu: boolean;
  brand: { id: string; name: string } | null;
};

interface ProductSelectorProps {
  /** Fonction appelée lors de la sélection d'un produit (en complément du store) */
  onSelect?: (id: string) => void;
  /** Classes CSS additionnelles pour le conteneur */
  className?: string;
}

export function ProductSelector({ onSelect, className }: ProductSelectorProps) {
  const { setSelectedProduct, selectedProductId } = useProductStore();
  const { selectedBrandId } = useBrandStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des produits au montage
  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Erreur chargement produits :", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrage par recherche et par marque sélectionnée
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filtrer par marque si une marque est sélectionnée
    if (selectedBrandId) {
      result = result.filter((p) => p.brand?.id === selectedBrandId);
    }

    // Filtrer par texte de recherche
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }

    return result;
  }, [products, selectedBrandId, searchTerm]);

  const handleSelect = (id: string) => {
    // Trouver le produit sélectionné pour récupérer son nom
    const product = products.find((p) => p.id === id);
    if (product) {
      // Mettre à jour le store avec l'ID et le nom
      setSelectedProduct(product.id, product.name);
    } else {
      // Fallback : enregistrer uniquement l'ID
      setSelectedProduct(id, null);
    }

    // Appeler le callback optionnel
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Liste des produits */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {selectedBrandId
            ? "Aucun produit trouvé pour cette marque"
            : "Aucun produit trouvé"}
        </p>
      ) : (
        <ScrollArea className="h-72">
          <div className="space-y-1">
            {filteredProducts.map((product) => {
              const isSelected = product.id === selectedProductId;
              return (
                <Button
                  key={product.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isSelected && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => handleSelect(product.id)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm opacity-70">
                      {product.price?.toFixed(2)} €
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
