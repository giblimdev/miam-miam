//@/app/admin/brandManager/SiteDisplay.tsx
/*
 role : Affiche la liste des sites dans un tableau responsive avec recherche,
        filtre par marque et par statut (ouvert/fermé), et actions (modifier, supprimer).
        Reçoit les données en props depuis la page parent. Gère les états vides.
 import:
   - React : useState, useMemo, useCallback
   - shadcn/ui : Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
                 Badge, Avatar, AvatarFallback, Input,
                 Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
                 Button, AlertDialog, AlertDialogAction, AlertDialogCancel,
                 AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
                 AlertDialogHeader, AlertDialogTitle
   - lucide-react : Search, Pencil, Trash2, MapPin, Clock, Truck, Phone, Mail
   - @/lib/data/daysWeek : getDayShort
   - @/lib/utils : cn
 useBy : app/admin/brandManager/SiteManager.tsx 
*/

/* 
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Barre de filtres : champ de recherche textuelle + select marque + select statut.
   * Tableau : liste les sites filtrés avec nom, marque, adresse, horaires, zones, statut, actions.
   * Dialogue de confirmation : AlertDialog pour valider la suppression d'un site.
 - Choix techniques :
   * Client Component ('use client') pour l'état local de recherche/filtre et le dialogue.
   * Données reçues en props (sites: Site[], brands: Brand[]) depuis le parent (SiteManager).
   * Filtrage memoïsé avec useMemo.
   * Les horaires sont résumés (ex: "Lun-Ven 9h-18h").
   * getDayShort importé depuis lib/data/daysWeek.ts pour l'affichage compact.
 - Flux de données :
   * sites + brands (props) → filteredSites (useMemo) → rendu tableau.
   * Actions : onEdit(site) et onDelete(siteId) remontent au parent.
   * Dialogue : setDeleteTarget(site) ouvre l'AlertDialog, handleDeleteConfirm appelle onDelete.
 - Interactions UX :
   * Recherche instantanée sur nom, ville, marque.
   * Filtre par marque (select dynamique depuis brands).
   * Filtre par statut (tous/ouvert/fermé).
   * État vide : message "Aucun site trouvé".
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/admin/brandManager/SiteDisplay.tsx (ce fichier)
- /app/admin/brandManager/SiteManager.tsx (page parent)
- /app/admin/brandManager/SiteForm.tsx (formulaire de création/édition)
- /lib/data/daysWeek.ts (jours de la semaine)
- /lib/types/shema.ts (interfaces Site, Brand)
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  Search,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  Truck,
  Phone,
  Mail,
  Store,
} from 'lucide-react';
import type { Site, Brand } from '@/lib/types/shema';
import { getDayShort } from '@/lib/data/daysWeek';
import { cn } from '@/lib/utils';

/**
 * Props attendues par le composant SiteDisplay.
 */
interface SiteDisplayProps {
  /** Liste complète des sites à afficher */
  sites: Site[];
  /** Liste des marques pour le filtre et l'affichage */
  brands: Brand[];
  /** Callback déclenché lors du clic sur le bouton d'édition */
  onEdit: (site: Site) => void;
  /** Callback déclenché après confirmation de suppression */
  onDelete: (siteId: string) => void;
}

/**
 * Affiche une liste de sites avec recherche, filtres
 * et actions d'édition/suppression.
 */
export function SiteDisplay({
  sites,
  brands,
  onEdit,
  onDelete,
}: SiteDisplayProps) {
  // États locaux pour les filtres
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cible de suppression
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Retrouve le nom d'une marque à partir de son ID.
   */
  const getBrandName = useCallback(
    (brandId: string): string => {
      return brands.find((b) => b.id === brandId)?.name ?? 'Inconnue';
    },
    [brands]
  );

  /**
   * Formate les horaires d'ouverture en résumé compact.
   * Ex: "Lun-Ven 9h-18h, Sam 10h-15h"
   */
  const formatOpeningHoursSummary = useCallback(
    (openingHours?: Site['openingHours']): string => {
      if (!openingHours || openingHours.length === 0) return 'Non définis';

      // Groupe les horaires par plage horaire identique
      const groups: { days: number[]; openTime: string; closeTime: string }[] = [];

      openingHours.forEach((oh) => {
        const existingGroup = groups.find(
          (g) => g.openTime === oh.openTime && g.closeTime === oh.closeTime
        );
        if (existingGroup) {
          existingGroup.days.push(oh.dayOfWeek);
        } else {
          groups.push({
            days: [oh.dayOfWeek],
            openTime: oh.openTime,
            closeTime: oh.closeTime,
          });
        }
      });

      // Formate chaque groupe
      return groups
        .map((g) => {
          const daysStr = g.days
            .sort((a, b) => a - b)
            .map((d) => getDayShort(d))
            .join('-');
          const timeStr = `${g.openTime.replace(':00', 'h')}-${g.closeTime.replace(':00', 'h')}`;
          return `${daysStr} ${timeStr}`;
        })
        .join(', ');
    },
    []
  );

  /**
   * Compte les zones de livraison actives.
   */
  const countActiveDeliveryZones = useCallback((site: Site): number => {
    return site.deliveryZones?.filter((z) => z.isActive).length ?? 0;
  }, []);

  /**
   * Filtre les sites selon les critères.
   */
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const brandName = getBrandName(site.brandId);

      const matchesSearch =
        search === '' ||
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        site.address.city.toLowerCase().includes(search.toLowerCase()) ||
        brandName.toLowerCase().includes(search.toLowerCase());

      const matchesBrand =
        brandFilter === 'ALL' || site.brandId === brandFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OPEN' && site.isOpen) ||
        (statusFilter === 'CLOSED' && !site.isOpen);

      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [sites, search, brandFilter, statusFilter, getBrandName]);

  /**
   * Gère la confirmation de suppression.
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, onDelete]);

  /**
   * Génère les initiales pour l'avatar.
   */
  const getInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <div className="space-y-4">
      {/* Barre de filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, ville ou marque..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 focus-visible:ring-green-400"
          />
        </div>
        <Select
          value={brandFilter}
          onValueChange={(value) => setBrandFilter(value ?? 'ALL')}
        >
          <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Toutes les marques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">🏷️ Toutes les marques</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={`filter-brand-${brand.id}`} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? 'ALL')}
        >
          <SelectTrigger className="w-[160px] bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">🔄 Tous</SelectItem>
            <SelectItem value="OPEN">🟢 Ouvert</SelectItem>
            <SelectItem value="CLOSED">🔴 Fermé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau ou état vide */}
      {filteredSites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Aucun site trouvé
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {sites.length === 0
              ? "La liste des sites est vide. Ajoutez un premier site."
              : "Essayez de modifier vos critères de recherche ou de filtre."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Site</TableHead>
                <TableHead className="hidden md:table-cell">Marque</TableHead>
                <TableHead className="hidden lg:table-cell">Adresse</TableHead>
                <TableHead className="hidden xl:table-cell">Horaires</TableHead>
                <TableHead className="w-[70px] text-center">Zones</TableHead>
                <TableHead className="w-[90px]">Statut</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <TableRow
                  key={`site-row-${site.id}`}
                  className={cn(
                    'transition-colors hover:bg-green-50/40 dark:hover:bg-gray-700/40',
                    site.deletedAt && 'opacity-60'
                  )}
                >
                  {/* Avatar */}
                  <TableCell>
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                      <AvatarFallback
                        className={cn(
                          'text-white text-sm',
                          site.isOpen
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                            : 'bg-gradient-to-br from-red-400 to-rose-500'
                        )}
                      >
                        {getInitials(site.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Nom + contacts */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {site.name}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {site.phone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {site.phone}
                          </span>
                        )}
                        {site.email && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {site.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Marque */}
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs font-normal">
                      {getBrandName(site.brandId)}
                    </Badge>
                  </TableCell>

                  {/* Adresse */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-start gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-gray-400" />
                      <span>
                        {site.address.street}, {site.address.postalCode}{' '}
                        {site.address.city}
                      </span>
                    </div>
                  </TableCell>

                  {/* Horaires */}
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{formatOpeningHoursSummary(site.openingHours)}</span>
                    </div>
                  </TableCell>

                  {/* Zones de livraison */}
                  <TableCell className="text-center">
                    <Badge
                      variant={countActiveDeliveryZones(site) > 0 ? 'default' : 'outline'}
                      className={cn(
                        'text-xs font-mono',
                        countActiveDeliveryZones(site) > 0
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                          : 'text-gray-400'
                      )}
                    >
                      <Truck className="h-3 w-3 mr-1" />
                      {countActiveDeliveryZones(site)}
                    </Badge>
                  </TableCell>

                  {/* Statut */}
                  <TableCell>
                    {site.deletedAt ? (
                      <Badge  className="text-xs">
                        Supprimé
                      </Badge>
                    ) : site.isOpen ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                        Ouvert
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Fermé
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        aria-label={`Modifier ${site.name}`}
                        onClick={() => onEdit(site)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label={`Supprimer ${site.name}`}
                        onClick={() => setDeleteTarget(site)}
                        disabled={!!site.deletedAt}
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
              Êtes-vous sûr de vouloir supprimer le site{' '}
              <span className="font-semibold">{deleteTarget?.name}</span> ?
              <br />
              Cette action est irréversible.
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