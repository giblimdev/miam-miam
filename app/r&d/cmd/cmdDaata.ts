
//@/app/r&d/cmd/CmdData.ts
/**
 *
 * Rôle :
 * Source de données des commandes utiles au développement.
 *
 * Cette structure est destinée à être consommée ultérieurement
 * par une page Next.js permettant :
 *
 * - d'afficher les commandes par catégorie ;
 * - rechercher une commande ;
 * - filtrer par technologie ;
 * - copier une commande ;
 * - afficher une description ;
 * - afficher les prérequis ;
 * - afficher des variantes ;
 * - afficher des avertissements ;
 * - afficher des exemples.
 *
 * IMPORTANT :
 * Ce fichier ne contient aucune logique React.
 * Il s'agit uniquement de données.
 */

export type CmdCategory =
  | "git"
  | "github"
  | "npm"
  | "nextjs"
  | "prisma"
  | "database"
  | "neon"
  | "better-auth"
  | "shadcn"
  | "tailwind"
  | "typescript"
  | "react"
  | "zustand"
  | "swr"
  | "forms"
  | "validation"
  | "ui"
  | "debug"
  | "build"
  | "other";

export type CmdDifficulty = "beginner" | "intermediate" | "advanced";

export type CmdPlatform = "windows" | "macos" | "linux" | "all";

export interface CmdVariant {
  label: string;
  command: string;
  description?: string;
}

export interface CmdExample {
  label: string;
  command: string;
  description?: string;
}

export interface CmdPrerequisite {
  label: string;
  command?: string;
  description?: string;
}

export interface CmdData {
  id: string;

  /**
   * Technologie principale.
   */
  category: CmdCategory;

  /**
   * Nom affiché.
   */
  title: string;

  /**
   * Nom court utilisé pour recherche/filtre.
   */
  technology: string;

  /**
   * Commande principale.
   */
  command: string;

  /**
   * Explication courte.
   */
  description: string;

  /**
   * Explication plus détaillée.
   */
  details?: string;

  /**
   * Difficulté.
   */
  difficulty?: CmdDifficulty;

  /**
   * Système concerné.
   */
  platform?: CmdPlatform;

  /**
   * Tags de recherche.
   */
  tags?: string[];

  /**
   * Commandes alternatives.
   */
  variants?: CmdVariant[];

  /**
   * Exemples.
   */
  examples?: CmdExample[];

  /**
   * Prérequis.
   */
  prerequisites?: CmdPrerequisite[];

  /**
   * Avertissement.
   */
  warning?: string;

  /**
   * Note importante.
   */
  note?: string;

  /**
   * Ordre d'affichage.
   */
  displayOrder: number;

  /**
   * Indique une commande fréquemment utilisée.
   */
  favorite?: boolean;
}

/* =========================================================
   GIT
   ========================================================= */

export const cmdData: CmdData[] = [
  {
    id: "git-init",
    category: "git",
    title: "Initialiser Git",
    technology: "Git",
    command: "git init",
    description: "Initialise un dépôt Git dans le dossier courant.",
    tags: ["init", "repository", "repo"],
    difficulty: "beginner",
    platform: "all",
    displayOrder: 10,
    favorite: true,
  },

  {
    id: "git-status",
    category: "git",
    title: "Voir l'état du dépôt",
    technology: "Git",
    command: "git status",
    description: "Affiche les fichiers modifiés, ajoutés ou non suivis.",
    tags: ["status", "changes"],
    difficulty: "beginner",
    platform: "all",
    displayOrder: 20,
    favorite: true,
  },

  {
    id: "git-add-all",
    category: "git",
    title: "Ajouter tous les fichiers",
    technology: "Git",
    command: "git add .",
    description: "Ajoute les modifications au staging.",
    tags: ["add", "stage"],
    displayOrder: 30,
    favorite: true,
  },

  {
    id: "git-add-file",
    category: "git",
    title: "Ajouter un fichier",
    technology: "Git",
    command: "git add chemin/vers/fichier.ts",
    description: "Ajoute un fichier précis au staging.",
    tags: ["add", "file"],
    displayOrder: 40,
  },

  {
    id: "git-commit",
    category: "git",
    title: "Créer un commit",
    technology: "Git",
    command: 'git commit -m "message du commit"',
    description: "Enregistre les modifications préparées dans Git.",
    tags: ["commit"],
    displayOrder: 50,
    favorite: true,
  },

  {
    id: "git-log",
    category: "git",
    title: "Afficher l'historique",
    technology: "Git",
    command: "git log --oneline --graph --decorate",
    description: "Affiche l'historique Git sous une forme compacte.",
    tags: ["log", "history"],
    displayOrder: 60,
  },

  {
    id: "git-diff",
    category: "git",
    title: "Voir les différences",
    technology: "Git",
    command: "git diff",
    description: "Affiche les modifications qui ne sont pas encore dans le staging.",
    tags: ["diff", "changes"],
    displayOrder: 70,
  },

  {
    id: "git-branch",
    category: "git",
    title: "Lister les branches",
    technology: "Git",
    command: "git branch",
    description: "Affiche les branches locales.",
    tags: ["branch"],
    displayOrder: 80,
  },

  {
    id: "git-branch-create",
    category: "git",
    title: "Créer une branche",
    technology: "Git",
    command: "git switch -c feature/ma-feature",
    description: "Crée une nouvelle branche et bascule dessus.",
    variants: [
      {
        label: "Ancienne syntaxe",
        command: "git checkout -b feature/ma-feature",
        description: "Ancienne syntaxe encore rencontrée dans de nombreux projets.",
      },
    ],
    tags: ["branch", "switch", "feature"],
    displayOrder: 90,
  },

  {
    id: "git-switch",
    category: "git",
    title: "Changer de branche",
    technology: "Git",
    command: "git switch main",
    description: "Bascule sur une branche existante.",
    tags: ["switch", "branch"],
    displayOrder: 100,
  },

  {
    id: "git-pull",
    category: "git",
    title: "Récupérer les modifications",
    technology: "Git",
    command: "git pull",
    description: "Récupère les modifications distantes et les intègre à la branche courante.",
    tags: ["pull", "remote"],
    displayOrder: 110,
    favorite: true,
  },

  {
    id: "git-push",
    category: "git",
    title: "Envoyer les modifications",
    technology: "Git",
    command: "git push",
    description: "Envoie les commits locaux vers le dépôt distant.",
    tags: ["push", "remote"],
    displayOrder: 120,
    favorite: true,
  },

  {
    id: "git-remote",
    category: "git",
    title: "Afficher les dépôts distants",
    technology: "Git",
    command: "git remote -v",
    description: "Affiche les URL des dépôts distants configurés.",
    tags: ["remote", "origin"],
    displayOrder: 130,
  },

  {
    id: "git-reset-last",
    category: "git",
    title: "Annuler le dernier commit",
    technology: "Git",
    command: "git reset --soft HEAD~1",
    description: "Supprime le dernier commit tout en conservant les modifications dans le staging.",
    warning:
      "À utiliser avec précaution si le commit a déjà été envoyé sur un dépôt distant.",
    tags: ["reset", "undo", "commit"],
    displayOrder: 140,
  },

  {
    id: "git-restore",
    category: "git",
    title: "Annuler les modifications d'un fichier",
    technology: "Git",
    command: "git restore chemin/vers/fichier.ts",
    description: "Restaure un fichier à son dernier état connu par Git.",
    warning: "Les modifications locales non sauvegardées seront perdues.",
    tags: ["restore", "undo"],
    displayOrder: 150,
  },

  /* =======================================================
     GITHUB
     ======================================================= */

  {
    id: "github-clone",
    category: "github",
    title: "Cloner un dépôt",
    technology: "GitHub",
    command: "git clone https://github.com/USER/REPO.git",
    description: "Télécharge un dépôt GitHub localement.",
    tags: ["clone", "repository"],
    displayOrder: 200,
    favorite: true,
  },

  {
    id: "github-create-repo",
    category: "github",
    title: "Créer un dépôt avec GitHub CLI",
    technology: "GitHub",
    command: "gh repo create",
    description: "Crée un nouveau dépôt GitHub avec GitHub CLI.",
    tags: ["gh", "repo", "create"],
    displayOrder: 210,
  },

  {
    id: "github-auth-login",
    category: "github",
    title: "Se connecter à GitHub CLI",
    technology: "GitHub",
    command: "gh auth login",
    description: "Authentifie GitHub CLI avec un compte GitHub.",
    tags: ["gh", "auth", "login"],
    displayOrder: 220,
  },

  {
    id: "github-repo-view",
    category: "github",
    title: "Afficher le dépôt",
    technology: "GitHub",
    command: "gh repo view",
    description: "Affiche les informations du dépôt GitHub courant.",
    tags: ["gh", "repo"],
    displayOrder: 230,
  },

  {
    id: "github-pr-create",
    category: "github",
    title: "Créer une Pull Request",
    technology: "GitHub",
    command: "gh pr create",
    description: "Crée une Pull Request depuis la branche courante.",
    tags: ["pull request", "pr"],
    displayOrder: 240,
  },

  {
    id: "github-pr-list",
    category: "github",
    title: "Lister les Pull Requests",
    technology: "GitHub",
    command: "gh pr list",
    description: "Liste les Pull Requests du dépôt.",
    tags: ["pull request", "pr"],
    displayOrder: 250,
  },

  {
    id: "github-issue-create",
    category: "github",
    title: "Créer une issue",
    technology: "GitHub",
    command: "gh issue create",
    description: "Crée une issue GitHub depuis le terminal.",
    tags: ["issue", "bug"],
    displayOrder: 260,
  },

  /* =======================================================
     NPM
     ======================================================= */

  {
    id: "npm-install",
    category: "npm",
    title: "Installer les dépendances",
    technology: "npm",
    command: "npm install",
    description: "Installe les dépendances définies dans package.json.",
    tags: ["install", "dependencies"],
    displayOrder: 300,
    favorite: true,
  },

  {
    id: "npm-install-package",
    category: "npm",
    title: "Installer une bibliothèque",
    technology: "npm",
    command: "npm install nom-du-package",
    description: "Installe une bibliothèque comme dépendance du projet.",
    tags: ["install", "package"],
    displayOrder: 310,
    favorite: true,
  },

  {
    id: "npm-install-dev",
    category: "npm",
    title: "Installer une dépendance de développement",
    technology: "npm",
    command: "npm install -D nom-du-package",
    description: "Installe un package dans les devDependencies.",
    tags: ["install", "dev", "devDependencies"],
    displayOrder: 320,
  },

  {
    id: "npm-uninstall",
    category: "npm",
    title: "Désinstaller une bibliothèque",
    technology: "npm",
    command: "npm uninstall nom-du-package",
    description: "Supprime une dépendance du projet.",
    tags: ["uninstall", "remove"],
    displayOrder: 330,
  },

  {
    id: "npm-update",
    category: "npm",
    title: "Mettre à jour les dépendances",
    technology: "npm",
    command: "npm update",
    description: "Met à jour les dépendances selon les contraintes de package.json.",
    tags: ["update", "dependencies"],
    displayOrder: 340,
  },

  {
    id: "npm-outdated",
    category: "npm",
    title: "Vérifier les packages obsolètes",
    technology: "npm",
    command: "npm outdated",
    description: "Liste les dépendances pour lesquelles une version plus récente existe.",
    tags: ["outdated", "dependencies"],
    displayOrder: 350,
  },

  {
    id: "npm-run-dev",
    category: "npm",
    title: "Démarrer Next.js en développement",
    technology: "npm",
    command: "npm run dev",
    description: "Démarre le serveur de développement Next.js.",
    tags: ["dev", "next"],
    displayOrder: 360,
    favorite: true,
  },

  {
    id: "npm-build",
    category: "npm",
    title: "Construire l'application",
    technology: "npm",
    command: "npm run build",
    description: "Lance le build de production.",
    tags: ["build", "production"],
    displayOrder: 370,
  },

  {
    id: "npm-start",
    category: "npm",
    title: "Démarrer en production",
    technology: "npm",
    command: "npm start",
    description: "Démarre l'application Next.js compilée.",
    tags: ["start", "production"],
    displayOrder: 380,
  },

  /* =======================================================
     NEXT.JS
     ======================================================= */

  {
    id: "next-create",
    category: "nextjs",
    title: "Créer une application Next.js",
    technology: "Next.js",
    command: "npx create-next-app@latest",
    description: "Crée une nouvelle application Next.js.",
    tags: ["create", "next", "app"],
    displayOrder: 400,
  },

  {
    id: "next-lint",
    category: "nextjs",
    title: "Lancer le lint",
    technology: "Next.js",
    command: "npm run lint",
    description: "Lance la commande de lint configurée dans le projet.",
    tags: ["lint", "eslint"],
    displayOrder: 410,
  },

  /* =======================================================
     PRISMA
     ======================================================= */

  {
    id: "prisma-generate",
    category: "prisma",
    title: "Générer Prisma Client",
    technology: "Prisma",
    command: "npx prisma generate",
    description: "Génère le Prisma Client à partir du schema.prisma.",
    tags: ["generate", "client"],
    displayOrder: 500,
    favorite: true,
  },

  {
    id: "prisma-format",
    category: "prisma",
    title: "Formater schema.prisma",
    technology: "Prisma",
    command: "npx prisma format",
    description: "Formate automatiquement le fichier schema.prisma.",
    tags: ["format", "schema"],
    displayOrder: 510,
    favorite: true,
  },

  {
    id: "prisma-validate",
    category: "prisma",
    title: "Valider le schéma Prisma",
    technology: "Prisma",
    command: "npx prisma validate",
    description: "Vérifie que le schema.prisma est valide.",
    tags: ["validate", "schema"],
    displayOrder: 520,
  },

  {
    id: "prisma-migrate-dev",
    category: "prisma",
    title: "Créer une migration",
    technology: "Prisma",
    command: "npx prisma migrate dev --name nom_de_la_migration",
    description: "Crée et applique une migration Prisma en développement.",
    tags: ["migration", "database"],
    displayOrder: 530,
    favorite: true,
  },

  {
    id: "prisma-migrate-status",
    category: "prisma",
    title: "Voir l'état des migrations",
    technology: "Prisma",
    command: "npx prisma migrate status",
    description: "Affiche l'état des migrations Prisma.",
    tags: ["migration", "status"],
    displayOrder: 540,
  },

  {
    id: "prisma-migrate-deploy",
    category: "prisma",
    title: "Appliquer les migrations",
    technology: "Prisma",
    command: "npx prisma migrate deploy",
    description: "Applique les migrations existantes dans un environnement de déploiement.",
    tags: ["migration", "deploy", "production"],
    displayOrder: 550,
  },

  {
    id: "prisma-studio",
    category: "prisma",
    title: "Ouvrir Prisma Studio",
    technology: "Prisma",
    command: "npx prisma studio",
    description: "Ouvre l'interface graphique de Prisma Studio.",
    tags: ["studio", "database", "gui"],
    displayOrder: 560,
    favorite: true,
  },

  {
    id: "prisma-db-pull",
    category: "prisma",
    title: "Importer le schéma depuis la base",
    technology: "Prisma",
    command: "npx prisma db pull",
    description: "Introspecte la base de données et met à jour schema.prisma.",
    tags: ["db", "pull", "introspection"],
    warning:
      "À utiliser avec précaution si schema.prisma contient des modifications non synchronisées.",
    displayOrder: 570,
  },

  {
    id: "prisma-db-push",
    category: "prisma",
    title: "Synchroniser le schéma sans migration",
    technology: "Prisma",
    command: "npx prisma db push",
    description: "Synchronise le schéma Prisma avec la base sans créer de migration.",
    tags: ["db", "push", "schema"],
    warning:
      "À privilégier pour certains prototypes. Pour une base de production, utilisez normalement les migrations.",
    displayOrder: 580,
  },

  {
    id: "prisma-reset",
    category: "prisma",
    title: "Réinitialiser la base",
    technology: "Prisma",
    command: "npx prisma migrate reset",
    description: "Réinitialise la base et rejoue les migrations.",
    warning:
      "DESTRUCTIF : les données de la base de développement peuvent être supprimées.",
    tags: ["reset", "database"],
    displayOrder: 590,
  },

  /* =======================================================
     DATABASE / NEON
     ======================================================= */

  {
    id: "neon-migrate",
    category: "neon",
    title: "Migration de projet Neon",
    technology: "Neon",
    command: "npx prisma migrate deploy",
    description:
      "Commande couramment utilisée après préparation d'un environnement Neon avec des migrations Prisma.",
    tags: ["neon", "prisma", "migration"],
    note:
      "La migration d'une région Neon elle-même se réalise depuis l'infrastructure Neon ; cette commande ne déplace pas un projet Neon.",
    displayOrder: 600,
  },

  /* =======================================================
     BETTER AUTH
     ======================================================= */

  {
    id: "better-auth-install",
    category: "better-auth",
    title: "Installer Better Auth",
    technology: "Better Auth",
    command: "npm install better-auth",
    description: "Installe Better Auth.",
    tags: ["auth", "authentication"],
    displayOrder: 700,
  },

  {
    id: "better-auth-prisma-adapter",
    category: "better-auth",
    title: "Installer l'adaptateur Prisma",
    technology: "Better Auth",
    command: "npm install @better-auth/prisma-adapter",
    description: "Installe l'adaptateur Prisma pour Better Auth.",
    tags: ["auth", "prisma", "adapter"],
    displayOrder: 710,
  },

  /* =======================================================
     SHADCN
     ======================================================= */

  {
    id: "shadcn-init",
    category: "shadcn",
    title: "Initialiser shadcn/ui",
    technology: "shadcn/ui",
    command: "npx shadcn@latest init",
    description: "Initialise shadcn/ui dans le projet.",
    tags: ["shadcn", "init", "ui"],
    displayOrder: 800,
    favorite: true,
  },

  {
    id: "shadcn-add-button",
    category: "shadcn",
    title: "Ajouter Button",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add button",
    description: "Ajoute le composant Button au projet.",
    tags: ["button", "component"],
    displayOrder: 810,
  },

  {
    id: "shadcn-add-dialog",
    category: "shadcn",
    title: "Ajouter Dialog",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add dialog",
    description: "Ajoute le composant Dialog.",
    tags: ["dialog", "modal"],
    displayOrder: 820,
  },

  {
    id: "shadcn-add-form",
    category: "shadcn",
    title: "Ajouter Form",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add form",
    description: "Ajoute le composant Form.",
    tags: ["form"],
    displayOrder: 830,
  },

  {
    id: "shadcn-add-input",
    category: "shadcn",
    title: "Ajouter Input",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add input",
    description: "Ajoute le composant Input.",
    tags: ["input", "form"],
    displayOrder: 840,
  },

  {
    id: "shadcn-add-select",
    category: "shadcn",
    title: "Ajouter Select",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add select",
    description: "Ajoute le composant Select.",
    tags: ["select", "form"],
    displayOrder: 850,
  },

  {
    id: "shadcn-add-checkbox",
    category: "shadcn",
    title: "Ajouter Checkbox",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add checkbox",
    description: "Ajoute le composant Checkbox.",
    tags: ["checkbox", "form"],
    displayOrder: 860,
  },

  {
    id: "shadcn-add-switch",
    category: "shadcn",
    title: "Ajouter Switch",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add switch",
    description: "Ajoute le composant Switch.",
    tags: ["switch", "boolean"],
    displayOrder: 870,
  },

  {
    id: "shadcn-add-table",
    category: "shadcn",
    title: "Ajouter Table",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add table",
    description: "Ajoute le composant Table.",
    tags: ["table", "data"],
    displayOrder: 880,
    favorite: true,
  },

  {
    id: "shadcn-add-card",
    category: "shadcn",
    title: "Ajouter Card",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add card",
    description: "Ajoute le composant Card.",
    tags: ["card", "layout"],
    displayOrder: 890,
  },

  {
    id: "shadcn-add-dropdown-menu",
    category: "shadcn",
    title: "Ajouter Dropdown Menu",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add dropdown-menu",
    description: "Ajoute un menu déroulant.",
    tags: ["dropdown", "menu"],
    displayOrder: 900,
  },

  {
    id: "shadcn-add-tooltip",
    category: "shadcn",
    title: "Ajouter Tooltip",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add tooltip",
    description: "Ajoute le composant Tooltip.",
    tags: ["tooltip"],
    displayOrder: 910,
  },

  {
    id: "shadcn-add-toast",
    category: "shadcn",
    title: "Ajouter Toast",
    technology: "shadcn/ui",
    command: "npx shadcn@latest add sonner",
    description: "Ajoute Sonner pour les notifications toast.",
    tags: ["toast", "notification", "sonner"],
    displayOrder: 920,
  },

  /* =======================================================
     TAILWIND
     ======================================================= */

  {
    id: "tailwind-install",
    category: "tailwind",
    title: "Installer Tailwind CSS",
    technology: "Tailwind CSS",
    command: "npm install tailwindcss @tailwindcss/postcss",
    description: "Installe Tailwind CSS.",
    tags: ["tailwind", "css"],
    displayOrder: 1000,
  },

  /* =======================================================
     TYPESCRIPT
     ======================================================= */

  {
    id: "typescript-install",
    category: "typescript",
    title: "Installer TypeScript",
    technology: "TypeScript",
    command: "npm install -D typescript @types/node @types/react @types/react-dom",
    description: "Installe TypeScript et les types courants pour un projet React/Next.js.",
    tags: ["typescript", "types"],
    displayOrder: 1100,
  },

  /* =======================================================
     REACT
     ======================================================= */

  {
    id: "react-hook-form",
    category: "forms",
    title: "Installer React Hook Form",
    technology: "React Hook Form",
    command: "npm install react-hook-form",
    description: "Installe React Hook Form.",
    tags: ["form", "react", "hook"],
    displayOrder: 1200,
    favorite: true,
  },

  {
    id: "zod-install",
    category: "validation",
    title: "Installer Zod",
    technology: "Zod",
    command: "npm install zod",
    description: "Installe Zod pour la validation et la définition de schémas.",
    tags: ["validation", "schema"],
    displayOrder: 1210,
    favorite: true,
  },

  {
    id: "hook-form-resolvers",
    category: "validation",
    title: "Installer les resolvers React Hook Form",
    technology: "React Hook Form",
    command: "npm install @hookform/resolvers",
    description:
      "Permet notamment d'utiliser Zod avec React Hook Form.",
    tags: ["form", "zod", "resolver"],
    displayOrder: 1220,
  },

  /* =======================================================
     ZUSTAND
     ======================================================= */

  {
    id: "zustand-install",
    category: "zustand",
    title: "Installer Zustand",
    technology: "Zustand",
    command: "npm install zustand",
    description: "Installe Zustand pour la gestion d'état.",
    tags: ["state", "store"],
    displayOrder: 1300,
  },

  /* =======================================================
     SWR
     ======================================================= */

  {
    id: "swr-install",
    category: "swr",
    title: "Installer SWR",
    technology: "SWR",
    command: "npm install swr",
    description: "Installe SWR pour la récupération et la mise en cache des données.",
    tags: ["fetch", "cache", "data"],
    displayOrder: 1400,
  },

  /* =======================================================
     UI
     ======================================================= */

  {
    id: "lucide-install",
    category: "ui",
    title: "Installer Lucide React",
    technology: "Lucide",
    command: "npm install lucide-react",
    description: "Installe les icônes Lucide pour React.",
    tags: ["icons", "ui"],
    displayOrder: 1500,
    favorite: true,
  },

  {
    id: "sonner-install",
    category: "ui",
    title: "Installer Sonner",
    technology: "Sonner",
    command: "npm install sonner",
    description: "Installe Sonner pour afficher des notifications.",
    tags: ["toast", "notification"],
    displayOrder: 1510,
  },

  {
    id: "framer-motion-install",
    category: "ui",
    title: "Installer Motion",
    technology: "Motion",
    command: "npm install motion",
    description: "Installe Motion pour les animations React.",
    tags: ["animation", "motion"],
    displayOrder: 1520,
  },

  /* =======================================================
     DEBUG / BUILD
     ======================================================= */

  {
    id: "npm-cache-clean",
    category: "debug",
    title: "Nettoyer le cache npm",
    technology: "npm",
    command: "npm cache clean --force",
    description: "Nettoie le cache npm.",
    warning:
      "À utiliser uniquement lorsque le cache npm pose réellement problème.",
    tags: ["cache", "debug", "npm"],
    displayOrder: 1600,
  },

  {
    id: "remove-node-modules-windows",
    category: "debug",
    title: "Supprimer node_modules sous Windows",
    technology: "Windows",
    command: "Remove-Item -Recurse -Force node_modules",
    description: "Supprime le dossier node_modules avec PowerShell.",
    platform: "windows",
    tags: ["node_modules", "windows", "powershell"],
    displayOrder: 1610,
  },

  {
    id: "remove-next-cache-windows",
    category: "debug",
    title: "Supprimer le cache Next.js sous Windows",
    technology: "Next.js",
    command: "Remove-Item -Recurse -Force .next",
    description: "Supprime le dossier .next.",
    platform: "windows",
    tags: ["next", "cache", ".next"],
    displayOrder: 1620,
  },

  {
    id: "npm-reinstall-windows",
    category: "debug",
    title: "Réinstaller les dépendances sous Windows",
    technology: "npm",
    command:
      "Remove-Item -Recurse -Force node_modules; Remove-Item -Force package-lock.json; npm install",
    description:
      "Supprime node_modules et package-lock.json puis réinstalle les dépendances.",
    platform: "windows",
    warning:
      "La suppression de package-lock.json peut modifier les versions résolues. Ne pas utiliser systématiquement.",
    tags: ["reinstall", "node_modules", "windows"],
    displayOrder: 1630,
  },

  {
    id: "npm-audit",
    category: "debug",
    title: "Analyser les vulnérabilités npm",
    technology: "npm",
    command: "npm audit",
    description: "Analyse les dépendances à la recherche de vulnérabilités connues.",
    tags: ["security", "audit"],
    displayOrder: 1640,
  },

  {
    id: "npm-audit-fix",
    category: "debug",
    title: "Corriger les vulnérabilités npm",
    technology: "npm",
    command: "npm audit fix",
    description: "Tente de corriger automatiquement certaines vulnérabilités.",
    warning:
      "Toujours vérifier les changements de versions après un audit fix.",
    tags: ["security", "audit", "fix"],
    displayOrder: 1650,
  },
];

/* =========================================================
   CATÉGORIES
   ========================================================= */

export interface CmdCategoryData {
  id: CmdCategory;
  label: string;
  description: string;
  displayOrder: number;
}

export const cmdCategories: CmdCategoryData[] = [
  {
    id: "git",
    label: "Git",
    description: "Commandes Git pour gérer les versions et branches.",
    displayOrder: 10,
  },
  {
    id: "github",
    label: "GitHub",
    description: "GitHub CLI, dépôts, issues et Pull Requests.",
    displayOrder: 20,
  },
  {
    id: "npm",
    label: "npm",
    description: "Installation et gestion des dépendances.",
    displayOrder: 30,
  },
  {
    id: "nextjs",
    label: "Next.js",
    description: "Commandes utiles pour les projets Next.js.",
    displayOrder: 40,
  },
  {
    id: "prisma",
    label: "Prisma",
    description: "Client, migrations, schéma et base de données.",
    displayOrder: 50,
  },
  {
    id: "database",
    label: "Database",
    description: "Commandes liées aux bases de données.",
    displayOrder: 60,
  },
  {
    id: "neon",
    label: "Neon",
    description: "Commandes et opérations liées à Neon.",
    displayOrder: 70,
  },
  {
    id: "better-auth",
    label: "Better Auth",
    description: "Installation et configuration de l'authentification.",
    displayOrder: 80,
  },
  {
    id: "shadcn",
    label: "shadcn/ui",
    description: "Installation des composants shadcn/ui.",
    displayOrder: 90,
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    description: "Installation et gestion de Tailwind CSS.",
    displayOrder: 100,
  },
  {
    id: "typescript",
    label: "TypeScript",
    description: "Outils TypeScript.",
    displayOrder: 110,
  },
  {
    id: "react",
    label: "React",
    description: "Bibliothèques et outils React.",
    displayOrder: 120,
  },
  {
    id: "forms",
    label: "Formulaires",
    description: "React Hook Form et outils associés.",
    displayOrder: 130,
  },
  {
    id: "validation",
    label: "Validation",
    description: "Validation des données avec Zod.",
    displayOrder: 140,
  },
  {
    id: "zustand",
    label: "Zustand",
    description: "Gestion d'état avec Zustand.",
    displayOrder: 150,
  },
  {
    id: "swr",
    label: "SWR",
    description: "Récupération et cache des données.",
    displayOrder: 160,
  },
  {
    id: "ui",
    label: "UI",
    description: "Icônes, animations et notifications.",
    displayOrder: 170,
  },
  {
    id: "debug",
    label: "Debug",
    description: "Commandes utiles pour diagnostiquer les problèmes.",
    displayOrder: 180,
  },
  {
    id: "build",
    label: "Build",
    description: "Commandes liées au build et au déploiement.",
    displayOrder: 190,
  },
];

/* =========================================================
   GROUPES DE COMMANDES FRÉQUENTES
   ========================================================= */

export const cmdGroups = {
  gitWorkflow: [
    "git-status",
    "git-add-all",
    "git-commit",
    "git-pull",
    "git-push",
  ],

  prismaWorkflow: [
    "prisma-format",
    "prisma-validate",
    "prisma-generate",
    "prisma-migrate-dev",
    "prisma-migrate-status",
    "prisma-studio",
  ],

  shadcnForms: [
    "shadcn-add-form",
    "shadcn-add-input",
    "shadcn-add-select",
    "shadcn-add-checkbox",
    "shadcn-add-switch",
  ],

  shadcnCrud: [
    "shadcn-add-button",
    "shadcn-add-dialog",
    "shadcn-add-table",
    "shadcn-add-dropdown-menu",
    "shadcn-add-tooltip",
  ],

  npmCommon: [
    "npm-install",
    "npm-install-package",
    "npm-install-dev",
    "npm-uninstall",
    "npm-update",
    "npm-outdated",
  ],

  development: [
    "npm-run-dev",
    "npm-build",
    "npm-start",
    "npm-audit",
  ],
};

/* =========================================================
   HELPERS
   ========================================================= */

export const getCmdById = (id: string): CmdData | undefined =>
  cmdData.find((cmd) => cmd.id === id);

export const getCmdsByCategory = (
  category: CmdCategory,
): CmdData[] =>
  cmdData
    .filter((cmd) => cmd.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);

export const getFavoriteCmds = (): CmdData[] =>
  cmdData
    .filter((cmd) => cmd.favorite)
    .sort((a, b) => a.displayOrder - b.displayOrder);

export const searchCmds = (query: string): CmdData[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return cmdData;
  }

  return cmdData
    .filter((cmd) => {
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

      return searchableContent.includes(normalizedQuery);
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
};
