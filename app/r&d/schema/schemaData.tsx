//@/app/schema/schemaData.ts
/* role : Données statiques décrivant le schéma de la base de données AppFood.
   Chaque entité liste ses champs avec une description et les relations avec les autres entités.
   import: Aucun (données pures)
   useBy : SchemaPage (/app/schema/page.tsx) pour l’affichage de la documentation du modèle.
*/
export interface EntityRelation {
  with: string;
  type: string;
}

export interface EntityField {
  name: string;
  description: string;
}

export interface Entity {
  name: string;
  description: string;
  fields: EntityField[];
  relations: EntityRelation[];
}

export interface EntityGroup {
  group: string;
  entities: Entity[];
}
export const entityGroups = [
  {
    group: 'Authentification & Utilisateurs',
    entities: [
      {
        name: 'User',
        description:
          "Représente un utilisateur de la plateforme (client, livreur, administrateur, etc.). Contient les informations d'authentification (email, mot de passe hashé) et les préférences de notification.",
        fields: [
          { name: 'id', description: 'Identifiant unique généré par la base de données' },
          { name: 'name', description: 'Nom complet de l’utilisateur' },
          { name: 'email', description: 'Adresse email unique, utilisée pour la connexion' },
          { name: 'passwordHash', description: 'Mot de passe hashé (bcrypt)' },
          { name: 'phone', description: 'Numéro de téléphone (optionnel)' },
          { name: 'roles', description: 'Rôles attribués (SuperAdmin, BrandAdmin, Client, Driver…)' },
          { name: 'isActive', description: 'Indique si le compte est actif' },
          { name: 'lastLoginAt', description: 'Date de la dernière connexion' },
          { name: 'notificationSettings', description: 'Préférences de notification (push, email, SMS)' },
          { name: 'createdAt', description: 'Date de création du compte' },
          { name: 'updatedAt', description: 'Date de dernière modification' },
          { name: 'deletedAt', description: 'Date de suppression logique (soft delete)' },
        ],
        relations: [
          { with: 'Profil', type: '1:1' },
          { with: 'Address', type: '1:N' },
          { with: 'Favorite', type: '1:N' },
          { with: 'Order', type: '1:N' },
          { with: 'Review', type: '1:N' },
          { with: 'SupportTicket', type: '1:N' },
          { with: 'LoyaltyAccount', type: '1:1' },
          { with: 'Driver', type: '1:1 (si livreur)' },
          { with: 'Notification', type: '1:N' },
          { with: 'Cart', type: '1:N' },
          { with: 'KycDocument', type: '1:N' },
          { with: 'Referral', type: '1:N (en tant que parrain)' },
        ],
      },
      {
        name: 'Profil',
        description:
          'Complète les informations de l’utilisateur : bio, langues, préférences alimentaires et allergies.',
        fields: [
          { name: 'id', description: 'Identifiant unique du profil' },
          { name: 'userId', description: 'Clé étrangère vers User' },
          { name: 'bio', description: 'Courte biographie' },
          { name: 'preferredLanguage', description: 'Langue préférée (fr, en, es…)' },
          { name: 'dietaryPreferences', description: 'Préférences alimentaires (végétarien, halal…)' },
          { name: 'allergies', description: 'Liste des allergies déclarées' },
          { name: 'avatarUrl', description: 'URL de la photo de profil' },
          { name: 'birthDate', description: 'Date de naissance (optionnelle)' },
        ],
        relations: [{ with: 'User', type: '1:1' }],
      },
      {
        name: 'Address',
        description:
          'Adresse de livraison ou de facturation. Peut être associée à un utilisateur ou à un site (pour l\'adresse du restaurant).',
        fields: [
          { name: 'id', description: 'Identifiant unique de l’adresse' },
          { name: 'userId', description: 'ID de l’utilisateur propriétaire (peut être null pour un site)' },
          { name: 'siteId', description: 'ID du site si l’adresse est celle d’un point de vente' },
          { name: 'typeAdress', description: 'Type d’adresse (shipping, billing, site)' },
          { name: 'label', description: 'Libellé personnalisé (ex: Maison, Bureau)' },
          { name: 'street', description: 'Rue et numéro' },
          { name: 'city', description: 'Ville' },
          { name: 'postalCode', description: 'Code postal' },
          { name: 'countryCode', description: 'Code pays ISO (FR, BE…)' },
          { name: 'lat', description: 'Latitude pour géolocalisation' },
          { name: 'lng', description: 'Longitude pour géolocalisation' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'Site', type: 'N:1 (adresse du site)' },
          { with: 'Order', type: '1:N (adresse de livraison)' },
        ],
      },
      {
        name: 'Role',
        description:
          'Définit un rôle (ex : SuperAdmin, BrandAdmin, SiteManager) avec des permissions associées.',
        fields: [
          { name: 'id', description: 'Identifiant unique du rôle' },
          { name: 'name', description: 'Nom du rôle (ex: superadmin, brandadmin)' },
          { name: 'permissions', description: 'Liste des permissions liées à ce rôle' },
          { name: 'createdAt', description: 'Date de création' },
        ],
        relations: [
          { with: 'User', type: 'N:M (via User.roles)' },
          { with: 'Permission', type: 'N:M' },
        ],
      },
      {
        name: 'Permission',
        description: 'Action autorisée sur un module spécifique (ex : "orders:read").',
        fields: [
          { name: 'id', description: 'Identifiant unique de la permission' },
          { name: 'module', description: 'Module concerné (orders, users, products…)' },
          { name: 'actions', description: 'Actions permises (create, read, update, delete)' },
        ],
        relations: [{ with: 'Role', type: 'N:M' }],
      },
      {
        name: 'KycDocument',
        description:
          'Documents justificatifs (pièce d’identité, SIRET, assurance, permis) soumis par un utilisateur (driver, brand).',
        fields: [
          { name: 'id', description: 'Identifiant unique du document' },
          { name: 'userId', description: 'ID de l’utilisateur ayant soumis le document' },
          { name: 'type', description: 'Type de document (id_card, siret, insurance, license)' },
          { name: 'fileUrl', description: 'URL du fichier stocké' },
          { name: 'status', description: 'Statut de validation (pending, approved, rejected)' },
          { name: 'reviewedBy', description: 'ID de l’administrateur ayant vérifié le document' },
          { name: 'reviewedAt', description: 'Date de vérification' },
          { name: 'createdAt', description: 'Date de soumission' },
        ],
        relations: [{ with: 'User', type: 'N:1' }],
      },
    ],
  },
  {
    group: 'Marques & Sites',
    entities: [
      {
        name: 'Brand',
        description:
          'Une marque (restaurant, épicerie, etc.) possédant plusieurs sites physiques et une galerie de médias.',
        fields: [
          { name: 'id', description: 'Identifiant unique de la marque' },
          { name: 'slug', description: 'Identifiant URL unique (ex: mon-resto)' },
          { name: 'name', description: 'Nom commercial de la marque' },
          { name: 'type', description: 'Type de marque (restaurant, grocery, bakery…)' },
          { name: 'description', description: 'Description courte' },
          { name: 'logo', description: 'URL du logo' },
          { name: 'coverImage', description: 'Image de couverture' },
          { name: 'isActive', description: 'Marque active/inactive' },
          { name: 'createdAt', description: 'Date de création' },
          { name: 'updatedAt', description: 'Date de dernière modification' },
        ],
        relations: [
          { with: 'Site', type: '1:N' },
          { with: 'Product', type: '1:N' },
          { with: 'Gallery', type: '1:N' },
          { with: 'Faq', type: '1:N' },
          { with: 'Promotion', type: '1:N' },
          { with: 'QualityProgram', type: 'N:M (via winners)' },
        ],
      },
      {
        name: 'Site',
        description:
          'Point de vente physique d’une marque. Contient les horaires d’ouverture, les zones de livraison, et les stocks de produits.',
        fields: [
          { name: 'id', description: 'Identifiant unique du site' },
          { name: 'brandId', description: 'Clé étrangère vers Brand' },
          { name: 'name', description: 'Nom du site (ex: Restaurant Centre)' },
          { name: 'phone', description: 'Numéro de téléphone' },
          { name: 'email', description: 'Adresse email de contact' },
          { name: 'isOpen', description: 'Indique si le site est actuellement ouvert' },
          { name: 'openingHours', description: 'Horaires d’ouverture (lié à OpeningHours)' },
          { name: 'address', description: 'Adresse physique (lié à Address)' },
          { name: 'deliveryZones', description: 'Zones de livraison couvertes (lié à DeliveryZone)' },
          { name: 'createdAt', description: 'Date de création' },
          { name: 'updatedAt', description: 'Date de dernière modification' },
        ],
        relations: [
          { with: 'Brand', type: 'N:1' },
          { with: 'Address', type: '1:1' },
          { with: 'OpeningHours', type: '1:N' },
          { with: 'DeliveryZone', type: '1:N' },
          { with: 'ProductStock', type: '1:N' },
          { with: 'Order', type: '1:N' },
          { with: 'Cart', type: '1:N' },
        ],
      },
      {
        name: 'OpeningHours',
        description: 'Plages horaires d’ouverture pour un site, par jour de la semaine.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'siteId', description: 'ID du site associé' },
          { name: 'dayOfWeek', description: 'Jour de la semaine (0 = dimanche, 1 = lundi…)' },
          { name: 'openTime', description: 'Heure d’ouverture (HH:mm)' },
          { name: 'closeTime', description: 'Heure de fermeture (HH:mm)' },
        ],
        relations: [{ with: 'Site', type: 'N:1' }],
      },
      {
        name: 'DeliveryZone',
        description:
          'Zone géographique (polygone) pour laquelle le site propose la livraison, avec des frais et un délai estimé.',
        fields: [
          { name: 'id', description: 'Identifiant unique de la zone' },
          { name: 'siteId', description: 'ID du site' },
          { name: 'name', description: 'Nom de la zone (ex: Centre-ville)' },
          { name: 'polygon', description: 'Coordonnées du polygone (GeoJSON)' },
          { name: 'deliveryFee', description: 'Frais de livraison pour cette zone' },
          { name: 'estimatedDeliveryMinutes', description: 'Délai de livraison estimé en minutes' },
        ],
        relations: [{ with: 'Site', type: 'N:1' }],
      },
      {
        name: 'Gallery',
        description:
          'Galerie d’images associée à une marque ou un produit. Contient une image principale et une liste d’URLs.',
        fields: [
          { name: 'id', description: 'Identifiant unique de la galerie' },
          { name: 'brandId', description: 'ID de la marque (null si galerie produit)' },
          { name: 'productId', description: 'ID du produit (null si galerie marque)' },
          { name: 'name', description: 'Titre de la galerie' },
          { name: 'mainImage', description: 'URL de l’image principale' },
          { name: 'images', description: 'Liste d’URLs supplémentaires' },
          { name: 'altText', description: 'Texte alternatif pour l’accessibilité' },
        ],
        relations: [
          { with: 'Brand', type: 'N:1' },
          { with: 'Product', type: 'N:1' },
        ],
      },
      {
        name: 'Faq',
        description: 'Foire aux questions, par catégorie d’utilisateur (B2C, B2B, Drivers, DEV).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'brandId', description: 'Marque associée (optionnel)' },
          { name: 'useBy', description: 'Cible (customers, drivers, brands…)' },
          { name: 'question', description: 'Question' },
          { name: 'answer', description: 'Réponse' },
          { name: 'order', description: 'Ordre d’affichage' },
        ],
        relations: [{ with: 'Brand', type: 'N:1' }],
      },
    ],
  },
  {
    group: 'Produits & Recettes',
    entities: [
      {
        name: 'Product',
        description:
          'Produit vendu par une marque. Peut être un plat, une boisson, etc. Contient le prix, les allergènes, le score nutritionnel, et des options de personnalisation.',
        fields: [
          { name: 'id', description: 'Identifiant unique du produit' },
          { name: 'brandId', description: 'ID de la marque propriétaire' },
          { name: 'name', description: 'Nom du produit' },
          { name: 'description', description: 'Description détaillée' },
          { name: 'price', description: 'Prix de base en centimes' },
          { name: 'isAvailable', description: 'Disponibilité actuelle' },
          { name: 'allergens', description: 'Liste des allergènes (gluten, lactose…)' },
          { name: 'nutriScore', description: 'Score nutritionnel (A à E)' },
          { name: 'optionsGroups', description: 'Groupes d’options personnalisables' },
          { name: 'imageUrl', description: 'Image principale' },
          { name: 'createdAt', description: 'Date de création' },
          { name: 'updatedAt', description: 'Date de dernière modification' },
        ],
        relations: [
          { with: 'Brand', type: 'N:1' },
          { with: 'Category', type: 'N:M' },
          { with: 'Recipe', type: '1:1' },
          { with: 'ProductStock', type: '1:N' },
          { with: 'OrderItem', type: '1:N' },
          { with: 'CartItem', type: '1:N' },
          { with: 'Gallery', type: 'N:1' },
          { with: 'MenuSection', type: 'N:M (via linkedProductIds)' },
        ],
      },
      {
        name: 'Category',
        description:
          'Catégorie de produits (ex : "Entrées", "Plats", "Boissons"). Peut être appliquée à plusieurs produits.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'name', description: 'Nom de la catégorie' },
          { name: 'categoryType', description: 'Type de catégorie (food, drink, etc.)' },
          { name: 'orderdisplay', description: 'Ordre d’affichage dans le menu' },
          { name: 'description', description: 'Description facultative' },
          { name: 'image', description: 'Image illustrant la catégorie' },
        ],
        relations: [{ with: 'Product', type: 'N:M' }],
      },
      {
        name: 'Recipe',
        description:
          'Recette d’un produit, avec ses ingrédients, les étapes de préparation, et les temps (préparation, cuisson).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'productId', description: 'ID du produit lié' },
          { name: 'name', description: 'Nom de la recette' },
          { name: 'description', description: 'Description de la recette' },
          { name: 'difficulty', description: 'Difficulté (easy, medium, hard)' },
          { name: 'preparationTime', description: 'Temps de préparation en minutes' },
          { name: 'cookingTime', description: 'Temps de cuisson en minutes' },
          { name: 'totalTime', description: 'Temps total estimé' },
        ],
        relations: [
          { with: 'Product', type: '1:1' },
          { with: 'Ingredient', type: '1:N' },
          { with: 'Step', type: '1:N' },
        ],
      },
      {
        name: 'Ingredient',
        description: 'Ingrédient d’une recette, avec son nom et sa quantité.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'recipeId', description: 'ID de la recette' },
          { name: 'name', description: 'Nom de l’ingrédient' },
          { name: 'quantity', description: 'Quantité (ex: 200g, 2 pièces)' },
        ],
        relations: [{ with: 'Recipe', type: 'N:1' }],
      },
      {
        name: 'Step',
        description: 'Étape de préparation d’une recette, avec un ordre et une description.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'recipeId', description: 'ID de la recette' },
          { name: 'order', description: 'Numéro d’ordre' },
          { name: 'description', description: 'Description de l’étape' },
        ],
        relations: [{ with: 'Recipe', type: 'N:1' }],
      },
      {
        name: 'OptionGroup',
        description:
          'Groupe d’options de personnalisation pour un produit (ex : "Sauces", "Suppléments").',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'productId', description: 'ID du produit' },
          { name: 'name', description: 'Nom du groupe (ex: Sauces)' },
          { name: 'type', description: 'Type de sélection (single, multiple)' },
          { name: 'minSelection', description: 'Nombre minimum de choix' },
          { name: 'maxSelection', description: 'Nombre maximum de choix' },
        ],
        relations: [
          { with: 'Product', type: 'N:1' },
          { with: 'Option', type: '1:N' },
        ],
      },
      {
        name: 'Option',
        description: 'Option individuelle (ex : "Sauce BBQ", "Fromage supplémentaire") avec prix additionnel.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'optionGroupId', description: 'ID du groupe d’options' },
          { name: 'name', description: 'Nom de l’option' },
          { name: 'extraPrice', description: 'Prix supplémentaire en centimes' },
          { name: 'allergens', description: 'Allergènes spécifiques' },
          { name: 'isDefault', description: 'Option sélectionnée par défaut' },
        ],
        relations: [
          { with: 'OptionGroup', type: 'N:1' },
          { with: 'OrderItemOption', type: '1:N' },
        ],
      },
      {
        name: 'Menu',
        description: 'Un menu composé de plusieurs sections (ex : "Choisissez votre boisson")',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'productId', description: 'ID du produit de type menu' },
          { name: 'title', description: 'Titre du menu' },
        ],
        relations: [
          { with: 'Product', type: '1:1' },
          { with: 'MenuSection', type: '1:N' },
        ],
      },
      {
        name: 'MenuSection',
        description: 'Section d’un menu, avec une sélection obligatoire/facultative de produits.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'menuId', description: 'ID du menu parent' },
          { name: 'name', description: 'Nom de la section (ex: Boissons)' },
          { name: 'minSelection', description: 'Nombre minimum de produits à choisir' },
          { name: 'maxSelection', description: 'Nombre maximum' },
          { name: 'linkedProductIds', description: 'IDs des produits proposés dans cette section' },
        ],
        relations: [
          { with: 'Menu', type: 'N:1' },
          { with: 'Product', type: 'N:M (via linkedProductIds)' },
        ],
      },
    ],
  },
  {
    group: 'Commandes & Paiements',
    entities: [
      {
        name: 'Order',
        description:
          'Commande passée par un utilisateur. Contient le statut, les articles, les frais, le montant total, et les informations de livraison.',
        fields: [
          { name: 'id', description: 'Identifiant unique de la commande' },
          { name: 'number', description: 'Numéro de commande lisible (ex: ORD-20231001)' },
          { name: 'status', description: 'Statut (pending, confirmed, delivered, cancelled…)' },
          { name: 'userId', description: 'ID du client' },
          { name: 'siteId', description: 'ID du site de préparation' },
          { name: 'brandId', description: 'ID de la marque' },
          { name: 'subtotal', description: 'Sous-total HT' },
          { name: 'deliveryFee', description: 'Frais de livraison' },
          { name: 'tax', description: 'Montant de la TVA' },
          { name: 'totalAmount', description: 'Montant total TTC' },
          { name: 'isScheduled', description: 'Commande programmée' },
          { name: 'scheduledFor', description: 'Date et heure de livraison souhaitée' },
          { name: 'createdAt', description: 'Date de création' },
          { name: 'updatedAt', description: 'Date de dernière modification' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'Site', type: 'N:1' },
          { with: 'Brand', type: 'N:1' },
          { with: 'OrderItem', type: '1:N' },
          { with: 'Payment', type: '1:1' },
          { with: 'Refund', type: '1:N' },
          { with: 'Delivery', type: '1:1' },
          { with: 'SupportTicket', type: '1:N' },
          { with: 'FraudAlert', type: '1:N' },
        ],
      },
      {
        name: 'OrderItem',
        description: 'Ligne d’une commande : un produit avec ses options sélectionnées, la quantité et le prix unitaire.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'orderId', description: 'ID de la commande' },
          { name: 'productId', description: 'ID du produit commandé' },
          { name: 'quantity', description: 'Quantité' },
          { name: 'unitPrice', description: 'Prix unitaire au moment de la commande (centimes)' },
          { name: 'productSnapshot', description: 'Capture du produit (nom, image) pour historique' },
        ],
        relations: [
          { with: 'Order', type: 'N:1' },
          { with: 'Product', type: 'N:1' },
          { with: 'OrderItemOption', type: '1:N' },
        ],
      },
      {
        name: 'OrderItemOption',
        description: 'Option choisie pour un article de commande (ex : sauce choisie).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'orderItemId', description: 'ID de la ligne de commande' },
          { name: 'optionGroupId', description: 'ID du groupe d’options' },
          { name: 'optionId', description: 'ID de l’option sélectionnée' },
          { name: 'extraCost', description: 'Coût supplémentaire en centimes' },
        ],
        relations: [{ with: 'OrderItem', type: 'N:1' }],
      },
      {
        name: 'Payment',
        description: 'Paiement associé à une commande. Contient le montant, la méthode et le statut.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'orderId', description: 'ID de la commande' },
          { name: 'amount', description: 'Montant payé' },
          { name: 'method', description: 'Méthode (card, paypal, cash, wallet)' },
          { name: 'status', description: 'Statut (pending, completed, failed, refunded)' },
          { name: 'transactionId', description: 'Identifiant de la transaction externe' },
          { name: 'createdAt', description: 'Date de paiement' },
        ],
        relations: [{ with: 'Order', type: '1:1' }],
      },
      {
        name: 'PaymentMethod',
        description:
          'Moyen de paiement enregistré par un utilisateur (CB, PayPal, etc.) avec token sécurisé.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'userId', description: 'ID de l’utilisateur' },
          { name: 'type', description: 'Type (card, paypal)' },
          { name: 'lastFourDigits', description: 'Quatre derniers chiffres (pour CB)' },
          { name: 'expiryDate', description: 'Date d’expiration' },
          { name: 'token', description: 'Token sécurisé fourni par la passerelle de paiement' },
          { name: 'isDefault', description: 'Moyen de paiement par défaut' },
        ],
        relations: [{ with: 'User', type: 'N:1' }],
      },
      {
        name: 'Refund',
        description: 'Remboursement partiel ou total d’une commande. Suit le statut et est initié par un administrateur ou le client.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'orderId', description: 'ID de la commande' },
          { name: 'paymentId', description: 'ID du paiement associé' },
          { name: 'amount', description: 'Montant remboursé' },
          { name: 'reason', description: 'Motif du remboursement' },
          { name: 'status', description: 'Statut (requested, approved, processed, rejected)' },
          { name: 'initiatedBy', description: 'Initiateur (customer ou admin)' },
          { name: 'createdAt', description: 'Date de la demande' },
        ],
        relations: [
          { with: 'Order', type: 'N:1' },
          { with: 'Payment', type: 'N:1' },
        ],
      },
    ],
  },
  {
    group: 'Livraison & Livreurs',
    entities: [
      {
        name: 'Delivery',
        description:
          'Suivi d’une livraison : statut, horaires estimés/réels, code OTP, photo de preuve, et points de suivi GPS.',
        fields: [
          { name: 'id', description: 'Identifiant unique de la livraison' },
          { name: 'orderId', description: 'ID de la commande' },
          { name: 'driverId', description: 'ID du livreur assigné' },
          { name: 'status', description: 'Statut (assigned, picked_up, in_transit, delivered)' },
          { name: 'pickupEstimatedAt', description: 'Heure estimée de ramassage' },
          { name: 'deliveryEstimatedAt', description: 'Heure estimée de livraison' },
          { name: 'actualPickupAt', description: 'Heure réelle de ramassage' },
          { name: 'actualDeliveryAt', description: 'Heure réelle de livraison' },
          { name: 'otpCode', description: 'Code à usage unique pour validation de remise' },
          { name: 'proofPhotoUrl', description: 'Photo de la livraison' },
          { name: 'tracking', description: 'Points GPS enregistrés (via TrackPoint)' },
        ],
        relations: [
          { with: 'Order', type: '1:1' },
          { with: 'Driver', type: 'N:1' },
          { with: 'TrackPoint', type: '1:N' },
        ],
      },
      {
        name: 'TrackPoint',
        description: 'Point de géolocalisation d’une livraison (timestamp, latitude, longitude).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'deliveryId', description: 'ID de la livraison' },
          { name: 'lat', description: 'Latitude' },
          { name: 'lng', description: 'Longitude' },
          { name: 'timestamp', description: 'Horodatage' },
        ],
        relations: [{ with: 'Delivery', type: 'N:1' }],
      },
      {
        name: 'Driver',
        description:
          'Profil d’un livreur, lié à un utilisateur. Contient son statut, sa localisation actuelle, sa note, ses disponibilités et ses documents KYC.',
        fields: [
          { name: 'id', description: 'Identifiant unique du livreur' },
          { name: 'userId', description: 'ID de l’utilisateur associé' },
          { name: 'status', description: 'Statut (online, offline, busy, inactive)' },
          { name: 'currentLocation', description: 'Position GPS actuelle' },
          { name: 'rating', description: 'Note moyenne' },
          { name: 'availabilities', description: 'Plages de disponibilité' },
          { name: 'createdAt', description: 'Date d’inscription comme livreur' },
        ],
        relations: [
          { with: 'User', type: '1:1' },
          { with: 'AvailabilitySlot', type: '1:N' },
          { with: 'KycDocument', type: '1:N' },
          { with: 'Delivery', type: '1:N' },
        ],
      },
      {
        name: 'AvailabilitySlot',
        description: 'Plage horaire de disponibilité d’un livreur.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'driverId', description: 'ID du livreur' },
          { name: 'dayOfWeek', description: 'Jour de la semaine' },
          { name: 'startTime', description: 'Heure de début' },
          { name: 'endTime', description: 'Heure de fin' },
        ],
        relations: [{ with: 'Driver', type: 'N:1' }],
      },
    ],
  },
  {
    group: 'Fidélité & Gamification',
    entities: [
      {
        name: 'LoyaltyAccount',
        description: 'Compte de fidélité d’un utilisateur : solde de points, niveau (Bronze, Silver, Gold, Platinum).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'userId', description: 'ID de l’utilisateur' },
          { name: 'pointsBalance', description: 'Solde de points' },
          { name: 'level', description: 'Niveau actuel (bronze, silver, gold, platinum)' },
          { name: 'createdAt', description: 'Date d’activation du compte fidélité' },
        ],
        relations: [
          { with: 'User', type: '1:1' },
          { with: 'PointsTransaction', type: '1:N' },
        ],
      },
      {
        name: 'PointsTransaction',
        description: 'Historique des points gagnés ou utilisés (avec raison et éventuel orderId).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'accountId', description: 'ID du compte fidélité' },
          { name: 'amount', description: 'Nombre de points (positif ou négatif)' },
          { name: 'reason', description: 'Raison (order_completed, referral, reward_used…)' },
          { name: 'orderId', description: 'ID de commande liée si applicable' },
          { name: 'createdAt', description: 'Date de la transaction' },
        ],
        relations: [{ with: 'LoyaltyAccount', type: 'N:1' }],
      },
      {
        name: 'Referral',
        description:
          'Parrainage : code généré par un utilisateur, suivi de l’inscription et de la première commande du filleul.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'referrerId', description: 'ID du parrain' },
          { name: 'referredUserId', description: 'ID du filleul' },
          { name: 'code', description: 'Code de parrainage unique' },
          { name: 'status', description: 'Statut (pending, signed_up, first_order, reward_granted)' },
          { name: 'rewardGranted', description: 'Indique si la récompense a été attribuée' },
          { name: 'createdAt', description: 'Date de création du code' },
        ],
        relations: [{ with: 'User', type: 'N:1 (referrer)' }],
      },
      {
        name: 'LoyaltyProgramConfig',
        description: 'Configuration globale du programme de fidélité (points par euro, seuils de niveau, récompenses).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'pointsPerEuro', description: 'Points gagnés par euro dépensé' },
          { name: 'levelThresholds', description: 'Seuils de points pour chaque niveau' },
          { name: 'rewards', description: 'Récompenses disponibles' },
          { name: 'referralRewardAmount', description: 'Points offerts pour un parrainage réussi' },
        ],
        relations: [],
      },
    ],
  },
  {
    group: 'Évaluations & Avis',
    entities: [
      {
        name: 'Review',
        description:
          'Avis laissé par un utilisateur sur une marque, un produit, un livreur ou l’application elle-même.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'authorId', description: 'ID de l’auteur' },
          { name: 'targetType', description: 'Type de cible (brand, product, driver, app)' },
          { name: 'targetId', description: 'ID de la cible' },
          { name: 'globalRating', description: 'Note globale (1 à 5)' },
          { name: 'comment', description: 'Commentaire texte' },
          { name: 'isAnonymous', description: 'Avis anonyme' },
          { name: 'createdAt', description: 'Date de publication' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'RatingCriterion', type: '1:N' },
          { with: 'ReviewFlag', type: '1:N' },
        ],
      },
      {
        name: 'RatingCriterion',
        description: 'Critère d’évaluation (ex : "Qualité de la nourriture") avec un score.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'reviewId', description: 'ID de l’avis' },
          { name: 'name', description: 'Nom du critère' },
          { name: 'score', description: 'Score attribué (1 à 5)' },
        ],
        relations: [{ with: 'Review', type: 'N:1' }],
      },
      {
        name: 'ReviewFlag',
        description: 'Signalement d’un avis par un utilisateur (modération).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'reviewId', description: 'ID de l’avis signalé' },
          { name: 'reporterId', description: 'ID de l’utilisateur qui signale' },
          { name: 'reason', description: 'Motif du signalement' },
          { name: 'status', description: 'Statut de traitement (pending, reviewed, dismissed)' },
          { name: 'createdAt', description: 'Date du signalement' },
        ],
        relations: [{ with: 'Review', type: 'N:1' }],
      },
    ],
  },
  {
    group: 'Promotions',
    entities: [
      {
        name: 'Promotion',
        description:
          'Code promotionnel défini par une marque (ou le super admin) : remise en pourcentage, montant fixe, ou offre "achetez X obtenez Y".',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'brandId', description: 'ID de la marque (null si global)' },
          { name: 'code', description: 'Code promo (ex: BIENVENUE10)' },
          { name: 'type', description: 'Type de remise (percentage, fixed_amount, buy_x_get_y)' },
          { name: 'value', description: 'Valeur de la remise' },
          { name: 'conditions', description: 'Conditions d’application (montant minimum, etc.)' },
          { name: 'targetSiteIds', description: 'Sites concernés (tous si vide)' },
          { name: 'startDate', description: 'Date de début de validité' },
          { name: 'endDate', description: 'Date de fin' },
          { name: 'maxUses', description: 'Nombre maximum d’utilisations' },
          { name: 'currentUses', description: 'Nombre d’utilisations actuelles' },
        ],
        relations: [{ with: 'Brand', type: 'N:1' }],
      },
    ],
  },
  {
    group: 'Support & Communication',
    entities: [
      {
        name: 'SupportTicket',
        description: 'Ticket de support ouvert par un utilisateur, avec son statut, sa priorité et ses messages.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'userId', description: 'ID de l’utilisateur' },
          { name: 'orderId', description: 'ID de la commande concernée (optionnel)' },
          { name: 'subject', description: 'Sujet du ticket' },
          { name: 'status', description: 'Statut (open, in_progress, resolved, closed)' },
          { name: 'priority', description: 'Priorité (low, medium, high, urgent)' },
          { name: 'createdAt', description: 'Date d’ouverture' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'Order', type: 'N:1' },
          { with: 'ChatMessage', type: '1:N' },
        ],
      },
      {
        name: 'ChatMessage',
        description: 'Message échangé dans un ticket de support, envoyé par le client, le support ou le système.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'ticketId', description: 'ID du ticket' },
          { name: 'senderId', description: 'ID de l’expéditeur (User ou admin)' },
          { name: 'senderType', description: 'Type d’expéditeur (customer, support, system)' },
          { name: 'message', description: 'Contenu du message' },
          { name: 'attachmentUrl', description: 'Pièce jointe éventuelle' },
          { name: 'createdAt', description: 'Date d’envoi' },
        ],
        relations: [{ with: 'SupportTicket', type: 'N:1' }],
      },
      {
        name: 'UserVoiceSuggestion',
        description: 'Suggestion ou demande de fonctionnalité soumise par un utilisateur.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'authorId', description: 'ID de l’auteur' },
          { name: 'title', description: 'Titre de la suggestion' },
          { name: 'description', description: 'Description détaillée' },
          { name: 'category', description: 'Catégorie (UX, feature, bug…)' },
          { name: 'status', description: 'Statut (under_review, planned, in_progress, completed, declined)' },
          { name: 'votes', description: 'Nombre de votes' },
          { name: 'roadmapItemId', description: 'Lien vers un élément de roadmap si planifié' },
          { name: 'createdAt', description: 'Date de soumission' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'UserVoiceComment', type: '1:N' },
          { with: 'RoadmapItem', type: 'N:1 (via roadmapItemId)' },
        ],
      },
      {
        name: 'UserVoiceComment',
        description: 'Commentaire sur une suggestion.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'suggestionId', description: 'ID de la suggestion' },
          { name: 'authorId', description: 'ID de l’auteur' },
          { name: 'content', description: 'Contenu du commentaire' },
          { name: 'createdAt', description: 'Date de publication' },
        ],
        relations: [{ with: 'UserVoiceSuggestion', type: 'N:1' }],
      },
      {
        name: 'BlogPost',
        description: 'Article de blog (actualités, tutoriels, recettes, etc.) publié par un administrateur.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'title', description: 'Titre de l’article' },
          { name: 'content', description: 'Contenu (markdown/HTML)' },
          { name: 'excerpt', description: 'Extrait court' },
          { name: 'authorId', description: 'ID de l’auteur' },
          { name: 'category', description: 'Catégorie (news, tutorial, recipe…)' },
          { name: 'tags', description: 'Tags' },
          { name: 'published', description: 'Statut de publication' },
          { name: 'publishedAt', description: 'Date de publication' },
          { name: 'createdAt', description: 'Date de création' },
        ],
        relations: [{ with: 'User', type: 'N:1' }],
      },
      {
        name: 'Survey',
        description: 'Sondage envoyé à des segments d’utilisateurs (clients, livreurs, restaurateurs).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'title', description: 'Titre du sondage' },
          { name: 'description', description: 'Description' },
          { name: 'targetSegment', description: 'Segment cible (customers, drivers, brands)' },
          { name: 'isActive', description: 'Sondage actif' },
          { name: 'startDate', description: 'Date de début' },
          { name: 'endDate', description: 'Date de fin' },
        ],
        relations: [{ with: 'SurveyQuestion', type: '1:N' }],
      },
      {
        name: 'SurveyQuestion',
        description: 'Question d’un sondage (type : ouvert, Likert, QCM).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'surveyId', description: 'ID du sondage' },
          { name: 'type', description: 'Type (open, likert, multiple_choice)' },
          { name: 'text', description: 'Texte de la question' },
          { name: 'options', description: 'Options (pour QCM)' },
          { name: 'required', description: 'Question obligatoire' },
        ],
        relations: [{ with: 'Survey', type: 'N:1' }],
      },
      {
        name: 'GlobalAnnouncement',
        description:
          'Annonce globale (bannière, push, email) diffusée à certains segments d’utilisateurs.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'title', description: 'Titre de l’annonce' },
          { name: 'message', description: 'Contenu du message' },
          { name: 'importance', description: 'Niveau d’importance (info, warning, critical)' },
          { name: 'channels', description: 'Canaux de diffusion (banner, push, email)' },
          { name: 'startAt', description: 'Début d’affichage' },
          { name: 'endAt', description: 'Fin d’affichage' },
          { name: 'isActive', description: 'Annonce active' },
        ],
        relations: [],
      },
    ],
  },
  {
    group: 'Finances & Administration',
    entities: [
      {
        name: 'FinancialReport',
        description:
          'Rapport financier périodique pour une marque : revenus, commissions, frais de livraison, montant net.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'brandId', description: 'ID de la marque' },
          { name: 'periodStart', description: 'Début de la période' },
          { name: 'periodEnd', description: 'Fin de la période' },
          { name: 'grossRevenue', description: 'Revenu brut' },
          { name: 'commissionTotal', description: 'Total des commissions' },
          { name: 'deliveryFees', description: 'Frais de livraison collectés' },
          { name: 'netAmount', description: 'Montant net à reverser' },
          { name: 'status', description: 'Statut (draft, finalized)' },
          { name: 'createdAt', description: 'Date de création' },
        ],
        relations: [
          { with: 'Brand', type: 'N:1' },
          { with: 'FinancialTransaction', type: '1:N' },
        ],
      },
      {
        name: 'FinancialTransaction',
        description: 'Transaction financière détaillée (par commande) dans un rapport.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'reportId', description: 'ID du rapport financier' },
          { name: 'orderId', description: 'ID de la commande' },
          { name: 'date', description: 'Date de la commande' },
          { name: 'grossAmount', description: 'Montant brut' },
          { name: 'commission', description: 'Commission' },
          { name: 'deliveryFee', description: 'Frais de livraison' },
          { name: 'tax', description: 'Taxes' },
          { name: 'net', description: 'Montant net' },
        ],
        relations: [{ with: 'FinancialReport', type: 'N:1' }],
      },
      {
        name: 'Payout',
        description: 'Virement effectué à une marque (période, montant, statut).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'brandId', description: 'ID de la marque' },
          { name: 'amount', description: 'Montant du virement' },
          { name: 'currency', description: 'Devise (EUR)' },
          { name: 'periodStart', description: 'Période début' },
          { name: 'periodEnd', description: 'Période fin' },
          { name: 'status', description: 'Statut (pending, processed, failed)' },
          { name: 'processedAt', description: 'Date de traitement' },
          { name: 'reference', description: 'Référence externe' },
        ],
        relations: [{ with: 'Brand', type: 'N:1' }],
      },
      {
        name: 'FraudAlert',
        description: 'Alerte de fraude détectée par le système (ordre, règle déclenchée, sévérité).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'orderId', description: 'ID de la commande suspecte' },
          { name: 'ruleTriggered', description: 'Règle de détection déclenchée' },
          { name: 'severity', description: 'Sévérité (low, medium, high)' },
          { name: 'status', description: 'Statut (open, investigating, resolved, false_positive)' },
          { name: 'createdAt', description: 'Date de détection' },
        ],
        relations: [{ with: 'Order', type: 'N:1' }],
      },
      {
        name: 'QualityProgram',
        description: "Programme de reconnaissance (ex : 'Restaurant de l'année') avec critères et gagnants.",
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'name', description: 'Nom du programme' },
          { name: 'criteria', description: 'Critères d’évaluation' },
          { name: 'badgeIconUrl', description: 'URL du badge' },
          { name: 'startDate', description: 'Date de début' },
          { name: 'endDate', description: 'Date de fin' },
          { name: 'winners', description: 'IDs des marques gagnantes' },
        ],
        relations: [{ with: 'Brand', type: 'N:M (via winners)' }],
      },
      {
        name: 'RoadmapItem',
        description: 'Élément de la feuille de route produit (trimestre, statut, suggestions liées).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'title', description: 'Titre de l’élément' },
          { name: 'description', description: 'Description' },
          { name: 'quarter', description: 'Trimestre cible (ex: 2023-Q3)' },
          { name: 'status', description: 'Statut (planned, in_progress, done)' },
          { name: 'relatedSuggestions', description: 'IDs des suggestions UserVoice associées' },
        ],
        relations: [{ with: 'UserVoiceSuggestion', type: 'N:M (via relatedSuggestions)' }],
      },
    ],
  },
  {
    group: 'Paniers & Notifications',
    entities: [
      {
        name: 'Cart',
        description:
          'Panier d’achat d’un utilisateur (connecté ou non). Contient les articles, le code promo, les frais, et expire après un certain temps.',
        fields: [
          { name: 'id', description: 'Identifiant unique du panier' },
          { name: 'userId', description: 'ID de l’utilisateur (null si visiteur anonyme)' },
          { name: 'sessionId', description: 'Identifiant de session pour visiteurs' },
          { name: 'siteId', description: 'ID du site sur lequel on commande' },
          { name: 'brandId', description: 'ID de la marque' },
          { name: 'items', description: 'Articles dans le panier (CartItem)' },
          { name: 'promotionCode', description: 'Code promo appliqué' },
          { name: 'subtotal', description: 'Sous-total des articles' },
          { name: 'totalAmount', description: 'Montant total avec remises et frais' },
          { name: 'expiresAt', description: 'Date d’expiration du panier' },
          { name: 'createdAt', description: 'Date de création' },
        ],
        relations: [
          { with: 'User', type: 'N:1' },
          { with: 'Site', type: 'N:1' },
          { with: 'Brand', type: 'N:1' },
          { with: 'CartItem', type: '1:N' },
        ],
      },
      {
        name: 'CartItem',
        description: 'Ligne d’un panier : produit, quantité et options sélectionnées.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'cartId', description: 'ID du panier' },
          { name: 'productId', description: 'ID du produit' },
          { name: 'quantity', description: 'Quantité' },
          { name: 'selectedOptions', description: 'Options choisies avec leurs identifiants' },
        ],
        relations: [{ with: 'Cart', type: 'N:1' }],
      },
      {
        name: 'Notification',
        description: 'Notification envoyée à un utilisateur (mise à jour de commande, promo, fidélité, etc.).',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'userId', description: 'ID de l’utilisateur destinataire' },
          { name: 'type', description: 'Type de notification (order_status, promotion, loyalty…)' },
          { name: 'title', description: 'Titre de la notification' },
          { name: 'body', description: 'Corps du message' },
          { name: 'data', description: 'Données associées (ex: orderId)' },
          { name: 'isRead', description: 'Lu / non lu' },
          { name: 'createdAt', description: 'Date d’envoi' },
        ],
        relations: [{ with: 'User', type: 'N:1' }],
      },
      {
        name: 'TaxRule',
        description: 'Règle de TVA applicable par pays et type de produit.',
        fields: [
          { name: 'id', description: 'Identifiant unique' },
          { name: 'name', description: 'Nom de la règle (ex: TVA standard France)' },
          { name: 'rate', description: 'Taux (ex: 0.20 pour 20%)' },
          { name: 'countryCode', description: 'Code pays ISO' },
          { name: 'applicableTo', description: 'Types de produits concernés (food, alcohol…)' },
          { name: 'isActive', description: 'Règle active' },
        ],
        relations: [],
      },
    ],
  },
];