//@/app/scrum/scrumData.ts
/*role : Données des Personas et User Stories pour le projet Scrum
   import : aucun (fichier de données brut)
   useBy : 
   app/scrum/Persona.tsx
   app/scrum/UserStory.tsx

*/

// === TYPES ===
export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string; // emoji ou initiale
  age: number;
  profile: string;
  goals: string[];
  frustrations: string[];
}

export interface UserStory {
  id: string;
  personaId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

// === PERSONAS ===

export const personas: Persona[] = [
  {
    id: 'client-final',
    name: 'Thomas',
    role: 'Client Final',
    avatar: '👨‍💼',
    age: 28,
    profile: 'Cadre dynamique, utilise l\'application principalement sur mobile le soir ou le midi au bureau.',
    goals: [
      'Commander à manger rapidement',
      'Suivre sa livraison en temps réel',
      'Bénéficier d\'offres promotionnelles',
    ],
    frustrations: [
      'Retards non expliqués',
      'Erreurs dans la commande',
      'Nourriture arrivée froide',
    ],
  },
  {
    id: 'livreur',
    name: 'Karim',
    role: 'Livreur',
    avatar: '🛵',
    age: 24,
    profile: 'Étudiant/indépendant, se déplace à vélo ou scooter.',
    goals: [
      'Optimiser son temps pour maximiser ses gains',
      'Voir clairement ses trajets et pourboires',
    ],
    frustrations: [
      'Temps d\'attente trop long au restaurant',
      'Adresses de livraison imprécises',
      'Support réactif manquant en cas d\'imprévu',
    ],
  },
  {
    id: 'site-admin',
    name: 'Maria',
    role: 'Responsable de Site / Restauration',
    avatar: '👩‍🍳',
    age: 42,
    profile: 'Gère un restaurant de burgers partenaires et sa cuisine fantôme (Dark Kitchen).',
    goals: [
      'Recevoir les commandes de manière fluide',
      'Mettre à jour rapidement les stocks d\'ingrédients épuisés',
    ],
    frustrations: [
      'Rush de commandes incontrôlable',
      'Livreurs qui arrivent trop tôt ou trop tard',
    ],
  },
  {
    id: 'brand-admin',
    name: 'Alex',
    role: 'Gestionnaire de Marque',
    avatar: '👔',
    age: 35,
    profile: 'Gère la stratégie marketing et les menus de 10 établissements de la même enseigne.',
    goals: [
      'Uniformiser la carte sur tous les sites',
      'Analyser les ventes globales',
      'Lancer des promotions à grande échelle',
    ],
    frustrations: [
      'Manque de données consolidées sur les performances des différents établissements',
    ],
  },
  {
    id: 'preparateur',
    name: 'Pablo',
    role: 'Préparateur / Cuisinier',
    avatar: '🔪',
    age: 26,
    profile: 'Employé en restauration rapide, dark kitchen ou supermarché (dark store).',
    goals: [
      'Voir les commandes à préparer par ordre de priorité',
      'Valider les étapes de préparation rapidement sans toucher un écran complexe avec des mains sales ou occupées',
    ],
    frustrations: [
      'Erreurs dans les tickets d\'impression',
      'Manque de clarté sur les options/modifications demandées par le client',
      'Retards qui s\'accumulent au comptoir',
    ],
  },
  {
    id: 'super-admin',
    name: 'Sophie',
    role: 'Administrateur Plateforme',
    avatar: '🛡️',
    age: 31,
    profile: 'Veille au bon fonctionnement global de l\'application.',
    goals: [
      'Garantir la disponibilité du service',
      'Gérer les litiges complexes',
      'Modérer les marques et utilisateurs',
    ],
    frustrations: [
      'Fraudes sur les paiements ou les réductions',
      'Dysfonctionnements du système de matching livreur-commande',
    ],
  },
  {
    id: 'customer-care',
    name: 'Laura',
    role: 'Support Client',
    avatar: '💬',
    age: 29,
    profile: 'Agent de support polyglotte.',
    goals: [
      'Répondre rapidement aux réclamations des clients',
      'Gérer les problèmes des livreurs',
    ],
    frustrations: [
      'Ne pas avoir une vue unifiée de la commande (tracking, messages entre client-livreur, photo de la livraison)',
      'Devoir jongler entre 5 outils différents',
    ],
  },
  {
    id: 'b2b-manager',
    name: 'Claire',
    role: 'B2B Manager / Financier',
    avatar: '💰',
    age: 38,
    profile: 'Chef comptable ou responsable financier dans une chaîne de restauration.',
    goals: [
      'Recevoir des relevés financiers clairs et détaillés',
      'Pouvoir exporter les données vers son logiciel de comptabilité',
      'Voir le détail des paiements par transaction',
    ],
    frustrations: [
      'Relevés de commission incompréhensibles avec des lignes de frais cachées',
      'Délais de paiement trop longs ou manque de transparence sur les virements',
      'Impossibilité d\'identifier facilement les commandes annulées/remboursées',
    ],
  },
  {
    id: 'community-manager',
    name: 'Julie',
    role: 'Community Manager',
    avatar: '📱',
    age: 27,
    profile: 'Responsable Réseaux Sociaux & Contenu.',
    goals: [
      'Gérer la réputation en ligne',
      'Créer du contenu engageant',
      'Animer la communauté',
      'Analyser les tendances',
    ],
    frustrations: [
      'Pas d\'outils intégrés pour partager facilement le contenu AppFood',
      'Les clients ne partagent pas assez leurs expériences',
      'Difficulté à suivre le retour sur investissement des campagnes sociales',
      'Manque de contenu utilisateur généré (UGC) à partager',
    ],
  },
];

// === USER STORIES ===

export const userStories: UserStory[] = [
  // === CLIENT FINAL (A) ===
  {
    id: 'US-A1',
    personaId: 'client-final',
    title: 'Recherche et Exploration',
    description:
      'En tant que Client Final, je veux filtrer les restaurants par type de cuisine (ex: Burger, Vegan, Sushi) ou par secteur (ex: Épicerie, Alcool, Restaurant) et trier les résultats par temps de livraison estimé, note moyenne ou prix, afin de trouver rapidement et facilement l\'option qui correspond à mes envies et contraintes du moment.',
    acceptanceCriteria: [
      'Filtrage par type de cuisine avec affichage des icônes correspondantes',
      'Filtrage par secteur avec sélection multi-critères',
      'Tri par : temps de livraison (le plus rapide), note (étoiles), prix (croissant/décroissant)',
      'Affichage du temps de livraison estimé pour chaque établissement',
      'Affichage de la note moyenne et du nombre d\'avis',
    ],
  },
  {
    id: 'US-A2',
    personaId: 'client-final',
    title: 'Personnalisation Avancée des Produits',
    description:
      'En tant que Client Final, je veux choisir des options complexes pour mon produit (taille, ingrédients, sauces, suppléments) avec des contraintes claires (ex: choix obligatoire d\'un accompagnement, sélection minimum/maximum d\'options), afin de personnaliser parfaitement mon plat selon mes goûts, régimes alimentaires ou allergies.',
    acceptanceCriteria: [
      'Affichage des groupes d\'options avec titres explicites',
      'Indication claire des contraintes (obligatoire/optionnel, min/max sélection)',
      'Mise à jour dynamique du prix total lors des sélections',
      'Affichage des allergènes et informations nutritionnelles',
      'Possibilité de sauvegarder des personnalisations favorites',
    ],
  },
  {
    id: 'US-A3',
    personaId: 'client-final',
    title: 'Suivi de Commande en Temps Réel',
    description:
      'En tant que Client Final, je veux suivre la position GPS de mon livreur en temps réel sur une carte interactive, et recevoir des notifications push sur les changements de statut de ma commande, afin de savoir exactement à quel moment réceptionner ma commande et rester informé à chaque étape.',
    acceptanceCriteria: [
      'Carte interactive affichant la position en temps réel du livreur',
      'Notifications push pour chaque changement de statut (CRÉÉE → PAYÉE → EN_PRÉPARATION → PRÊTE → EN_LIVRAISON → LIVRÉE)',
      'Temps estimé restant avant livraison',
      'Visualisation du trajet effectué par le livreur',
      'Bouton "Contacter le livreur" (via chat ou appel)',
    ],
  },
  {
    id: 'US-A4',
    personaId: 'client-final',
    title: 'Paiement et Historique',
    description:
      'En tant que Client Final, je veux enregistrer mes moyens de paiement de manière sécurisée (CB, PayPal, Apple Pay, Wallet), consulter mon historique de commandes et re-commander un panier précédent en un clic, afin de gagner du temps lors de mes prochaines commandes.',
    acceptanceCriteria: [
      'Enregistrement sécurisé de plusieurs moyens de paiement (tokenisation)',
      'Historique complet des commandes passées (date, restaurant, montant, statut)',
      'Fonction "Re-commander" qui recrée le panier précédent en 1 clic',
      'Sauvegarde des adresses de livraison favorites',
      'Possibilité de sauvegarder des cartes de fidélité',
    ],
  },
  {
    id: 'US-A5',
    personaId: 'client-final',
    title: 'Gestion des Imprévus',
    description:
      'En tant que Client Final, je veux pouvoir annuler ma commande dans un délai imparti et contacter le support via un chat intégré, afin de gérer efficacement les problèmes rencontrés (retard, article manquant, commande erronée, etc.).',
    acceptanceCriteria: [
      'Bouton d\'annulation visible avec délai restant affiché',
      'Confirmation d\'annulation avec motifs possibles',
      'Chat intégré avec le support client',
      'Possibilité de signaler un problème directement depuis la commande',
      'Suivi du traitement de la réclamation',
    ],
  },
  {
    id: 'US-A6',
    personaId: 'client-final',
    title: 'Programme de Fidélité et Gamification',
    description:
      'En tant que Client Final, je veux accumuler des points à chaque commande, progresser dans des niveaux (Bronze, Argent, Or, Platine) et bénéficier d\'avantages exclusifs (livraison gratuite, remises, cadeaux), afin de me sentir récompensé de ma fidélité et être incité à commander plus souvent.',
    acceptanceCriteria: [
      'Affichage des points accumulés et du niveau actuel dans le profil',
      'Barre de progression vers le niveau supérieur',
      'Notification lors du changement de niveau',
      'Visualisation des avantages gagnés (badges, remises)',
      'Accès aux offres exclusives de son niveau',
    ],
  },
  {
    id: 'US-A7',
    personaId: 'client-final',
    title: 'Parrainage',
    description:
      'En tant que Client Final, je veux générer un code de parrainage unique, l\'envoyer à mes amis et recevoir une récompense lorsque mon ami passe sa première commande, afin de faire découvrir AppFood à mon entourage et bénéficier d\'avantages.',
    acceptanceCriteria: [
      'Génération d\'un code ou lien de parrainage unique',
      'Envoi du code via SMS, email, WhatsApp, réseaux sociaux',
      'Suivi des parrainages réussis',
      'Attribution automatique de la récompense',
      'Notification lorsque mon ami commande',
    ],
  },
  {
    id: 'US-A8',
    personaId: 'client-final',
    title: 'Consultation des Allergènes et Scores Nutritionnels',
    description:
      'En tant que Client Final, je veux consulter les informations sur les allergènes, le Nutriscore et les scores du produit (Originalité, Générosité, Qualité Gustative) sur chaque fiche produit, afin de faire un choix éclairé en fonction de mes régimes alimentaires, allergies et préférences.',
    acceptanceCriteria: [
      'Affichage des 14 allergènes majeurs avec icônes',
      'Affichage du Nutriscore (A à E) avec code couleur',
      'Affichage des 3 scores complémentaires (Originalité, Générosité, Qualité)',
      'Filtrage possible par allergène ou Nutriscore',
      'Message d\'alerte pour les produits contenant des allergènes',
    ],
  },
  {
    id: 'US-A9',
    personaId: 'client-final',
    title: 'Gestion Avancée du Profil',
    description:
      'En tant que Client Final, je veux gérer mon profil complet (informations personnelles, adresses de livraison, moyens de paiement, préférences de langue et notifications, régimes alimentaires), afin de personnaliser mon expérience et faciliter mes futures commandes.',
    acceptanceCriteria: [
      'Modification des informations personnelles',
      'Gestion des adresses de livraison (ajout, modification, suppression, favori)',
      'Gestion des moyens de paiement sécurisés',
      'Définition des préférences alimentaires (végétarien, sans gluten, etc.)',
      'Gestion des paramètres de notification',
    ],
  },
  {
    id: 'US-A10',
    personaId: 'client-final',
    title: 'Authentification Sécurisée',
    description:
      'En tant que Client Final, je veux m\'authentifier de manière sécurisée via email/mot de passe, connexion sociale (Google, Facebook, Apple) et activer la double authentification, afin de protéger mon compte et mes données personnelles.',
    acceptanceCriteria: [
      'Inscription/Connexion avec email + mot de passe (validation de force)',
      'Connexion via OAuth (Google, Facebook, Apple)',
      'Activation de la 2FA (SMS, Email)',
      'Reconnexion automatique via biométrie (mobile)',
      'Gestion des sessions actives',
    ],
  },
  {
    id: 'US-A13',
    personaId: 'client-final',
    title: 'Évaluation des Restaurants',
    description:
      'En tant que Client Final, je veux noter un restaurant sur 5 étoiles après ma commande, avec la possibilité de laisser un commentaire détaillé, de noter des critères spécifiques (délai de livraison, qualité de l\'emballage, rapport qualité/prix, service client), afin de partager mon expérience avec la communauté et aider les autres clients à faire leur choix.',
    acceptanceCriteria: [
      'Note globale sur 5 étoiles (avec demi-étoiles possibles)',
      'Critères détaillés : Qualité de la nourriture, Délai de livraison, Emballage, Rapport qualité/prix, Présentation',
      'Commentaire texte (optionnel)',
      'Possibilité d\'ajouter une photo de la commande',
      'Possibilité de modifier/supprimer son évaluation dans les 48h',
      'Notification de remerciement après évaluation',
    ],
  },
  {
    id: 'US-A14',
    personaId: 'client-final',
    title: 'Évaluation des Produits',
    description:
      'En tant que Client Final, je veux noter chaque produit commandé sur 5 étoiles et laisser un avis détaillé (qualité gustative, taille, présentation, rapport qualité/prix), afin de guider les autres clients dans leurs choix de plats et aider les restaurateurs à améliorer leur offre.',
    acceptanceCriteria: [
      'Note sur 5 étoiles par produit',
      'Critères : Qualité gustative, Quantité/Taille, Présentation, Rapport qualité/prix',
      'Commentaire texte (optionnel)',
      'Photo du produit (optionnel)',
      'Affichage de l\'avis sur la fiche produit',
      'Possibilité de signaler un avis inapproprié',
    ],
  },
  {
    id: 'US-A15',
    personaId: 'client-final',
    title: 'Évaluation des Livreurs',
    description:
      'En tant que Client Final, je veux évaluer mon livreur (ponctualité, courtoisie, respect des consignes) et laisser un pourboire, afin de reconnaître le travail des livreurs et encourager un service de qualité.',
    acceptanceCriteria: [
      'Note sur 5 étoiles',
      'Critères : Ponctualité, Courtoisie, Respect des consignes de livraison',
      'Commentaire optionnel',
      'Proposition de pourboire (déjà intégré) en parallèle',
      'L\'évaluation du livreur est anonyme',
      'Le livreur peut voir sa note moyenne',
    ],
  },
  {
    id: 'US-A16',
    personaId: 'client-final',
    title: 'Consultation des Évaluations',
    description:
      'En tant que Client Final, je veux consulter les notes et avis des autres clients sur un restaurant ou un produit, avec la possibilité de filtrer par note, trier par date ou pertinence, et voir les avis avec photos, afin de faire un choix éclairé avant de commander.',
    acceptanceCriteria: [
      'Affichage de la note moyenne et du nombre d\'avis sur la fiche restaurant/produit',
      'Liste des avis avec : note, commentaire, date, photo',
      'Filtres : Note (5 étoiles, 4+, etc.), Avec photo, Récents',
      'Tri : Date, Note, Utilité',
      'Bouton "Utile" pour valider les avis pertinents',
      'Signalement d\'un avis inapproprié',
    ],
  },
  {
    id: 'US-A17',
    personaId: 'client-final',
    title: 'Évaluation de l\'Application',
    description:
      'En tant que Client Final, je veux évaluer l\'application AppFood sur les stores (App Store, Google Play) et laisser un avis, afin de partager mon expérience globale avec la plateforme.',
    acceptanceCriteria: [
      'Bouton "Évaluer l\'application" dans le profil',
      'Redirection vers l\'App Store / Google Play',
      'Rappel périodique après plusieurs commandes',
      'Remerciement pour l\'évaluation (avec points de fidélité bonus)',
    ],
  },
  {
    id: 'US-A18',
    personaId: 'client-final',
    title: 'Partage d\'un Restaurant ou d\'un Produit',
    description:
      'En tant que Client Final, je veux partager une marque, un produit ou une offre spéciale sur mes réseaux sociaux (Instagram, Facebook, WhatsApp, Twitter, TikTok) via un bouton de partage natif, avec une image et un message pré-remplis, afin de faire découvrir mes bonnes adresses à mes amis et followers.',
    acceptanceCriteria: [
      'Bouton "Partager" visible sur chaque fiche restaurant et chaque fiche produit',
      'Icône de partage (flèche ou logo) en haut à droite des fiches',
      'Le bouton est accessible depuis l\'écran de détail du restaurant/produit',
      'Le bouton est également disponible depuis la page "Commandes passées"',
    ],
  },
  {
    id: 'US-A19',
    personaId: 'client-final',
    title: 'Partage d\'une Photo de Plat',
    description:
      'En tant que Client Final, je veux prendre une photo de ma commande et la partager instantanément sur mes réseaux sociaux, avec un filtre et un sticker AppFood automatiquement appliqués, afin de créer du contenu visuel attractif autour de l\'application.',
    acceptanceCriteria: [
      'Intégration de l\'appareil photo dans l\'application',
      'Bouton "Prendre une photo" après réception de la commande',
      'Filtres légers : luminosité, contraste, saturation, chaleur',
      'Sticker AppFood transparent (position déplaçable)',
      'Tag automatique du restaurant',
      'Partage direct vers Instagram, Facebook, WhatsApp',
    ],
  },

  // === LIVREUR (B) ===
  {
    id: 'US-B1',
    personaId: 'livreur',
    title: 'Acceptation des Courses',
    description:
      'En tant que Livreur, je veux recevoir des notifications de courses disponibles à proximité de ma position, avec l\'estimation du gain potentiel, de la distance totale et du temps estimé, afin de décider en connaissance de cause d\'accepter ou de refuser une livraison.',
    acceptanceCriteria: [
      'Notification push avec résumé de la course',
      'Affichage : gain estimé (incluant pourboire potentiel), distance (km), temps (min)',
      'Localisation du restaurant et du client sur mini-carte',
      'Boutons "Accepter" ou "Refuser" avec délai de réponse',
      'Historique des courses acceptées/refusées',
    ],
  },
  {
    id: 'US-B2',
    personaId: 'livreur',
    title: 'Gestion des Trajets',
    description:
      'En tant que Livreur, je veux afficher un itinéraire optimisé avec navigation intégrée (GPS), et visualiser clairement l\'ordre des actions (aller au restaurant → récupérer la commande → aller chez le client), afin de livrer le plus rapidement possible et optimiser ma productivité.',
    acceptanceCriteria: [
      'Itinéraire optimisé avec le temps et la distance pour chaque étape',
      'Navigation vocale étape par étape',
      'Affichage du statut de la commande en temps réel',
      'Détection automatique de l\'arrivée au restaurant et chez le client',
      'Vue d\'ensemble du trajet sur carte',
    ],
  },
  {
    id: 'US-B3',
    personaId: 'livreur',
    title: 'Validation Sécurisée de Livraison',
    description:
      'En tant que Livreur, je veux demander un code PIN/OTP à 4 chiffres au client lors de la remise de la commande, et valider la livraison via l\'application, afin de prouver que la commande a bien été livrée au bon destinataire et me protéger contre les fraudes.',
    acceptanceCriteria: [
      'Génération d\'un code OTP unique pour chaque commande',
      'Champ de saisie du code dans l\'application livreur',
      'Possibilité de prendre une photo de la livraison en cas d\'absence du client',
      'Validation automatique bloquant la fin de la course sans code',
      'Gestion des cas d\'échec (client ne répond pas, code erroné)',
    ],
  },
  {
    id: 'US-B4',
    personaId: 'livreur',
    title: 'Gestion des Incidents',
    description:
      'En tant que Livreur, je veux pouvoir signaler un problème directement dans l\'application (ex: client injoignable, adresse inexacte, restaurant en retard) et contacter le support client en cas d\'imprévu majeur, afin de résoudre rapidement les situations bloquantes et continuer mes livraisons.',
    acceptanceCriteria: [
      'Bouton "Signaler un problème" disponible à chaque étape',
      'Liste des motifs d\'incident prédéfinis (client absent, adresse erronée, etc.)',
      'Possibilité d\'ajouter une photo ou un commentaire',
      'Chat direct avec le support client',
      'Traçabilité de tous les incidents signalés',
    ],
  },
  {
    id: 'US-B5',
    personaId: 'livreur',
    title: 'Reçus des Pourboires et Gains',
    description:
      'En tant que Livreur, je veux voir clairement mes gains par course (base + pourboire + bonus), et consulter un historique détaillé de mes revenus, afin de suivre ma rentabilité et optimiser mes trajets.',
    acceptanceCriteria: [
      'Détail du gain par course (livraison + pourboire + bonus)',
      'Historique complet des gains avec filtres',
      'Dashboard des revenus par jour/semaine/mois',
      'Notification en cas de pourboire reçu',
      'Possibilité d\'exporter ses revenus',
    ],
  },
  {
    id: 'US-B6',
    personaId: 'livreur',
    title: 'Gestion des Disponibilités et Horaires',
    description:
      'En tant que Livreur, je veux définir mes créneaux de disponibilité (jours et heures) et recevoir des notifications pour les courses dans ces plages horaires, afin de gérer mon emploi du temps (études, autre travail) et maximiser mes revenus.',
    acceptanceCriteria: [
      'Définition des créneaux de disponibilité',
      'Mise à jour en temps réel des disponibilités',
      'Notification uniquement sur les créneaux définis',
      'Possibilité de pause (ex: 30 minutes)',
      'Historique des disponibilités',
    ],
  },

  // === ADMINISTRATEUR D'ÉTABLISSEMENT (C) ===
  {
    id: 'US-C1',
    personaId: 'site-admin',
    title: 'Gestion des Commandes (Tableau de Bord)',
    description:
      'En tant que Gérant d\'établissement, je veux visualiser une liste des commandes entrantes classées par ordre de priorité, avec la possibilité de les accepter, les refuser (avec motif) ou ajuster le temps de préparation, afin de gérer efficacement le flux de la cuisine et éviter la surcharge.',
    acceptanceCriteria: [
      'Tableau de bord avec liste des commandes en temps réel',
      'Classement automatique par urgence (temps d\'attente, type de commande)',
      'Boutons : Accepter, Refuser (avec choix du motif), Ajuster le temps',
      'Affichage du détail de chaque commande (produits, options, allergies)',
      'Historique des commandes traitées',
    ],
  },
  {
    id: 'US-C2',
    personaId: 'site-admin',
    title: 'Gestion des Stocks en Temps Réel',
    description:
      'En tant que Gérant d\'établissement, je veux passer un produit ou un ingrédient en "Rupture de stock" instantanément, et que ce produit soit automatiquement masqué du catalogue client, afin d\' éviter que les clients commandent des plats indisponibles.',
    acceptanceCriteria: [
      'Interface simple pour basculer un produit en "rupture"',
      'Masquage automatique du produit dans l\'application client',
      'Notifications aux clients ayant déjà commandé le produit',
      'Possibilité de définir des seuils d\'alerte (ex: stock < 5)',
      'Réapprovisionnement en un clic',
    ],
  },
  {
    id: 'US-C3',
    personaId: 'site-admin',
    title: 'Gestion des Horaires et Fermeture Exceptionnelle',
    description:
      'En tant que Gérant d\'établissement, je veux modifier mes horaires d\'ouverture ou fermer exceptionnellement mon établissement, et que l\'application bloque automatiquement toute nouvelle commande, afin de gérer les imprévus (panne technique, rush exceptionnel, jour férié, etc.).',
    acceptanceCriteria: [
      'Interface de gestion des horaires par jour de semaine',
      'Bouton "Fermeture exceptionnelle" avec motif',
      'Blocage automatique des commandes pour la période définie',
      'Message personnalisé affiché aux clients (ex: "Fermé pour cause de travaux")',
      'Réouverture programmée ou manuelle',
    ],
  },
  {
    id: 'US-C4',
    personaId: 'site-admin',
    title: 'Gestion des Commandes Fournisseurs',
    description:
      'En tant que Gérant d\'établissement, je veux générer des bons de commande fournisseurs automatiques basés sur les seuils de réapprovisionnement et suivre les livraisons entrantes, afin de maintenir un stock optimal sans surstockage.',
    acceptanceCriteria: [
      'Configuration des seuils de réapprovisionnement par ingrédient',
      'Génération automatique des bons de commande (suggestion)',
      'Gestion des fournisseurs (nom, contact, délai de livraison)',
      'Suivi des commandes fournisseurs (état : envoyée, en cours, reçue)',
      'Historique des réapprovisionnements',
    ],
  },

  // === ADMINISTRATEUR DE MARQUE (D) ===
  {
    id: 'US-D1',
    personaId: 'brand-admin',
    title: 'Gestion Centralisée du Catalogue',
    description:
      'En tant que Administrateur de Marque, je veux créer et mettre à jour un catalogue type (produits, images, prix, options, allergènes) et le publier de manière sélective sur l\'ensemble de mes sites ou sur un groupe de sites, afin de maintenir une cohérence d\'enseigne et lancer rapidement de nouvelles offres.',
    acceptanceCriteria: [
      'Création/modification de produits avec tous les attributs (nom, description, prix, image, options)',
      'Gestion des groupes d\'options (obligatoires/optionnels, min/max)',
      'Publication sélective : "Tous les sites", "Sites sélectionnés", "Région"',
      'Planification de publication (ex: lancer le nouveau menu à partir du 1er du mois)',
      'Versioning pour suivre les évolutions du catalogue',
    ],
  },
  {
    id: 'US-D2',
    personaId: 'brand-admin',
    title: 'Analyse des Performances Consolidée',
    description:
      'En tant que Administrateur de Marque, je veux consulter des rapports de ventes et des indicateurs clés (CA, nombre de commandes, note moyenne, panier moyen) par site, par produit ou par période, afin d\' identifier les établissements et les articles les plus performants et d\'ajuster ma stratégie commerciale.',
    acceptanceCriteria: [
      'Dashboard avec KPI globaux (CA total, commandes, notes)',
      'Filtres : par site, par période (jour, semaine, mois, année), par produit',
      'Comparaison entre sites (classement, top/bottom performers)',
      'Export des rapports en PDF/Excel',
      'Visualisation graphique (courbes, barres, camemberts)',
    ],
  },
  {
    id: 'US-D3',
    personaId: 'brand-admin',
    title: 'Gestion des Promotions Nationales',
    description:
      'En tant que Administrateur de Marque, je veux créer des codes promo ou des offres (ex: "-30% sur le menu du jour", "2 burgers achetés = 1 offert") et les appliquer à l\'échelle nationale ou régionale, afin de booster les ventes de façon coordonnée sur l\'ensemble de mon réseau.',
    acceptanceCriteria: [
      'Création de campagnes promotionnelles (type, valeur, conditions)',
      'Sélection de la cible : tous les sites, sites sélectionnés, région',
      'Planification (dates de début et fin de la promo)',
      'Suivi des performances de la promotion (nombre d\'utilisations, CA généré)',
      'Gestion des codes promo (génération automatique, utilisation unique/illimitée)',
    ],
  },
  {
    id: 'US-D4',
    personaId: 'brand-admin',
    title: 'Gestion des Allergènes et Scores Produits au Niveau Marque',
    description:
      'En tant que Administrateur de Marque, je veux définir des modèles d\'allergènes et de scores nutritionnels par catégorie de produits, et les pousser sur l\'ensemble de mes sites, afin de garantir une conformité homogène sur tout mon réseau.',
    acceptanceCriteria: [
      'Définition des allergènes par catégorie produit',
      'Modèles de valeurs nutritionnelles pré-remplis',
      'Publication automatique des données sur tous les sites',
      'Contrôle des modifications avant publication',
      'Alertes en cas de données manquantes',
    ],
  },
  {
    id: 'US-D5',
    personaId: 'brand-admin',
    title: 'Gestion des Stocks Consolidée',
    description:
      'En tant que Administrateur de Marque, je veux consulter l\'état des stocks de tous mes sites et avoir une vue consolidée des produits les plus commandés vs les niveaux de stock, afin de piloter la production et les approvisionnements à l\'échelle nationale.',
    acceptanceCriteria: [
      'Vue consolidée des stocks par site, par produit, par ingrédient',
      'Alertes de stock critique au niveau marque',
      'Comparaison entre sites (prévision de rupture)',
      'Export des données d\'inventaire',
      'Tableau de bord "Top produits" vs "Niveaux de stock"',
    ],
  },
  {
    id: 'US-D9',
    personaId: 'brand-admin',
    title: 'Gestion des Réponses aux Avis (Niveau Marque)',
    description:
      'En tant que Administrateur de Marque, je veux créer des modèles de réponse aux avis (remerciements, excuses, réponses aux critiques) et les déployer sur l\'ensemble de mes sites, afin de maintenir une communication cohérente et professionnelle avec les clients.',
    acceptanceCriteria: [
      'Création de modèles de réponse (positifs, négatifs, neutres)',
      'Personnalisation possible par site',
      'Réponse en un clic aux avis récurrents',
      'Historique des réponses',
      'Analyse de l\'impact des réponses sur les notes',
    ],
  },

  // === ADMINISTRATEUR PLATEFORME (E) ===
  {
    id: 'US-E1',
    personaId: 'super-admin',
    title: 'Gestion des Acteurs (Onboarding)',
    description:
      'En tant que SuperAdmin, je veux valider ou rejeter l\'inscription de nouvelles marques, de nouveaux sites et de livreurs après avoir vérifié leurs documents (KYC : pièce d\'identité, SIRET, attestation d\'assurance), afin de garantir la qualité, la conformité et la sécurité de tous les acteurs sur la plateforme.',
    acceptanceCriteria: [
      'Interface d\'administration avec liste des demandes en attente',
      'Consultation des documents fournis (KYC)',
      'Boutons "Valider" / "Refuser" avec motif et message personnalisé',
      'Historique des validations/refus',
      'Notification automatique au demandeur de la décision',
    ],
  },
  {
    id: 'US-E2',
    personaId: 'super-admin',
    title: 'Gestion des Litiges Complexes',
    description:
      'En tant que SuperAdmin, je veux consulter un historique complet, unifié et sécurisé d\'une commande (logs système, trajets GPS, messages entre client et livreur, photos de livraison, communications avec le support), afin de trancher les litiges complexes de manière équitable et décider d\'un remboursement ou d\'un dédommagement.',
    acceptanceCriteria: [
      'Fiche commande avec vue unifiée de tous les événements',
      'Chronologie des statuts avec horodatage',
      'Visualisation du trajet du livreur sur carte',
      'Accès aux messages, photos et preuves de livraison',
      'Actions disponibles : Rembourser, Offrir un avoir, Suspendre un acteur',
    ],
  },
  {
    id: 'US-E3',
    personaId: 'super-admin',
    title: 'Modération & Maintenance',
    description:
      'En tant que SuperAdmin, je veux suspendre un utilisateur, un livreur ou un restaurant en cas de comportement frauduleux, et surveiller la santé du système (temps de réponse, nombre d\'erreurs, uptime) via un dashboard technique, afin d\' assurer la fiabilité, la sécurité et la qualité de service de la plateforme.',
    acceptanceCriteria: [
      'Liste des utilisateurs/acteurs avec possibilité de suspension/désactivation',
      'Motif obligatoire pour toute suspension',
      'Dashboard technique : temps de réponse API, erreurs 500, uptime',
      'Alertes en cas d\'anomalie (ex: temps de réponse > 2s)',
      'Logs d\'audit pour toutes les actions administratives',
    ],
  },
  {
    id: 'US-E4',
    personaId: 'super-admin',
    title: 'Gestion des Programmes de Fidélité et Gamification',
    description:
      'En tant que SuperAdmin, je veux configurer les paramètres généraux des programmes de fidélité (points par euro, niveaux, récompenses, conditions de parrainage), afin de contrôler l\'ensemble du système de gamification et l\'adapter à la stratégie de la plateforme.',
    acceptanceCriteria: [
      'Configuration des règles de points : 1 point = X €',
      'Définition des niveaux : Bronze, Argent, Or, Platine (seuils)',
      'Paramétrage des récompenses (remises, livraisons gratuites, cadeaux)',
      'Configuration du programme de parrainage (récompenses)',
      'Dashboard de performance du programme de fidélité',
    ],
  },
  {
    id: 'US-E5',
    personaId: 'super-admin',
    title: 'Gestion des Rôles et Permissions (RBAC)',
    description:
      'En tant que SuperAdmin, je veux créer, modifier et supprimer des rôles avec des permissions granulaires (ex: lecture seule, modification, administration), et attribuer ces rôles aux utilisateurs, afin de contrôler précisément les accès et garantir la sécurité des données.',
    acceptanceCriteria: [
      'Création de rôles personnalisables',
      'Définition des permissions par module (commande, produit, utilisateur, finance)',
      'Attribution/désattribution de rôles aux utilisateurs',
      'Audit trail des modifications de permissions',
      'Contrôle d\'accès basé sur les rôles (RBAC)',
    ],
  },
  {
    id: 'US-E6',
    personaId: 'super-admin',
    title: 'Gestion de la Fraude',
    description:
      'En tant que SuperAdmin, je veux configurer et surveiller un système de détection des fraudes (commandes suspectes, remboursements abusifs, faux comptes) et gérer les transactions bloquées, afin de protéger la plateforme contre les pertes financières.',
    acceptanceCriteria: [
      'Configuration des règles de détection (seuils, pattern)',
      'Tableau de bord des alertes frauduleuses',
      'Gestion des faux comptes (vérification KYC)',
      'Analyse des patterns d\'abus (annulations, remboursements)',
      'Historique des fraudes et des actions entreprises',
    ],
  },
  {
    id: 'US-E7',
    personaId: 'super-admin',
    title: 'Gestion du Système User Voice (Feedback & Suggestions)',
    description:
      'En tant que SuperAdmin, je veux configurer et modérer un système de feedback utilisateur où les clients et les marques peuvent soumettre des suggestions, voter pour les idées des autres, et suivre l\'état d\'avancement des demandes, afin de recueillir les retours de la communauté et prioriser le développement en fonction de la demande réelle.',
    acceptanceCriteria: [
      'Catégories de feedback : Nouvelle fonctionnalité, Amélioration, Bug, Autre',
      'Statuts des suggestions : Soumise, En examen, Planifiée, En cours, Livrée, Refusée',
      'Système de vote : chaque utilisateur peut voter (1 vote = 1 point)',
      'Commentaires sur les suggestions',
      'Badge "En cours de développement" ou "Livrée" pour les suggestions acceptées',
    ],
  },
  {
    id: 'US-E8',
    personaId: 'super-admin',
    title: 'Gestion du Blog et du Centre de Ressources',
    description:
      'En tant que SuperAdmin, je veux créer, éditer, programmer et publier des articles de blog, des tutoriels, des guides et des annonces, avec gestion des catégories, tags et SEO, afin de communiquer efficacement avec la communauté, améliorer le référencement et fournir des ressources utiles.',
    acceptanceCriteria: [
      'Rédaction d\'articles avec éditeur WYSIWYG',
      'Catégories : Nouveautés, Tutoriels, FAQ, Histoires de succès, Recettes, Tendances',
      'Tags pour le référencement',
      'Programmation de la publication',
      'Gestion des médias (images, vidéos)',
      'Aperçu avant publication',
      'Historique des versions',
      'Statistiques de lecture (vues, partages)',
    ],
  },
  {
    id: 'US-E9',
    personaId: 'super-admin',
    title: 'Modération des Suggestions et Commentaires',
    description:
      'En tant que SuperAdmin, je veux modérer les suggestions et commentaires du User Voice (supprimer les contenus inappropriés, valider les suggestions, répondre publiquement), afin de maintenir une communauté saine et constructive.',
    acceptanceCriteria: [
      'File d\'attente de modération',
      'Actions : Approuver, Rejeter, Signaler',
      'Réponse publique aux suggestions',
      'Signalement automatique des contenus abusifs',
      'Historique des actions de modération',
    ],
  },
  {
    id: 'US-E10',
    personaId: 'super-admin',
    title: 'Roadmap Publique',
    description:
      'En tant que SuperAdmin, je veux créer et publier une roadmap publique des fonctionnalités à venir, basée sur les suggestions les plus votées et la stratégie produit, afin de montrer la transparence de la plateforme et impliquer la communauté dans l\'évolution du produit.',
    acceptanceCriteria: [
      'Création d\'une roadmap avec timeline (Trimestre 1, 2, 3, 4)',
      'Statuts : En réflexion, Planifié, En développement, Bêta, Livré',
      'Lien entre les suggestions User Voice et les items de la roadmap',
      'Notifications automatiques aux voteurs lorsque leur suggestion est planifiée',
      'Mise à jour régulière',
    ],
  },
  {
    id: 'US-E11',
    personaId: 'super-admin',
    title: 'Enquêtes et Sondages',
    description:
      'En tant que SuperAdmin, je veux créer et diffuser des enquêtes de satisfaction et des sondages auprès des utilisateurs (clients, livreurs, restaurateurs) pour recueillir des retours structurés, afin de mesurer la satisfaction et identifier les axes d\'amélioration prioritaires.',
    acceptanceCriteria: [
      'Création d\'enquêtes (questions ouvertes, échelle de Likert, QCM)',
      'Ciblage par segment (clients, livreurs, restaurateurs)',
      'Diffusion par email, push notification, in-app',
      'Taux de réponse et analyse automatique',
      'Export des résultats',
    ],
  },
  {
    id: 'US-E12',
    personaId: 'super-admin',
    title: 'Gestion des Alertes et Annonces Globales',
    description:
      'En tant que SuperAdmin, je veux créer des annonces globales (maintenance planifiée, incident technique, nouvelle fonctionnalité) diffusées sur l\'application, le blog et par notification, afin de communiquer rapidement avec tous les utilisateurs de la plateforme.',
    acceptanceCriteria: [
      'Création d\'annonce avec importance (critique, important, information)',
      'Canaux de diffusion : application (bannière), notification push, email, blog',
      'Programmation de l\'annonce',
      'Ciblage (tous les utilisateurs, segment spécifique)',
      'Suivi de la diffusion (taux d\'ouverture, vues)',
    ],
  },
  {
    id: 'US-E13',
    personaId: 'super-admin',
    title: 'Modération des Évaluations',
    description:
      'En tant que SuperAdmin, je veux modérer les évaluations signalées comme abusives (contenu inapproprié, faux avis, diffamation), et décider de les maintenir, les masquer ou les supprimer, afin de garantir l\'intégrité du système d\'évaluation et la confiance des utilisateurs.',
    acceptanceCriteria: [
      'File d\'attente des évaluations signalées',
      'Consultation du contenu signalé',
      'Actions : Maintenir, Masquer, Supprimer',
      'Communication avec le restaurant/livreur concerné',
      'Historique des modérations',
      'Statistiques des signalements par catégorie',
    ],
  },
  {
    id: 'US-E14',
    personaId: 'super-admin',
    title: 'Analyse Globale des Évaluations',
    description:
      'En tant que SuperAdmin, je veux consulter des dashboards globaux sur les évaluations (notes moyennes par secteur, par région, évolution dans le temps, corrélation avec le CA), afin de piloter la qualité de la plateforme et identifier les tendances.',
    acceptanceCriteria: [
      'Dashboard des notes moyennes globales',
      'Analyse par secteur (restaurant, épicerie, etc.)',
      'Analyse par région géographique',
      'Corrélation note vs CA / nombre de commandes',
      'Identification des établissements problématiques',
      'Export des rapports',
    ],
  },
  {
    id: 'US-E15',
    personaId: 'super-admin',
    title: 'Programmes de Reconnaissance Qualité',
    description:
      'En tant que SuperAdmin, je veux créer des programmes de reconnaissance (ex: "Restaurant de l\'année", "Meilleur nouveau venu", "Qualité d\'or") basés sur les évaluations, afin de motiver les partenaires à améliorer leur qualité et valoriser les meilleurs.',
    acceptanceCriteria: [
      'Définition des critères (note moyenne, nombre d\'avis, tendance)',
      'Génération automatique du classement',
      'Badges sur les fiches restaurants',
      'Communication des résultats (blog, notification)',
      'Récompenses potentielles (commission réduite, mise en avant)',
    ],
  },

  // === PRÉPARATEUR / CUISINIER (F) ===
  {
    id: 'US-F1',
    personaId: 'preparateur',
    title: 'Visualisation du KDS (Kitchen Display System)',
    description:
      'En tant que Cuisinier/Préparateur, je veux voir les commandes entrantes sur un écran tactile sous forme de fiches claires, classées par urgence (temps écoulé depuis la réception), avec les personnalisations (allergies, retraits, suppléments) mises en évidence en couleur, afin d\' organiser ma production efficacement et éviter toute erreur de préparation.',
    acceptanceCriteria: [
      'Affichage des commandes avec : numéro, produits, quantité, options',
      'Mise en évidence des allergies (rouge), retraits (orange), suppléments (vert)',
      'Classement automatique par urgence (temps d\'attente)',
      'Affichage du temps écoulé pour chaque commande',
      'Interface tactile, optimisée pour usage en cuisine',
    ],
  },
  {
    id: 'US-F2',
    personaId: 'preparateur',
    title: 'Gestion du Statut en Un Clic',
    description:
      'En tant que Cuisinier/Préparateur, je veux passer l\'état d\'une commande de "En préparation" à "Prête" en un simple clic sur l\'écran (ou via action vocale), afin de déclencher automatiquement la notification pour le livreur et fluidifier le flux de commandes.',
    acceptanceCriteria: [
      'Bouton "Prête" visible sur chaque fiche commande',
      'Changement de statut avec confirmation visuelle',
      'Notification automatique au livreur',
      'Mise à jour en temps réel de la liste (commande déplacée)',
      'Possibilité de revenir en arrière (erreur)',
    ],
  },
  {
    id: 'US-F3',
    personaId: 'preparateur',
    title: 'Rupture de Stock Instantanée',
    description:
      'En tant que Cuisinier/Préparateur, je veux signaler un ingrédient ou un produit manquant directement depuis le KDS, afin que le système propose automatiquement une alternative au client (via l\'application) ou bloque la vente immédiatement.',
    acceptanceCriteria: [
      'Bouton "Rupture" accessible rapidement depuis la fiche produit',
      'Choix : Bloquer la vente ou Proposer une alternative',
      'Si alternative proposée, notification automatique au client',
      'Liste des produits en rupture affichée en tête de KDS',
      'Réapprovisionnement en un clic',
    ],
  },
  {
    id: 'US-F4',
    personaId: 'preparateur',
    title: 'Impression des Tickets',
    description:
      'En tant que Cuisinier/Préparateur, je veux qu\'un ticket d\'impression soit généré automatiquement pour chaque commande (avec tickets séparés pour cuisine et bar si besoin), afin d\' avoir un support physique fiable en cas de problème technique ou de perte de réseau.',
    acceptanceCriteria: [
      'Impression automatique à la réception de la commande',
      'Tickets séparés par zone de préparation (Cuisine, Bar, Dessert)',
      'Format clair : produits, quantités, options, allergies, numéro de commande',
      'Re-impression possible en cas de problème',
      'Gestion des pannes d\'imprimante (file d\'attente)',
    ],
  },

  // === CUSTOMER CARE (G) ===
  {
    id: 'US-G1',
    personaId: 'customer-care',
    title: 'Vue Unifiée de la Commande',
    description:
      'En tant qu\' Agent du Support Client, je veux consulter une "fiche client" unifiée qui regroupe le détail complet de la commande, l\'historique des statuts, la position du livreur, les messages échangés et les photos de livraison, afin de répondre rapidement et efficacement aux réclamations sans avoir à jongler entre plusieurs outils.',
    acceptanceCriteria: [
      'Interface unique regroupant toutes les informations',
      'Chronologie complète de la commande',
      'Carte interactive avec trajet du livreur',
      'Accès aux preuves (photos, messages, OTP)',
      'Recherche rapide par numéro de commande ou client',
    ],
  },
  {
    id: 'US-G2',
    personaId: 'customer-care',
    title: 'Gestion des Litiges et Remboursements',
    description:
      'En tant qu\' Agent du Support Client, je veux proposer un remboursement, un avoir ou un geste commercial (ex: code promo) à un client directement depuis mon interface, et que le système exécute l\'action automatiquement, afin de résoudre les problèmes en quelques minutes sans avoir à passer par un processus manuel lourd.',
    acceptanceCriteria: [
      'Actions disponibles avec un clic : "Rembourser", "Offrir un avoir", "Code promo"',
      'Montant personnalisable ou remboursement total',
      'Validation en 2 clics (avec confirmation)',
      'Email automatique de confirmation envoyé au client',
      'Traçabilité de toutes les actions du support',
    ],
  },
  {
    id: 'US-G3',
    personaId: 'customer-care',
    title: 'Gestion des Interactions',
    description:
      'En tant qu\' Agent du Support Client, je veux prendre en charge un chat client, consulter l\'historique complet de ses conversations et lui envoyer des messages pré-formatés (réponses types), afin d\' assurer un service client réactif, professionnel et personnalisé.',
    acceptanceCriteria: [
      'Interface de chat centralisée avec file d\'attente',
      'Historique des conversations par client',
      'Bibliothèque de réponses pré-formatées (catégorisées par problème)',
      'Envoi de pièces jointes (ex: photo de la commande)',
      'Transfert de conversation vers un autre agent ou SuperAdmin',
    ],
  },

  // === B2B MANAGER (H) ===
  {
    id: 'US-H1',
    personaId: 'b2b-manager',
    title: 'Accès aux Relevés Financiers',
    description:
      'En tant que B2B Manager (Gestionnaire Financier), je veux consulter un dashboard de mes performances financières qui affiche le CA brut, le total des commissions AppFood, le montant net à recevoir, le nombre de transactions et les frais de livraison, afin d\' avoir une vision claire et instantanée de ma santé financière.',
    acceptanceCriteria: [
      'Dashboard avec KPI financiers clés (CA, commissions, net)',
      'Filtres par période (jour, semaine, mois, année)',
      'Répartition : par site, par type de paiement (CB, Cash, Wallet)',
      'Comparaison avec les périodes précédentes (évolution)',
      'Alertes en cas d\'écart important',
    ],
  },
  {
    id: 'US-H2',
    personaId: 'b2b-manager',
    title: 'Export des Données Comptables',
    description:
      'En tant que B2B Manager (Gestionnaire Financier), je veux exporter les données de ventes (formats CSV, PDF ou directement compatible avec QuickBooks/Sage) avec le détail par transaction (n° commande, date, montant brut, commission, frais de livraison, TVA), afin de faciliter mon rapprochement bancaire, mes déclarations de TVA et mes audits comptables.',
    acceptanceCriteria: [
      'Export en un clic aux formats : CSV, Excel, PDF',
      'Intégration directe avec QuickBooks, Sage, Xero',
      'Niveau de détail configurable (agrégé ou transactionnel)',
      'Historique des exports disponible',
      'Chiffrement des données sensibles (conformité RGPD)',
    ],
  },
  {
    id: 'US-H3',
    personaId: 'b2b-manager',
    title: 'Suivi des Paiements',
    description:
      'En tant que B2B Manager (Gestionnaire Financier), je veux visualiser l\'historique des virements effectués par AppFood (date, montant, période concernée, statut) et le statut des paiements en attente, afin d\' anticiper mes flux de trésorerie et gérer efficacement mes éventuels impayés.',
    acceptanceCriteria: [
      'Interface avec historique complet des virements reçus',
      'Visualisation des paiements en attente',
      'Délai estimé pour le prochain virement',
      'Notification en cas de retard de paiement',
      'Téléchargement des justificatifs de paiement (relevés bancaires)',
    ],
  },

  // === COMMUNITY MANAGER (I) ===
  {
    id: 'US-I2',
    personaId: 'community-manager',
    title: 'Création et Programmation de Contenu Social',
    description:
      'En tant que Community Manager, je veux créer, modifier et programmer des publications pour les réseaux sociaux (Instagram, Facebook, Twitter, TikTok, LinkedIn) directement depuis l\'interface AppFood, avec des modèles pré-conçus, afin de maintenir une présence active et cohérente sur tous les canaux.',
    acceptanceCriteria: [
      'Éditeur de contenu visuel avec modèles',
      'Bibliothèque d\'images et de vidéos AppFood',
      'Programmation des publications à des dates/heures définies',
      'Adaptation automatique du format par réseau (carré, vertical, horizontal)',
      'Aperçu avant publication',
      'Calendrier des publications',
    ],
  },
  {
    id: 'US-I3',
    personaId: 'community-manager',
    title: 'Gestion des Concours et Campagnes Sociales',
    description:
      'En tant que Community Manager, je veux créer des concours et des campagnes sociales (ex: "Tentez de gagner 100€ de repas en partageant votre meilleure photo de plat !"), avec des mécaniques de participation (likes, partages, commentaires, tags), afin de augmenter l\'engagement et la visibilité de la marque.',
    acceptanceCriteria: [
      'Création de campagnes avec objectif (engagement, notoriété, acquisition)',
      'Définition des règles et conditions de participation',
      'Suivi des participants et des actions (likes, partages, commentaires)',
      'Tirage au sort intégré (aléatoire ou basé sur des critères)',
      'Attribution automatique des récompenses (codes promo, points de fidélité)',
    ],
  },
];