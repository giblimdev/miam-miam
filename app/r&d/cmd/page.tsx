
/**
 * Chemin : /app/cmd/page.tsx
 *
 * Rôle :
 * Page de documentation des commandes utiles au développement.
 *
 * Source :
 * /app/devtools/CmdData.ts
 *
 * Fonctionnalités :
 * - recherche de commandes ;
 * - filtrage par catégorie ;
 * - affichage des favoris ;
 * - cartes colorées par technologie ;
 * - copie de commande ;
 * - affichage des variantes ;
 * - affichage des avertissements ;
 * - affichage des exemples ;
 * - affichage du nombre de commandes.
 */
"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Command,
  ExternalLink,
  Filter,
  GitBranch,
  Package,
  Database,
  Search,
  ShieldCheck,
  Star,
  Terminal,
  X,
} from "lucide-react";

import {
  cmdCategories,
  cmdData,
  type CmdCategory,
  type CmdData,
} from "@/app/r&d/cmd/cmdDaata";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

/* =========================================================
   CONFIGURATION VISUELLE
   ========================================================= */

const categoryStyles: Record<
  CmdCategory,
  {
    icon: typeof Terminal;
    className: string;
    badgeClassName: string;
  }
> = {
  git: {
    icon: GitBranch,
    className:
      "from-orange-500/20 via-orange-500/10 to-transparent border-orange-500/30",
    badgeClassName:
      "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  },

  github: {
    icon: GitBranch,
    className:
      "from-slate-500/20 via-slate-500/10 to-transparent border-slate-500/30",
    badgeClassName:
      "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
  },

  npm: {
    icon: Package,
    className:
      "from-red-500/20 via-red-500/10 to-transparent border-red-500/30",
    badgeClassName:
      "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  },

  nextjs: {
    icon: Code2,
    className:
      "from-gray-500/20 via-gray-500/10 to-transparent border-gray-500/30",
    badgeClassName:
      "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
  },

  prisma: {
    icon: Database,
    className:
      "from-cyan-500/20 via-cyan-500/10 to-transparent border-cyan-500/30",
    badgeClassName:
      "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
  },

  database: {
    icon: Database,
    className:
      "from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30",
    badgeClassName:
      "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },

  neon: {
    icon: Database,
    className:
      "from-green-500/20 via-green-500/10 to-transparent border-green-500/30",
    badgeClassName:
      "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  },

  "better-auth": {
    icon: ShieldCheck,
    className:
      "from-violet-500/20 via-violet-500/10 to-transparent border-violet-500/30",
    badgeClassName:
      "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  },

  shadcn: {
    icon: Code2,
    className:
      "from-pink-500/20 via-pink-500/10 to-transparent border-pink-500/30",
    badgeClassName:
      "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30",
  },

  tailwind: {
    icon: Code2,
    className:
      "from-sky-500/20 via-sky-500/10 to-transparent border-sky-500/30",
    badgeClassName:
      "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  },

  typescript: {
    icon: Code2,
    className:
      "from-blue-600/20 via-blue-600/10 to-transparent border-blue-600/30",
    badgeClassName:
      "bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-600/30",
  },

  react: {
    icon: Code2,
    className:
      "from-cyan-400/20 via-cyan-400/10 to-transparent border-cyan-400/30",
    badgeClassName:
      "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/30",
  },

  zustand: {
    icon: Code2,
    className:
      "from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30",
    badgeClassName:
      "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  },

  swr: {
    icon: Code2,
    className:
      "from-indigo-500/20 via-indigo-500/10 to-transparent border-indigo-500/30",
    badgeClassName:
      "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  },

  forms: {
    icon: Code2,
    className:
      "from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30",
    badgeClassName:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },

  validation: {
    icon: Check,
    className:
      "from-green-500/20 via-green-500/10 to-transparent border-green-500/30",
    badgeClassName:
      "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  },

  ui: {
    icon: Code2,
    className:
      "from-fuchsia-500/20 via-fuchsia-500/10 to-transparent border-fuchsia-500/30",
    badgeClassName:
      "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
  },

  debug: {
    icon: Terminal,
    className:
      "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30",
    badgeClassName:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },

  build: {
    icon: Terminal,
    className:
      "from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/30",
    badgeClassName:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },

  other: {
    icon: Command,
    className:
      "from-gray-500/20 via-gray-500/10 to-transparent border-gray-500/30",
    badgeClassName:
      "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
  },
};

/* =========================================================
   COMPOSANT : BOUTON COPIER
   ========================================================= */

function CopyButton({
  command,
  copied,
  onCopy,
}: {
  command: string;
  copied: boolean;
  onCopy: (command: string) => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={() => onCopy(command)}
      className="shrink-0 gap-2 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copié
        </>
      ) : (
        <>
          <Clipboard className="size-4" />
          Copier
        </>
      )}
    </Button>
  );
}

/* =========================================================
   COMPOSANT : COMMANDE
   ========================================================= */

function CommandBlock({
  command,
  copiedCommand,
  onCopy,
}: {
  command: string;
  copiedCommand: string | null;
  onCopy: (command: string) => void;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-xl border bg-background/80 p-2 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
        <Terminal className="size-4 shrink-0 text-muted-foreground" />

        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1 font-mono text-sm">
          {command}
        </code>
      </div>

      <CopyButton
        command={command}
        copied={copiedCommand === command}
        onCopy={onCopy}
      />
    </div>
  );
}

/* =========================================================
   COMPOSANT : CARTE COMMANDE
   ========================================================= */

function CommandCard({
  cmd,
  copiedCommand,
  onCopy,
}: {
  cmd: CmdData;
  copiedCommand: string | null;
  onCopy: (command: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const style = categoryStyles[cmd.category] ?? categoryStyles.other;

  const Icon = style.icon;

  return (
    <Card
      className={cn(
        "overflow-hidden border bg-gradient-to-br transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        style.className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background/80 shadow-sm">
              <Icon className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold leading-tight">
                  {cmd.title}
                </h2>

                {cmd.favorite && (
                  <Star className="size-4 fill-current text-yellow-500" />
                )}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {cmd.technology}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn("shrink-0", style.badgeClassName)}
          >
            {cmd.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {cmd.description}
        </p>

        <CommandBlock
          command={cmd.command}
          copiedCommand={copiedCommand}
          onCopy={onCopy}
        />

        {cmd.tags && cmd.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cmd.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px]"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {(cmd.details ||
          cmd.warning ||
          cmd.note ||
          cmd.variants?.length ||
          cmd.examples?.length ||
          cmd.prerequisites?.length) && (
          <>
            <Separator />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => setExpanded((value) => !value)}
            >
              <span>
                {expanded ? "Masquer les détails" : "Afficher les détails"}
              </span>

              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </>
        )}

        {expanded && (
          <div className="space-y-4">
            {cmd.details && (
              <div className="rounded-xl border bg-background/60 p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {cmd.details}
                </p>
              </div>
            )}

            {cmd.warning && (
              <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />

                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">
                    Attention
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {cmd.warning}
                  </p>
                </div>
              </div>
            )}

            {cmd.note && (
              <div className="rounded-xl border bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Note
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {cmd.note}
                </p>
              </div>
            )}

            {cmd.variants && cmd.variants.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">
                  Variantes
                </p>

                {cmd.variants.map((variant) => (
                  <div key={`${cmd.id}-${variant.label}`} className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {variant.label}
                    </div>

                    <CommandBlock
                      command={variant.command}
                      copiedCommand={copiedCommand}
                      onCopy={onCopy}
                    />

                    {variant.description && (
                      <p className="px-1 text-xs text-muted-foreground">
                        {variant.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cmd.examples && cmd.examples.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">
                  Exemples
                </p>

                {cmd.examples.map((example) => (
                  <div
                    key={`${cmd.id}-${example.label}`}
                    className="space-y-2"
                  >
                    <div className="text-xs font-medium text-muted-foreground">
                      {example.label}
                    </div>

                    <CommandBlock
                      command={example.command}
                      copiedCommand={copiedCommand}
                      onCopy={onCopy}
                    />

                    {example.description && (
                      <p className="px-1 text-xs text-muted-foreground">
                        {example.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cmd.prerequisites && cmd.prerequisites.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Prérequis
                </p>

                <ul className="space-y-2">
                  {cmd.prerequisites.map((prerequisite) => (
                    <li
                      key={`${cmd.id}-${prerequisite.label}`}
                      className="rounded-lg border bg-background/60 p-3"
                    >
                      <p className="text-sm font-medium">
                        {prerequisite.label}
                      </p>

                      {prerequisite.command && (
                        <code className="mt-2 block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
                          {prerequisite.command}
                        </code>
                      )}

                      {prerequisite.description && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {prerequisite.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function CmdPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CmdCategory | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...cmdData]
      .filter((cmd) => {
        if (
          selectedCategory !== "all" &&
          cmd.category !== selectedCategory
        ) {
          return false;
        }

        if (showFavorites && !cmd.favorite) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const searchableContent = [
          cmd.title,
          cmd.technology,
          cmd.command,
          cmd.description,
          cmd.details ?? "",
          ...(cmd.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableContent.includes(normalizedSearch);
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [search, selectedCategory, showFavorites]);

  const handleCopy = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);

      setCopiedCommand(command);

      window.setTimeout(() => {
        setCopiedCommand(null);
      }, 1800);
    } catch {
      console.error("Impossible de copier la commande.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setShowFavorites(false);
  };

  const hasFilters =
    search.trim().length > 0 ||
    selectedCategory !== "all" ||
    showFavorites;

  return (
    <main className="min-h-screen bg-muted/30">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm">
                <Command className="size-4" />
                Developer Command Center
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Commandes utiles
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Git, GitHub, npm, Next.js, Prisma, shadcn/ui,
                Better Auth et les bibliothèques utilisées dans ton
                environnement de développement.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background/80 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold">
                  {cmdData.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  commandes
                </div>
              </div>

              <div className="rounded-2xl border bg-background/80 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold">
                  {cmdCategories.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  catégories
                </div>
              </div>

              <div className="col-span-2 rounded-2xl border bg-background/80 p-4 text-center shadow-sm sm:col-span-1">
                <div className="text-2xl font-bold">
                  {cmdData.filter((cmd) => cmd.favorite).length}
                </div>
                <div className="text-xs text-muted-foreground">
                  favoris
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ===================================================
            RECHERCHE
        =================================================== */}

        <div className="sticky top-4 z-20 mb-8 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une commande, technologie, tag..."
                className="h-11 pl-10 pr-10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Effacer la recherche"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant={showFavorites ? "default" : "outline"}
              onClick={() => setShowFavorites((value) => !value)}
              className="gap-2"
            >
              <Star
                className={cn(
                  "size-4",
                  showFavorites && "fill-current",
                )}
              />
              Favoris
            </Button>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="size-4" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* ================================================
              CATÉGORIES
          ================================================= */}

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="size-4 shrink-0 text-muted-foreground" />

            <Button
              type="button"
              size="sm"
              variant={
                selectedCategory === "all"
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedCategory("all")}
              className="shrink-0"
            >
              Toutes
            </Button>

            {cmdCategories
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((category) => {
                const style =
                  categoryStyles[category.id] ??
                  categoryStyles.other;

                const Icon = style.icon;

                return (
                  <Button
                    key={category.id}
                    type="button"
                    size="sm"
                    variant={
                      selectedCategory === category.id
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setSelectedCategory(category.id)
                    }
                    className="shrink-0 gap-1.5"
                  >
                    <Icon className="size-3.5" />
                    {category.label}
                  </Button>
                );
              })}
          </div>
        </div>

        {/* ===================================================
            RESULTATS
        =================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {selectedCategory === "all"
                ? "Toutes les commandes"
                : cmdCategories.find(
                    (category) =>
                      category.id === selectedCategory,
                  )?.label}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {filteredCommands.length} résultat
              {filteredCommands.length > 1 ? "s" : ""}
            </p>
          </div>

          {hasFilters && (
            <Badge variant="secondary">
              Filtre actif
            </Badge>
          )}
        </div>

        {/* ===================================================
            LISTE
        ================================================= */}

        {filteredCommands.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCommands.map((cmd) => (
              <CommandCard
                key={cmd.id}
                cmd={cmd}
                copiedCommand={copiedCommand}
                onCopy={handleCopy}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-8 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>

            <h2 className="font-semibold">
              Aucune commande trouvée
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Essaie un autre terme de recherche ou
              réinitialise les filtres.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="mt-5"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

      </section>
    </main>
  );
}
