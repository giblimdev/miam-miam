//@ /app/r&d/prompt/promptData.ts
/*role : Définition des types et données pour les prompts de la bibliothèque.
   import : Aucun (fichier de données pure).
   useBy : Page /prompt, composants de recherche/filtrage.
*/

// Structure d'un prompt
export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: "système" | "création" | "analyse" | "formatage" | "rédaction" | "tests" | "développement";
  content: string;
  tags: string[];
}

// Collection de prompts (incluant les prompts dev)
export const prompts: Prompt[] = [
  // === SYSTÈME ===

  // === CRÉATION ===
  {
    id: "crea-1",
    title: "Description de produit",
    description: "Prompt pour rédiger une fiche produit alléchante",
    category: "création",
    content: `Rédige une description alléchante pour ce produit : {nomProduit}.
Mets en avant ses caractéristiques principales, son goût, sa texture, son origine ou son processus de fabrication.
Utilise un ton engageant et descriptif. La description doit faire envie et donner envie de goûter.
Longueur : environ 100 mots.`,
    tags: ["produit", "description", "marketing"],
  },

  // === ANALYSE ===

  // === FORMATAGE ===
  {
    id: "for-1",
    title: "Traduction culinaire",
    description: "Prompt pour traduire une recette en plusieurs langues",
    category: "formatage",
    content: `Traduis cette recette en {langueCible} :
{recette}
Conserve :
- Les quantités exactes
- Les temps de cuisson
- Les termes techniques adaptés
- Le style et le ton de l'original
Ajoute une note sur les équivalences d'ingrédients si nécessaire.`,
    tags: ["traduction", "recette", "international"],
  },

  // === RÉDACTION ===
  {
    id: "red-1",
    title: "Email marketing",
    description: "Prompt pour rédiger un email promotionnel",
    category: "rédaction",
    content: `Rédige un email marketing pour une nouvelle offre de livraison de repas.
Objectif : inciter les clients à passer commande pour la première fois.
Ton : chaleureux et engageant.
Structure :
1. Objet accrocheur
2. Introduction personnalisée
3. Présentation de l'offre (réduction de 20% sur la première commande)
4. Appel à l'action clair (bouton "Commander maintenant")
5. Signature avec l'équipe
Longueur : environ 150 mots.`,
    tags: ["email", "marketing", "promotion"],
  },

  // === TESTS ===
  {
    id: "test-1",
    title: "Génération de tests",
    description: "Prompt pour générer des scénarios de tests",
    category: "tests",
    content: `Génère des scénarios de tests pour une application de livraison de repas.
Couvre les cas suivants :
1. Test de création de compte
2. Test de recherche de restaurant
3. Test de passage de commande
4. Test d'annulation de commande
5. Test de suivi de livraison
Pour chaque scénario, décris :
- Les prérequis
- Les étapes à suivre
- Les résultats attendus
- Les cas d'erreur possibles`,
    tags: ["tests", "qa", "scénario"],
  },

  // === DÉVELOPPEMENT ===
{
  id: "dev-1",
  title: "Génération de script structuré",
  description: "Prompt pour créer un fichier avec les commentaires de structure (path, role, import, useBy)",
  category: "développement",
  content: `
Tu es un expert développeur TypeScript / Full-Stack spécialisé dans les applications web modernes avec Next.js 16 (App Router), Tailwind CSS et shadcn/ui. Ta mission est de rédiger du code robuste, maintenable, visuellement attrayant et strictement typé.

1. Contexte Applicatif
- Framework : Next.js 16 (App Router, React Server Components & Server Actions par défaut).
- Design System & Style :
  - Composants UI : shadcn/ui & icônes lucide-react.
  - Style : Design moderne, coloré, fluide et professionnel (dégradés subtils, ombres douces, micro-interactions avec framer-motion, contrastes accessibles WCAG AAA, typographie Inter/Geist/Plus Jakarta Sans via Tailwind CSS).
  - Responsive & UX : Mobile-first strict, états visuels interactifs (hover, focus, disabled, active).

2. Structure de l'En-tête de Fichier (Obligatoire)
Chaque fichier généré DOIT impérativement commencer par ce bloc de commentaires standardisé :

//@ [chemin/du/fichier/nomDuFichier.tsx]
/*
 role : [Description claire des responsabilités principales de ce script/composant/page]
 import: [Liste des bibliothèques externes, hooks, composants shadcn/ui, types ou services]
 useBy : [Liste des pages, composants, layouts ou API routes qui consomment/appellent ce fichier]
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections : [Explication détaillée des blocs clés du fichier]
 - Choix techniques : [Server Component vs Client Component, hooks, Server Actions, Zustand, etc.]
 - Flux de données : [Types de props, état local/global, gestion API/mutations]
 - Interactions UX : [Comportements dynamiques, animations framer-motion, gestion d'erreurs]
*/
/*IMPERATIF : 
architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers
*/
3. Exigences Techniques & Qualité du Code
- Typage Fort TypeScript :
  - Interdiction stricte du type 'any' ou de 'React.FC'. Privilégier les fonctions standard typées par leurs props.
  - Référencer le schéma du projet (\`schema.ts\`) si fourni. Sinon, définir explicitement toutes les interfaces/types TypeScript nécessaires en début de fichier.
- Exhaustivité du Code :
  - Fournir TOUJOURS le fichier intégral sans omission, masquage ou raccourcis (\`// TODO\`, \`// ... reste du code\`).
- Architecture Next.js 16 :
  - Identifier explicitement l'environnement ('use client' uniquement si nécessaire pour l'interactivité ou les hooks React).
  - Intégrer la gestion élégante des états de chargement (skeletons shadcn), d'erreur et de données vides (empty state).
- Documentation JSDoc :
  - Documenter les props complexes et les fonctions métier clés avec des annotations JSDoc claires.

4. Attendu
- Un fichier de code complet, typé, stylisé et prêt pour la production.
`,
  tags: ["dev", "script", "structure", "typescript"],
},
];