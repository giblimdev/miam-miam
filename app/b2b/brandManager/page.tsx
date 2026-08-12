// app/b2b/brandManager/page.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandManager from './BrandManager';
import SiteManager from './SiteManager';
import ProductManager from './ProductManager';
import { useBrandStore } from '@/stores/useBrandStore';

export default function BrandManagerPage() {
  const selectedBrandId = useBrandStore((state) => state.selectedBrandId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion B2B</h1>

      <Tabs defaultValue="brands" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brands">Marques</TabsTrigger>
          <TabsTrigger value="sites" disabled={!selectedBrandId}>
            Sites
          </TabsTrigger>
          <TabsTrigger value="products" disabled={!selectedBrandId}>
            Produits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brands">
          <BrandManager />
        </TabsContent>

        <TabsContent value="sites">
          <SiteManager />
        </TabsContent>

        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}