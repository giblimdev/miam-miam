//@ /app/admin/brandManager/ProductDisplay.tsx
/*
 Rôle : Affiche la liste des produits dans un tableau responsive avec recherche,
        filtre par disponibilité et actions (modifier, supprimer). Reçoit les données
        en props depuis ProductManager.tsx. Affiche le slug sous le nom du produit.
        Inclut une zone de texte JSON copiable et un extrait de code coloré
        (type TypeScript + modèle Prisma) via react-syntax-highlighter.
 Importe :
   - React : useState, useMemo, useCallback
   - shadcn/ui : Table, Badge, Input, Select, Button, Textarea, Skeleton, Card
   - lucide-react : Search, Pencil, Trash2, Package, Copy, Check, Code2
   - react-syntax-highlighter : Prism as SyntaxHighlighter, thème oneDark
   - @/lib/utils : cn
   - @/lib/generated/prisma/client : type Product
   - sonner : toast
 Utilisé par : app/admin/brandManager/ProductManager.tsx
*/
/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Barre de filtres : recherche textuelle (nom/description/slug) + select disponibilité.
 - Tableau : nom (avec slug), prix, menu/produit simple, nutriScore, disponibilité, actions.
 - Extrait de code : affiche le type TypeScript et le modèle Prisma de Product avec coloration syntaxique.
 - Zone de sauvegarde manuelle : textarea JSON copiable.
 - Filtrage memoïsé avec useMemo.
 - Skeleton loading pour l'état de chargement.
 - Actions : onEdit(product) et onDelete(product) remontent au parent.
 - États vides distincts pour "aucun produit" et "aucun résultat de recherche".
*/

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Pencil,
  Trash2,
  Package,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/generated/prisma/client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ------------------------------------------------------------
// Types et constantes
// ------------------------------------------------------------

interface ProductDisplayProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const NUTRISCORE_COLORS: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-lime-100 text-lime-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  E: "bg-red-100 text-red-700",
};

type AvailabilityFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";

const PRODUCT_TYPE_EXCERPT = `type Product = {
  id: string;
  orderdisplay: number;
  name: string;
  slug: string;
  isMenu: boolean;
  description: string | null;
  price: number;
  isAvailable: boolean;
  nutriScore: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  brandId: string;
  categoryAssignments: CategoryAssignmentProduct[];
  productSpecs: ProductSpec[];
}`;

const PRISMA_MODEL_EXCERPT = `model Product {
  id              String    @id @default(cuid())
  orderdisplay    Int       @default(0)
  name            String
  slug            String    @unique
  isMenu          Boolean   @default(false)
  description     String?
  price           Float
  isAvailable     Boolean   @default(true)
  nutriScore      String?
  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  brandId         String
  Brand           Brand     @relation(fields: [brandId], references: [id])
  categoryAssignments CategoryAssignmentProduct[]
  productSpecs    ProductSpec[]
}`;

// ------------------------------------------------------------
// Composant principal
// ------------------------------------------------------------

export function ProductDisplay({
  products,
  isLoading = false,
  onEdit,
  onDelete,
}: ProductDisplayProps) {
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");
  const [copied, setCopied] = useState(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.slug.toLowerCase().includes(search.toLowerCase()) ||
        (product.description ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAvailability =
        availabilityFilter === "ALL" ||
        (availabilityFilter === "AVAILABLE" && product.isAvailable) ||
        (availabilityFilter === "UNAVAILABLE" && !product.isAvailable);

      return matchesSearch && matchesAvailability;
    });
  }, [products, search, availabilityFilter]);

  const productsJson = useMemo(
    () => JSON.stringify(products, null, 2),
    [products],
  );

  const handleCopyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(productsJson);
      setCopied(true);
      toast.success("JSON copié dans le presse-papiers");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le JSON");
    }
  }, [productsJson]);

  const handleCopyExcerpt = useCallback(async () => {
    const excerpt = `${PRODUCT_TYPE_EXCERPT}\n\n${PRISMA_MODEL_EXCERPT}`;
    try {
      await navigator.clipboard.writeText(excerpt);
      setCopiedExcerpt(true);
      toast.success("Extrait de code copié");
      setTimeout(() => setCopiedExcerpt(false), 2000);
    } catch {
      toast.error("Impossible de copier l’extrait de code");
    }
  }, []);

  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  }, []);

  const truncateDescription = useCallback(
    (desc: string | null, maxLength = 80): string => {
      if (!desc) return "—";
      if (desc.length <= maxLength) return desc;
      return desc.substring(0, maxLength).trimEnd() + "…";
    },
    [],
  );

  // ----------------------------------------------------------
  // État de chargement avec skeleton
  // ----------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                {Array.from({ length: 7 }).map((_, index) => (
                  <TableHead key={`skeleton-head-${index}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Aucun produit disponible
  // ----------------------------------------------------------
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucun produit
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Commencez par ajouter un premier produit.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Rendu principal
  // ----------------------------------------------------------
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
          value={availabilityFilter}
          onValueChange={(v) => setAvailabilityFilter(v as AvailabilityFilter)}
        >
          <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Disponibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="AVAILABLE">✅ Disponible</SelectItem>
            <SelectItem value="UNAVAILABLE">🚫 Indisponible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau ou état vide après filtre */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Aucun produit trouvé
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche ou de filtre.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead className="w-[100px]">Prix</TableHead>
                <TableHead className="hidden md:table-cell w-[90px] text-center">
                  Type
                </TableHead>
                <TableHead className="w-[90px] text-center">
                  Nutri-Score
                </TableHead>
                <TableHead className="w-[110px] text-center">Statut</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={`product-row-${product.id}`}
                  className={cn(
                    "transition-colors hover:bg-indigo-50/40 dark:hover:bg-gray-700/40",
                    product.deletedAt && "opacity-60",
                  )}
                >
                  <TableCell className="font-medium text-gray-800 dark:text-gray-100">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {product.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                      {truncateDescription(product.description)}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <Badge variant="outline" className="text-xs">
                      {product.isMenu ? "🍽️ Menu" : "🍴 Produit"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.nutriScore ? (
                      <Badge
                        className={cn(
                          "text-xs font-bold",
                          NUTRISCORE_COLORS[product.nutriScore],
                        )}
                      >
                        {product.nutriScore}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.isAvailable ? "default" : "outline"}
                      className={
                        product.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-400"
                      }
                    >
                      {product.isAvailable ? "Disponible" : "Indisponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        aria-label={`Modifier ${product.name}`}
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                        aria-label={`Supprimer ${product.name}`}
                        onClick={() => onDelete(product)}
                        disabled={!!product.deletedAt}
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

      {/* Extrait de code : type TypeScript et modèle Prisma */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Référence du modèle Product
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyExcerpt}
            className="gap-1.5"
          >
            {copiedExcerpt ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copier
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <SyntaxHighlighter
            language="typescript"
            style={oneDark}
            showLineNumbers
            customStyle={{
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            {PRODUCT_TYPE_EXCERPT}
          </SyntaxHighlighter>
          <SyntaxHighlighter
            language="typescript"
            style={oneDark}
            showLineNumbers
            customStyle={{
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            {PRISMA_MODEL_EXCERPT}
          </SyntaxHighlighter>
        </CardContent>
      </Card>

      {/* Zone de sauvegarde manuelle : JSON brut copiable */}
      <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Sauvegarde manuelle (JSON)
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copier
              </>
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={productsJson}
          className="font-mono text-xs h-48 resize-y bg-gray-50 dark:bg-gray-900"
          onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
}
