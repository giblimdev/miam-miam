//@ /app/admin/brandManager/BrandDisplay.tsx
/*
 role : Affiche la liste des marques dans un tableau responsive avec recherche,
        filtre par type et actions (modifier, supprimer). Reçoit les données en props
        depuis le parent BrandManager. Gère les états vides et la confirmation
        de suppression via AlertDialog.
 import:
   - React : useState, useMemo, useCallback
   - shadcn/ui : Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
                 Badge, Avatar, AvatarFallback, AvatarImage, Input,
                 Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
                 Button, AlertDialog, AlertDialogAction, AlertDialogCancel,
                 AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
                 AlertDialogHeader, AlertDialogTitle
   - lucide-react : Search, Pencil, Trash2, Store, ExternalLink
   - @/lib/utils : cn
   - ./BrandManager : BrandWithRelations (type partagé)
 useBy : app/admin/brandManager/BrandManager.tsx
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Barre de filtres : champ de recherche textuelle + select pour filtrer par type.
   * Tableau : liste les marques filtrées avec logo, nom/slug, types, description, sites, actions.
   * Dialogue de confirmation : AlertDialog pour valider la suppression d'une marque.
 - Choix techniques :
   * Client Component ('use client') pour l'état local de recherche/filtre.
   * Données reçues en props (brands: BrandWithRelations[]) depuis le parent (BrandManager).
   * Filtrage memoïsé avec useMemo pour performance.
   * Le type est importé depuis le composant parent pour une cohérence absolue.
 - Flux de données :
   * brands (props) → filteredBrands (useMemo selon search + typeFilter) → rendu tableau.
   * Actions : onEdit(brand) et onDelete(brandId) remontent au parent.
   * Dialogue : setDeleteTarget(brand) ouvre l'AlertDialog, handleDeleteConfirm appelle onDelete.
 - Interactions UX :
   * Recherche instantanée.
   * Filtre par type dynamique (basé sur BRAND_TYPES).
   * Compteur de sites par marque.
   * État vide avec message contextuel.
   * Indicateur visuel pour les marques soft-deleted (opacité réduite).
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/admin/brandManager/BrandDisplay.tsx (ce fichier)
- /app/admin/brandManager/BrandManager.tsx (fournit brands, onEdit, onDelete, et le type partagé)
- /app/admin/brandManager/BrandForm.tsx (formulaire de création/édition)
- /lib/data/brandTypeData.ts (constantes BRAND_TYPES et getBrandTypeEmoji)
- /lib/utils.ts (cn)
*/

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Pencil, Trash2, Store, ExternalLink } from 'lucide-react';
import type { BrandWithRelations } from './BrandManager';
import { BRAND_TYPES, getBrandTypeEmoji } from '@/lib/data/brandTypeData';
import { cn } from '@/lib/utils';

/**
 * Props du composant d'affichage des marques.
 */
interface BrandDisplayProps {
  /** Liste complète des marques enrichies */
  brands: BrandWithRelations[];
  /** Callback appelé lors d'une demande d'édition */
  onEdit: (brand: BrandWithRelations) => void;
  /** Callback appelé après confirmation de suppression */
  onDelete: (brandId: string) => void;
  /** Indique si une suppression est en cours (désactive les boutons) */
  isDeleting?: boolean;
}

/**
 * Affiche une liste de marques avec recherche, filtre par type
 * et actions d'édition/suppression. La confirmation de suppression
 * est gérée localement via une boîte de dialogue.
 */
export function BrandDisplay({
  brands,
  onEdit,
  onDelete,
  isDeleting = false,
}: BrandDisplayProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<BrandWithRelations | null>(null);

  /**
   * Filtre les marques selon la recherche textuelle et le type sélectionné.
   */
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch =
        search === '' ||
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.slug.toLowerCase().includes(search.toLowerCase()) ||
        brand.description.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === 'ALL' || brand.type.includes(typeFilter);

      return matchesSearch && matchesType;
    });
  }, [brands, search, typeFilter]);

  /**
   * Confirme la suppression et appelle le callback parent.
   */
  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, onDelete]);

  /**
   * Extrait les initiales d'un nom pour l'avatar.
   */
  const getInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  /**
   * Tronque une description à la longueur maximale donnée.
   */
  const truncateDescription = useCallback((desc: string, maxLength = 80): string => {
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength).trimEnd() + '…';
  }, []);

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtre */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, slug ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 focus-visible:ring-indigo-400"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value ?? 'ALL')}
        >
          <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">🏷️ Tous les types</SelectItem>
            {BRAND_TYPES.map((type) => (
              <SelectItem key={`filter-type-${type.value}`} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tableau ou état vide */}
      {filteredBrands.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Aucune marque trouvée
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {brands.length === 0
              ? "La liste des marques est vide. Ajoutez une première marque."
              : "Essayez de modifier vos critères de recherche ou de filtre."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Marque</TableHead>
                <TableHead className="hidden md:table-cell">Types</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="w-[80px] text-center">Sites</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow
                  key={`brand-row-${brand.id}`}
                  className={cn(
                    'transition-colors hover:bg-indigo-50/40 dark:hover:bg-gray-700/40',
                    brand.deletedAt && 'opacity-60'
                  )}
                >
                  {/* Logo */}
                  <TableCell>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={brand.logo ?? undefined}
                        alt={brand.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-sm">
                        {getInitials(brand.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Nom et slug */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {brand.name}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        /{brand.slug}
                      </span>
                    </div>
                  </TableCell>

                  {/* Types (caché sur mobile) */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {brand.type.length === 0 ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        brand.type.map((typeValue) => (
                          <Badge
                            key={`brand-type-${brand.id}-${typeValue}`}
                            variant="secondary"
                            className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {getBrandTypeEmoji(typeValue)} {typeValue}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>

                  {/* Description (caché sur mobile) */}
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                      {truncateDescription(brand.description)}
                    </p>
                  </TableCell>

                  {/* Nombre de sites */}
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs font-mono">
                      <Store className="h-3 w-3 mr-1" />
                      {brand.Site?.length ?? 0}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {brand.website && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          aria-label={`Visiter le site de ${brand.name}`}
                        >
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        aria-label={`Modifier ${brand.name}`}
                        onClick={() => onEdit(brand)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label={`Supprimer ${brand.name}`}
                        onClick={() => setDeleteTarget(brand)}
                        disabled={!!brand.deletedAt}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la marque{' '}
              <span className="font-semibold">{deleteTarget?.name}</span> ?
              <br />
              Cette action supprimera également tous les sites associés.
              Elle est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}