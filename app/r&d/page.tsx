//@/app/r&d/page.tsx
/* *
 * Rôle :
 * Page d'accueil de la section R&D.
 *
 * Responsabilités :
 * - Présenter les différentes ressources internes du projet.
 * - Permettre un accès rapide aux sous-sections.
 * - Fournir une identité visuelle différenciée pour chaque ressource.
 *
 * Route :
 * /r&d
 *
 * Sous-sections :
 * /r&d/prompt
 * /r&d/design
 * /r&d/stack
 * /r&d/scrum
 * /r&d/schema
 * /r&d/cmd
 * /r&d/senarie
 */

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Palette,
  Terminal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

/* ============================================================
   TYPES
   ============================================================ */

interface SubSection {
  title: string;
  description: string;
  url: string;
  badge: string;
  icon: React.ElementType;
  iconClass: string;
  badgeClass: string;
  gradientClass: string;
}

/* ============================================================
   DONNÉES DES SECTIONS
   ============================================================ */

const sections: SubSection[] = [
  {
    title: "Prompt",
    description:
      "Collection de prompts utilisés pour accélérer le développement, générer du code, analyser les problèmes et travailler avec l'IA.",
    url: "/r&d/prompt",
    badge: "IA & Copilot",
    icon: Bot,
    iconClass:
      "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
    badgeClass:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300",
    gradientClass:
      "from-purple-500/10 via-pink-500/5 to-transparent",
  },

  {
    title: "Design UX",
    description:
      "Charte graphique, composants, icônes, couleurs, typographie et règles de conception pour maintenir une interface cohérente.",
    url: "/r&d/design",
    badge: "UI / UX",
    icon: Palette,
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    gradientClass:
      "from-emerald-500/10 via-cyan-500/5 to-transparent",
  },

  {
    title: "Stack",
    description:
      "Bibliothèques, frameworks, dépendances et outils utilisés dans le projet avec leur rôle et leur version.",
    url: "/r&d/stack",
    badge: "Technique",
    icon: Code2,
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
    badgeClass:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
    gradientClass:
      "from-orange-500/10 via-red-500/5 to-transparent",
  },

  {
    title: "Scrum",
    description:
      "Personas, user stories, backlog, sprints et documentation agile pour organiser le développement itératif.",
    url: "/r&d/scrum",
    badge: "Agile",
    icon: GitBranch,
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    gradientClass:
      "from-blue-500/10 via-indigo-500/5 to-transparent",
  },

  {
    title: "Schema",
    description:
      "Documentation du modèle de données, relations Prisma, entités métier et architecture de la base de données.",
    url: "/r&d/schema",
    badge: "Data",
    icon: Database,
    iconClass:
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-300",
    gradientClass:
      "from-cyan-500/10 via-blue-500/5 to-transparent",
  },

  {
    title: "CMD",
    description:
      "Commandes fréquemment utilisées pour Next.js, GitHub, Prisma, npm, shadcn/ui et les outils du projet.",
    url: "/r&d/cmd",
    badge: "CLI",
    icon: Terminal,
    iconClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    badgeClass:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    gradientClass:
      "from-slate-500/10 via-gray-500/5 to-transparent",
  },

  {
    title: "Scénarios",
    description:
      "Scénarios fonctionnels, parcours utilisateurs et cas d'utilisation permettant de valider les comportements de l'application.",
    url: "/r&d/senarie",
    badge: "Fonctionnel",
    icon: FileCode2,
    iconClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
    badgeClass:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950/50 dark:text-pink-300",
    gradientClass:
      "from-pink-500/10 via-rose-500/5 to-transparent",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function RdHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-gray-950 dark:via-gray-950 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
            ===================================================== */}

        <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-10 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 sm:px-10 sm:py-12">
          {/* Décorations */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            {/* Badge */}

            <Badge
              variant="outline"
              className="mb-5 border-purple-200 bg-purple-50 px-3 py-1 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
            >
              <Code2 className="mr-1.5 h-3.5 w-3.5" />
              Espace développeur
            </Badge>

            {/* Titre */}

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Espace{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                R&D
              </span>
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Centralisez les ressources nécessaires au
              développement de l'application : IA, design,
              stack technique, données, commandes et
              documentation agile.
            </p>

            {/* Statistiques */}

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  {sections.length}
                </span>{" "}
                <span className="text-slate-500">
                  ressources
                </span>
              </div>

              <div className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  Documentation
                </span>{" "}
                <span className="text-slate-500">
                  interne
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            GRILLE
            ===================================================== */}

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Ressources du projet
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sélectionnez une ressource pour accéder à sa
              documentation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Card
                  key={section.url}
                  className="group relative overflow-hidden border-slate-200/70 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
                >
                  {/* Halo au survol */}

                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${section.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-3">
                      {/* Icône */}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${section.iconClass} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Badge */}

                      <Badge
                        variant="outline"
                        className={section.badgeClass}
                      >
                        {section.badge}
                      </Badge>
                    </div>

                    <CardTitle className="relative mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {section.title}
                    </CardTitle>

                    <CardDescription className="relative min-h-[84px] text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {section.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative pt-0">
                    {/*
                     * IMPORTANT :
                     *
                     * asChild permet à Button de rendre directement
                     * le composant Link.
                     *
                     * Le résultat HTML est donc un <a> stylé comme
                     * un bouton, au lieu d'avoir un <a> dans un <button>.
                     */}

<Link href={section.url} className="group/button inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-900 shadow-xs transition-all outline-none hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-600" > <span> Explorer </span> <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" /> </Link>                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-600">
            Documentation interne réservée à l'équipe de
            développement.
          </p>
        </footer>
      </div>
    </main>
  );
}
