/*
  role : Source centrale de données définissant les personas métiers de l'application.
  import: Aucun (fichier de données pure).
  useBy : Composants de sélection de rôle, simulateurs de parcours, tests E2E, documentation R&D.
*/

/*
  ARCHITECTURE & FLUX DE DONNÉES :
  - Modèle Persona : Définit la structure d'un rôle utilisateur dans le système (id unique, nom technique, libellé d'affichage).
  - Collection personas : Export constant utilisé à travers toute l'application pour garantir la cohérence des droits et parcours métiers.
  - Typage fort : Impose la présence systématique des champs nécessaires pour éviter les régressions d'affichage ou d'authentification.
*/

export interface Persona {
  id: string;
  name: string;
  label: string;
  description: string;
}

export const personas: Persona[] = [
  {
    id: "final-client",
    name: "FinalClient",
    label: "Client final",
    description: "Utilisateur final qui passe et suit ses commandes.",
  },
  {
    id: "driver",
    name: "Driver",
    label: "Livreur",
    description: "Livreur en charge de la livraison des commandes.",
  },
  {
    id: "site-manager",
    name: "SiteManager",
    label: "Responsable de site",
    description: "Gestionnaire opérationnel d'un ou plusieurs points de vente.",
  },
  {
    id: "brand-manager",
    name: "BrandManager",
    label: "Gestionnaire de marque",
    description: "Responsable de la stratégie et des performances d'une marque.",
  },
  {
    id: "food-preparer",
    name: "FoodPreparer",
    label: "Préparateur",
    description: "Personnel en cuisine qui prépare les commandes.",
  },
  {
    id: "super-admin",
    name: "SuperAdmin",
    label: "Administrateur plateforme",
    description: "Administrateur ayant tous les droits sur la plateforme.",
  },
  {
    id: "client-support",
    name: "ClientSupport",
    label: "Support client",
    description: "Agent en charge du support et de la relation client.",
  },
  {
    id: "b2b-manager",
    name: "B2BManager",
    label: "B2B Manager",
    description: "Gestionnaire des comptes et partenariats B2B.",
  },
  {
    id: "community-manager",
    name: "CommunityManager",
    label: "Community Manager",
    description: "Responsable de la communication et de la communauté.",
  },
];