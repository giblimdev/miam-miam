// ============================================================
// schema.ts – Modèle de données complet pour AppFood
// ============================================================

// ------------------------------------------------------------
// 1. Authentification, Utilisateurs & Profil
// ------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  roles: Role[];
  phone?: string;
  notificationSettings?: {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
  };
  profil : Profil;
  favorites : Favorite[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt? : Date;
}
export interface Profil{
id : string ; //
bio : string; // 
  preferredLanguage?: string;
  dietaryPreferences?: string[];       // ex: ['vegetarian', 'gluten-free']
  allergies?: string[];                // ex: ['milk', 'peanut']
address : Address[]
}




// ------------------------------------------------------------
// 2. Galerie & Médias
// ------------------------------------------------------------

export interface Gallery {
  id: string;
  name: string;
  altText : string ;
  description?: string;
  mainImage: string;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
  owner: User;
  BrandId : string;
}

// ------------------------------------------------------------
// 3. Marques, FAQ, Sites & Adresses
// ------------------------------------------------------------

export interface Brand {
  id: string;
  slug: string;
  name: string;
  type: string[];                     // ex: ['restaurant', 'épicerie']
  description: string;
  logo?: string;
  galleries: Gallery[];
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
  site: Site[];
  faq: Faq[];
  products: Product[];
  deletedAt? : Date;
}

export interface Faq {
  id: string;
  useBy: string; // "B2C" Client | "B2B partenaires | "Drivers" | "DEV"
  question: string;
  answer: string;
}

export interface Site {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isOpen: boolean;                   // ajouté pour la fermeture exceptionnelle default true
  openingHours?: OpeningHours[];     // ajouté pour les horaires
  createdAt?: Date;
  updatedAt?: Date;
  address: Address;                   //
  brandId: string;
  deliveryZones:DeliveryZone[] //un site peut desservir plusieurs zones (ex: 2km, 5km, 10km avec des frais différents).
  productStock : ProductStock[] 
  deletedAt? : Date;
}

export interface OpeningHours {
  id : string ;  
  SiteId : string // permet d'effectuer une ecerche sur les site ouvert
  dayOfWeek: number;                 // 0 = dimanche, 1 = lundi, ...
  openTime: string;                  // "HH:mm"
  closeTime: string;
}

export interface Address {
  id: string;
  typeAdress: string;                // 'deliveryAddress' | 'billingAddress'
  street: string;
  city: string;
  postalCode?: string;
  countryCode: string;               // ISO 3166-1 alpha-2
  state?: string;
  neighborhood?: string;
  urbanization?: string;
  complement?: string;
  buildingName?: string;
  floor?: string;
  door?: string;
  additionalInfo?: string;
  lat?: number;
  lng?: number;
  label?: string;                    // "Maison", "Travail", etc.
  isDefault?: boolean;
  instructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  siteId? : string
}

// ------------------------------------------------------------
// 4. Produits, Recettes, Allergènes & Options
// ------------------------------------------------------------

export interface Product {
  id: string;
  orderdisplay: number;
  name: string;
  categories : Category[];
  isMenu : boolean // deffault false 
  description?: string;
  price: number;
  image?: Gallery;
  recipe?: Recipe;
  isAvailable: boolean;               // default true rupture de stock rapide
  allergens: string[];                // 14 allergènes majeurs
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  nutritionalInfo?: NutritionalInfo;
  scores?: { type: string; score: number }[]; // Originalité, Générosité, Qualité
  optionsGroups?: OptionGroup[];      // personnalisation avancée
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt? : Date;
  productStocks : ProductStock[];
}

export interface Menu {
  id: string;
  productId: string; // Le produit qui est de type "Menu"
  title: string;
  menuSections: MenuSection[];
}

export interface MenuSection {
  id: string;
  name: string; // ex: "Choisissez votre boisson"
  minSelection: number;
  maxSelection: number;
  linkedProductIds: string[]; // Liste des IDs de produits éligibles (Coca, Fanta, Eau)
}
export interface Category {
    id : string;
    name : string 
    categoryType : string; // emule : food produits article
    orderdisplay : number;
    description : string ;
    image : string;
    products : Product[];
}

export interface NutritionalInfo {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  salt?: number;
}

export interface OptionGroup {
  id: string;
  name: string;                       // ex: "Sauces", "Suppléments"
  type: 'OBLIGATORY' | 'OPTIONAL';
  minSelection: number;
  maxSelection: number;
  options: Option[];
}

export interface Option {
  id: string;
  name: string;
  extraPrice: number;
  allergens: string[];
  isDefault: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  preparationTime: number;
  cookingTime: number;
  totalTime: number;
  ingredients: Ingredient[];
  steps: Step[];
  createdAt?: Date;
  updatedAt?: Date;
  productId?: string;
}

export interface Step {
  id: string;
  order: number;
  description: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  createdAt?: Date;
  updatedAt?: Date;
  recipeId?: string;
}

// ------------------------------------------------------------
// 5. Gestion des stocks (produit par site)
// ------------------------------------------------------------

export interface ProductStock {
  id: string;
  productId: string;
  siteId: string;
  quantityAvailable: number; //nb qyantitéb(Gr...) 
  threshold: number;                  // seuil d'alerte
}

// ------------------------------------------------------------
// 6. Commandes & Paiements
// ------------------------------------------------------------

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'IN_PREPARATION'
  | 'READY'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

export interface Order {
  id: string;
  number: string;                     // ex: "#CMD-2026-0001"
  status: OrderStatus;
  userId: string;                   // user.id
  siteId: string;
  brandId: string;
  deliveryAddressId?: string;         // lien vers Address (snapshot facultatif)
  items: OrderItem[];
   isScheduled: boolean;
  scheduledFor?: Date;                 // Date et heure souhaitées pour la livraison
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;                   // "EUR"
  estimatedDeliveryTime?: Date;
  cancellationDeadline?: Date;
  cancellationReason?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
    deletedAt? : Date;

}
export type RefundStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export interface Refund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  initiatedBy: string; // userId de l'admin ou du client
  processedAt?: Date;
  createdAt: Date;
  deletedAt? : Date;
  
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: {                  // données du produit au moment de la commande
    name: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  selectedOptions: OrderItemOption[];
  specialInstructions?: string;
    deletedAt? : Date;

}

export interface OrderItemOption {
  optionGroupId: string;
  optionGroupName: string;           // ex: "Sauces"
  optionId: string;
  optionName: string;
  extraCost: number;
    deletedAt? : Date;

}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'CB' | 'PayPal' | 'Apple Pay' | 'Wallet';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  tokenizedCardId?: string;
  createdAt: Date;
    deletedAt? : Date;

}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'CB' | 'PayPal' | 'Apple Pay' | 'Wallet';
  lastFourDigits?: string;
  expiryDate?: string;                // MM/YY
  token: string;                      // token de paiement sécurisé
  isDefault: boolean;
  createdAt: Date;
}

// ------------------------------------------------------------
// 7. Livraison & Livreurs
// ------------------------------------------------------------

export type DeliveryStatus =
  | 'ACCEPTED'
  | 'HEADING_TO_RESTAURANT'
  | 'PICKING_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED';

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  status: DeliveryStatus; // cf  enum
  pickupEstimatedAt?: Date;
  deliveryEstimatedAt?: Date;
  actualPickupAt?: Date;
  actualDeliveryAt?: Date;
  otpCode: string;                    // code PIN à 4 chiffres
  deliveryPhoto?: string;             // preuve photo
 // Sera gerer comme un achat de produit au pret du site de la plateforme
 //driverEarnings: { 
 //   base: number;
 //   tip: number;
 //   bonus: number;
//  };
drivercoment? : string // le livreur signale interpjone en panne clent ne repond pas...
  tracking: TrackPoint[];
  createdAt: Date;
  updatedAt: Date;
    deletedAt? : Date;

}

export interface TrackPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface Driver {
  id: string;
  userId: string;                     // lien vers user
  status: 'ONLINE' | 'OFFLINE' | 'ON_DELIVERY';
  currentLocation?: { lat: number; lng: number };
  rating: number;
  availabilities: AvailabilitySlot[];
  documents: KycDocument[];          // pièces justificatives
  createdAt: Date;
  updatedAt: Date;
}
// disponibilité d'un driver
export interface AvailabilitySlot {
  dayOfWeek: number;                  // 0 = dimanche
  startTime: string;                  // "HH:mm"
  endTime: string;
}

// ------------------------------------------------------------
// 8. Fidélité, Parrainage & Gamification
// ------------------------------------------------------------
export interface Favorite {
  id: string;
  userId: string;
  targetType: 'BRAND' | 'PRODUCT' | 'SITE';
  targetId: string;
  createdAt: Date;
}
export type LoyaltyLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltyAccount {
  id: string;
  userId: string;
  pointsBalance: number;
  level: LoyaltyLevel;
  pointsHistory: PointsTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: string;
  accountId: string;
  amount: number;                     // positif (gain) ou négatif (utilisation)
  reason: string;
  orderId?: string;
  createdAt: Date;
  deletedAt? : Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId?: string;            // rempli quand le filleul s'inscrit
  code: string;
  status: 'SENT' | 'SIGNED_UP' | 'FIRST_ORDER_COMPLETED';
  rewardGranted: boolean;
  createdAt: Date;
}

export interface LoyaltyProgramConfig {
  id: string;
  pointsPerEuro: number;
  levelThresholds: { [key in LoyaltyLevel]: number };
  rewards: { level: LoyaltyLevel; description: string }[];
  referralRewardAmount: number;       // montant offert au parrain
  referralRewardCurrency: string;
}

// ------------------------------------------------------------
// 9. Évaluations & Avis (Restaurants, Produits, Livreurs, Application)
// ------------------------------------------------------------

export type ReviewTargetType = 'RESTAURANT' | 'PRODUCT' | 'DRIVER' | 'APP';

export interface Review {
  id: string;
  authorId: string;
  targetType: ReviewTargetType;
  targetId: string;                   // brand.id, product.id, driver.id, etc.
  globalRating: number;               // 1-5 avec demi-étoiles possible (ex: 4.5)
  criteria?: RatingCriterion[];
  comment?: string;
  photoUrl?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingCriterion {
  name: string;                       // ex: "Qualité de la nourriture"
  score: number;                      // 1-5
}

export interface ReviewFlag {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: Date;
}

// ------------------------------------------------------------
// 10. Administration, RBAC & KYC
// ------------------------------------------------------------

export interface Role {
  id: string;
  name: string;                       // ex: "SuperAdmin", "BrandAdmin", "SiteManager"
  permissions: Permission[];
}

export interface Permission {
  id : string;
  module: string;                     // "orders", "products", "users", "finance"
  actions: string[];                  // ["read", "write", "delete"]
}

export interface KycDocument {
  id: string;
  userId: string;
  type: 'ID' | 'SIRET' | 'INSURANCE' | 'LICENSE';
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  createdAt: Date;
}

export interface FraudAlert {
  id: string;
  orderId?: string;
  ruleTriggered: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  resolution?: string;
  createdAt: Date;
}

// ------------------------------------------------------------
// 11. Promotions (BrandAdmin & SuperAdmin)
// ------------------------------------------------------------

export interface Promotion {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
  value: number;                      // pourcentage ou montant fixe
  conditions?: string;                // ex: "min order 30€"
  targetSiteIds: string[];            // si vide = tous les sites de la marque
  brandId: string;
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  currentUses: number;
  createdAt: Date;
}

// ------------------------------------------------------------
// 12. Support & Communication
// ------------------------------------------------------------

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt? : Date;
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'CLIENT' | 'SUPPORT' | 'SYSTEM';
  message: string;
  attachmentUrl?: string;
  createdAt: Date;
  deletedAt? : Date;
}

export interface UserVoiceSuggestion {
  id: string;
  authorId: string;
  title: string;
  description: string;
  category: 'FEATURE' | 'IMPROVEMENT' | 'BUG' | 'OTHER';
  status: 'SOUMISE' | 'EN_EXAMEN' | 'PLANIFIEE' | 'EN_COURS' | 'LIVREE' | 'REFUSEE';
  votes: number;
  comments: UserVoiceComment[];
  roadmapItemId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserVoiceComment {
  id: string;
  suggestionId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;                    // HTML
  excerpt?: string;
  authorId: string;
  category: 'NOUVELLES' | 'TUTORIELS' | 'FAQ' | 'SUCCES' | 'RECETTES' | 'TENDANCES';
  tags: string[];
  imageUrl?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  targetSegment: ('CLIENT' | 'DRIVER' | 'RESTAURANT')[];
  questions: SurveyQuestion[];
  isActive: boolean;
  createdAt: Date;
}

export interface SurveyQuestion {
  id: string;
  type: 'OPEN' | 'LIKERT' | 'MULTIPLE_CHOICE';
  text: string;
  options?: string[];                 // pour QCM
  required: boolean;
}

export interface GlobalAnnouncement {
  id: string;
  title: string;
  message: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'INFO';
  channels: ('APP_BANNER' | 'PUSH' | 'EMAIL' | 'BLOG')[];
  targetSegment?: string;
  startAt: Date;
  endAt?: Date;
  createdAt: Date;
}

// ------------------------------------------------------------
// 13. Finances & Relevés (B2B Manager)
// ------------------------------------------------------------

export interface FinancialReport {
  id: string;
  brandId: string;
  periodStart: Date;
  periodEnd: Date;
  grossRevenue: number;
  commissionTotal: number;
  deliveryFees: number;
  netAmount: number;
  transactionCount: number;
  details?: FinancialTransaction[];   // facultatif, pour l'export détaillé
}

export interface FinancialTransaction {
  orderId: string;
  date: Date;
  grossAmount: number;
  commission: number;
  deliveryFee: number;
  tax: number;
  net: number;
}

export interface Payout {
  id: string;
  brandId: string;
  amount: number;
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  settlementDate?: Date;
  invoiceUrl?: string;
  createdAt: Date;
}

// ------------------------------------------------------------
// 14. Système de Roadmap & Reconnaissance
// ------------------------------------------------------------

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  quarter: string;                    // "T1 2026"
  status: 'EN_REFLEXION' | 'PLANIFIEE' | 'EN_DEV' | 'BETA' | 'LIVREE';
  relatedSuggestions: string[];       // ids de UserVoiceSuggestion
  updatedAt: Date;
}

export interface QualityProgram {
  id: string;
  name: string;                       // ex: "Restaurant de l'année"
  criteria: { metric: string; threshold: number }[];
  badgeIconUrl: string;
  startDate: Date;
  endDate: Date;
  winners: string[];                  // brand ids
  createdAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;                     // null si panier anonyme (avant login)
  sessionId: string;                   // pour les utilisateurs non connectés
  siteId: string;
  brandId: string;
  items: CartItem[];
  promotionCode?: string;              // code promo entré par l'utilisateur
  deliveryAddressId?: string;          // pour calculer les frais de livraison
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  expiresAt: Date;                     // un panier expire au bout de X temps
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem { // dois t il etre persisté en db ?
  id : string ;
  productId: string;
  quantity: number;
  selectedOptions: OrderItemOption[];  // réutilise le type existant
}

export interface DeliveryZone {
  id: string;
  siteId: string;
  name: string;                        // ex: "Zone Centre-Ville (3km)"
  polygon: [number, number][];         // Array de [lat, lng] formant le polygone
  deliveryFee: number;                 // frais fixes pour cette zone
  estimatedDeliveryMinutes: number;    // ex: 30
  minimumOrderAmount: number;          // ex: 15€ minimum pour commander ici
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ORDER_UPDATE' | 'PROMO' | 'LOYALTY' | 'DELIVERY' | 'SYSTEM';
  title: string;
  body: string;
  data?: Record<string, unknown>;      // ex: { orderId: "123" } pour rediriger au clic
  isRead: boolean;
  createdAt: Date;
}

export interface TaxRule {
  id: string;
  name: string;                        // "TVA Restauration 10%", "TVA Boissons 20%"
  rate: number;                        // 10.0
  countryCode: string;                 // "FR"
  applicableTo: 'FOOD_PREPARED' | 'ALCOHOL' | 'NON_ALCOHOL' | 'DELIVERY_FEE';
  isActive: boolean;
}


