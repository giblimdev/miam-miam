//@ /app/b2b/brandManager/BrandManager.tsx
/*
 role : Composant de gestion des marques pour l'espace B2B.
        Permet de gérer les marques, leurs sites et produits.
 import:
   - React : useState, useEffect, useCallback
   - shadcn/ui : Button, Card, Table...
   - lucide-react : Plus, Pencil, Trash2...
   - @/actions/brandManager : getBrands, createBrand, updateBrand, deleteBrand
   - @/hooks/useBrandForm : hook de gestion du formulaire
   - @/lib/generated/prisma/client : type Brand
 useBy : app/b2b/brandManager/page.tsx
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/actions/brandManager';
import { useBrandForm } from '@/hooks/useBrandForm';
import type { Brand } from '@/lib/generated/prisma/client';

// ... reste du code ...

// ✅ Fonction exportée par défaut
export default function BrandManager() {
  // ... code du composant ...
}

// ❌ NE PAS UTILISER ce type d'export si vous voulez un export par défaut
// export { BrandManager };