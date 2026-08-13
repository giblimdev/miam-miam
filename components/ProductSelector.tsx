//@ /components/product/ProductSelector.tsx
/*
role : Composant permettant de sélectionner un produit parmi une liste. Ouvre un dialogue avec recherche et affichage des résultats.
import : 
  - Composants UI : Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Input, Button, ScrollArea (shadcn/ui)
  - Icônes : Search, Loader2
  - Hooks : useState, useEffect
  - Action : getProducts (depuis @/actions/productManager)
  - Store : useProductStore (pour mettre à jour le produit sélectionné)
props transmise :[]
props recus : 
  - onSelect ?: (id: string) => void – fonction optionnelle appelée lors de la sélection (par défaut, utilise le store)
  - trigger ?: React.ReactNode – élément déclencheur (si non fourni, un bouton par défaut)
useBy : ProductStudioPage (et potentiellement d'autres pages)
*/

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2 } from 'lucide-react';
import { getProducts } from '@/actions/productManager';
import { useProductStore } from '@/stores/storeProductStore';

// Type local correspondant exactement à ce que retourne getProducts()
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
  onSelect?: (id: string) => void;
  trigger?: React.ReactNode;
}

export function ProductSelector({ onSelect, trigger }: ProductSelectorProps) {
  const { setSelectedProductId } = useProductStore();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getProducts()
        .then((data) => {
          // La réponse est déjà conforme au type attendu (sans gallery)
          setProducts(data);
        })
        .catch((error) => {
          console.error('Erreur chargement produits :', error);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    // Mettre à jour le store avec l'ID sélectionné
    setSelectedProductId(id);
    // Appeler le callback optionnel
    if (onSelect) {
      onSelect(id);
    }
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || <Button variant="outline">Sélectionner un produit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir un produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Aucun produit trouvé</p>
          ) : (
            <ScrollArea className="h-72">
              <div className="space-y-1">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelect(product.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.price?.toFixed(2)} €
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}