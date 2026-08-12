//@/app/admin/utilityModel
"use client"
import React from 'react'

function UtilityModelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📋 Guide des Modèles Utilitaires</h1>
      
      {/* PARTIE 1 : TABLES SYSTÈME À SEEDER */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">📊 PARTIE 1 : TABLES SYSTÈME À SEEDER</h2>
        
        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">1. Role - Rôles utilisateurs</h3>
          <CodeBlock 
            language="json"
            code={JSON.stringify([
              { id: "role-super-admin", name: "SUPER_ADMIN" },
              { id: "role-admin", name: "ADMIN" },
              { id: "role-brand-manager", name: "BRAND_MANAGER" },
              { id: "role-customer", name: "CUSTOMER" },
              { id: "role-driver", name: "DRIVER" },
              { id: "role-support", name: "SUPPORT" }
            ], null, 2)}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">2. Permission + PermissionAction - Permissions par module</h3>
          <CodeBlock 
            language="json"
            code={JSON.stringify([
              {
                id: "perm-super-admin-all",
                module: "*",
                roleId: "role-super-admin",
                PermissionAction: [
                  { id: "action-sa-all", value: "ALL" }
                ]
              },
              {
                id: "perm-brand-manager-brand",
                module: "BRAND",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-brand-read", value: "READ" },
                  { id: "action-bm-brand-update", value: "UPDATE" }
                ]
              },
              {
                id: "perm-brand-manager-products",
                module: "PRODUCT",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-products-read", value: "READ" },
                  { id: "action-bm-products-create", value: "CREATE" },
                  { id: "action-bm-products-update", value: "UPDATE" },
                  { id: "action-bm-products-delete", value: "DELETE" }
                ]
              },
              {
                id: "perm-brand-manager-sites",
                module: "SITE",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-sites-read", value: "READ" },
                  { id: "action-bm-sites-create", value: "CREATE" },
                  { id: "action-bm-sites-update", value: "UPDATE" }
                ]
              },
              {
                id: "perm-brand-manager-orders",
                module: "ORDER",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-orders-read", value: "READ" },
                  { id: "action-bm-orders-manage", value: "MANAGE" }
                ]
              },
              {
                id: "perm-brand-manager-stock",
                module: "STOCK",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-stock-read", value: "READ" },
                  { id: "action-bm-stock-update", value: "UPDATE" }
                ]
              },
              {
                id: "perm-brand-manager-promotions",
                module: "PROMOTION",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-promo-read", value: "READ" },
                  { id: "action-bm-promo-create", value: "CREATE" }
                ]
              },
              {
                id: "perm-brand-manager-finances",
                module: "FINANCE",
                roleId: "role-brand-manager",
                PermissionAction: [
                  { id: "action-bm-finance-read", value: "READ" }
                ]
              },
              {
                id: "perm-customer-orders",
                module: "ORDER",
                roleId: "role-customer",
                PermissionAction: [
                  { id: "action-cust-order-create", value: "CREATE" },
                  { id: "action-cust-order-read", value: "READ_OWN" }
                ]
              },
              {
                id: "perm-customer-profile",
                module: "PROFILE",
                roleId: "role-customer",
                PermissionAction: [
                  { id: "action-cust-profile-read", value: "READ" },
                  { id: "action-cust-profile-update", value: "UPDATE" }
                ]
              },
              {
                id: "perm-driver-deliveries",
                module: "DELIVERY",
                roleId: "role-driver",
                PermissionAction: [
                  { id: "action-driver-delivery-read", value: "READ_OWN" },
                  { id: "action-driver-delivery-update", value: "UPDATE_STATUS" }
                ]
              },
              {
                id: "perm-support-tickets",
                module: "SUPPORT",
                roleId: "role-support",
                PermissionAction: [
                  { id: "action-support-read", value: "READ" },
                  { id: "action-support-respond", value: "RESPOND" }
                ]
              }
            ], null, 2)}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">3. LoyaltyProgramConfig - Configuration fidélité</h3>
          <CodeBlock 
            language="json"
            code={JSON.stringify([{
              id: "loyalty-config-default",
              pointsPerEuro: 1.0,
              levelThresholdsBronze: 0,
              levelThresholdsSilver: 500,
              levelThresholdsGold: 2000,
              levelThresholdsPlatinum: 5000,
              referralRewardAmount: 5.0,
              referralRewardCurrency: "EUR",
              LoyaltyReward: [
                {
                  id: "reward-bronze",
                  level: "BRONZE",
                  description: "Accès aux offres de base"
                },
                {
                  id: "reward-silver",
                  level: "SILVER",
                  description: "Livraison gratuite une fois par mois"
                },
                {
                  id: "reward-gold",
                  level: "GOLD",
                  description: "10% de réduction sur toutes les commandes"
                },
                {
                  id: "reward-platinum",
                  level: "PLATINUM",
                  description: "Accès prioritaire + 15% de réduction + Cadeaux exclusifs"
                }
              ]
            }], null, 2)}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">4. TaxRule - Règles de taxes</h3>
          <CodeBlock 
            language="json"
            code={JSON.stringify([
              {
                id: "tax-fr-standard",
                name: "TVA France Standard",
                rate: 20.0,
                countryCode: "FR",
                applicableTo: "PRODUCT",
                isActive: true
              },
              {
                id: "tax-fr-reduced",
                name: "TVA France Réduite",
                rate: 10.0,
                countryCode: "FR",
                applicableTo: "PRODUCT",
                isActive: true
              },
              {
                id: "tax-fr-super-reduced",
                name: "TVA France Super Réduite",
                rate: 5.5,
                countryCode: "FR",
                applicableTo: "PRODUCT",
                isActive: true
              },
              {
                id: "tax-fr-delivery",
                name: "TVA Livraison France",
                rate: 20.0,
                countryCode: "FR",
                applicableTo: "DELIVERY",
                isActive: true
              },
              {
                id: "tax-fr-service",
                name: "TVA Frais de service France",
                rate: 20.0,
                countryCode: "FR",
                applicableTo: "SERVICE_FEE",
                isActive: true
              }
            ], null, 2)}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">5. GlobalAnnouncement - Annonces globales</h3>
          <CodeBlock 
            language="json"
            code={JSON.stringify([{
              id: "announce-welcome",
              title: "Bienvenue sur notre plateforme !",
              message: "Découvrez les meilleurs restaurants près de chez vous. Commandez en quelques clics et suivez votre livraison en temps réel.",
              importance: "INFO",
              targetSegment: "ALL",
              startAt: "2024-01-01T00:00:00Z",
              endAt: "2024-12-31T23:59:59Z",
              AnnouncementChannel: [
                { id: "channel-app-welcome", value: "APP" },
                { id: "channel-web-welcome", value: "WEB" }
              ]
            }], null, 2)}
          />
        </section>
      </div>

      {/* PARTIE 2 : MODÈLES UTILITAIRES */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">🎨 PARTIE 2 : MODÈLES UTILITAIRES</h2>
        
        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">BrandType - Types de marques</h3>
          <CodeBlock 
            language="typescript"
            code={`// Modèle BrandType dans le schéma Prisma
model BrandType {
  id      String @id
  value   String
  brandId String
  Brand   Brand  @relation(fields: [brandId], references: [id], onDelete: Cascade)
}

// Liste des BrandType prédéfinis
const BRAND_TYPES = [
  "RESTAURANT",
  "FAST_FOOD",
  "CAFE",
  "BAR",
  "BOULANGERIE",
  "PATISSERIE",
  "TRAITEUR",
  "FOOD_TRUCK",
  "EPICERIE",
  "SUPERMARCHE"
] as const;`}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">Organisation des produits - CategoryProduct</h3>
          <CodeBlock 
            language="typescript"
            code={`// Structure des catégories de produits
model CategoryProduct {
  id           String @id
  name         String         // "Entrées", "Plats", "Desserts"
  categoryType String         // "FOOD", "DRINK", "MENU"
  orderdisplay Int    @default(0)
  description  String @default("")
  image        String?

  productAssignments CategoryAssignmentProduct[]
}

// Table de liaison Produit ↔ Catégorie
model CategoryAssignmentProduct {
  id                String @id
  productId         String
  categoryProductId String

  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryProduct CategoryProduct @relation(fields: [categoryProductId], references: [id], onDelete: Cascade)

  @@unique([productId, categoryProductId])
}

// Exemple de catégories pour un restaurant
const SAMPLE_CATEGORIES = [
  {
    id: "cat-entrees",
    name: "Entrées",
    categoryType: "FOOD",
    orderdisplay: 1,
    description: "Entrées et apéritifs"
  },
  {
    id: "cat-plats",
    name: "Plats principaux",
    categoryType: "FOOD",
    orderdisplay: 2,
    description: "Plats principaux"
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    categoryType: "FOOD",
    orderdisplay: 3,
    description: "Desserts et pâtisseries"
  },
  {
    id: "cat-boissons",
    name: "Boissons",
    categoryType: "DRINK",
    orderdisplay: 4,
    description: "Boissons chaudes et froides"
  },
  {
    id: "cat-menus",
    name: "Menus",
    categoryType: "MENU",
    orderdisplay: 5,
    description: "Menus combinés"
  }
];`}
          />
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-medium mb-4">Listes à fournir dans les formulaires</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Pays (Code ISO, Drapeau, Indicatif)</h4>
            <CodeBlock 
              language="typescript"
              code={`// Structure pour les pays avec codes ISO, drapeaux et indicatifs téléphoniques
const COUNTRIES = [
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    phoneCode: "+33",
    currency: "EUR",
    languages: ["fr"]
  },
  {
    code: "BE",
    name: "Belgique",
    flag: "🇧🇪",
    phoneCode: "+32",
    currency: "EUR",
    languages: ["fr", "nl", "de"]
  },
  {
    code: "CH",
    name: "Suisse",
    flag: "🇨🇭",
    phoneCode: "+41",
    currency: "CHF",
    languages: ["fr", "de", "it"]
  },
  {
    code: "LU",
    name: "Luxembourg",
    flag: "🇱🇺",
    phoneCode: "+352",
    currency: "EUR",
    languages: ["fr", "de", "lb"]
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    phoneCode: "+1",
    currency: "CAD",
    languages: ["fr", "en"]
  }
] as const;`}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Types d'adresses</h4>
            <CodeBlock 
              language="typescript"
              code={`// Types d'adresses disponibles
const ADDRESS_TYPES = [
  "deliveryAddress",
  "billingAddress",
  "workAddress",
  "homeAddress"
] as const;

// Types d'adresses dans le modèle
// model Address {
//   ...
//   typeAdress String @default("deliveryAddress")
//   ...
// }`}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Statuts de commande</h4>
            <CodeBlock 
              language="typescript"
              code={`// Statuts de commande possibles
const ORDER_STATUSES = [
  "CREATED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "IN_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
] as const;

// Statuts de livraison
const DELIVERY_STATUSES = [
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED",
  "DELIVERED",
  "FAILED"
] as const;`}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Niveaux de fidélité</h4>
            <CodeBlock 
              language="typescript"
              code={`// Niveaux du programme de fidélité
const LOYALTY_LEVELS = [
  {
    level: "BRONZE",
    minPoints: 0,
    color: "#CD7F32",
    benefits: ["Accès aux offres de base"]
  },
  {
    level: "SILVER",
    minPoints: 500,
    color: "#C0C0C0",
    benefits: ["Livraison gratuite une fois par mois", "Offres exclusives"]
  },
  {
    level: "GOLD",
    minPoints: 2000,
    color: "#FFD700",
    benefits: ["10% de réduction sur toutes les commandes", "Support prioritaire"]
  },
  {
    level: "PLATINUM",
    minPoints: 5000,
    color: "#E5E4E2",
    benefits: ["15% de réduction", "Accès prioritaire", "Cadeaux exclusifs"]
  }
] as const;`}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Jours de la semaine (pour OpeningHours)</h4>
            <CodeBlock 
              language="typescript"
              code={`// Jours de la semaine pour les horaires d'ouverture
const DAYS_OF_WEEK = [
  { value: 0, label: "Dimanche", shortLabel: "Dim" },
  { value: 1, label: "Lundi", shortLabel: "Lun" },
  { value: 2, label: "Mardi", shortLabel: "Mar" },
  { value: 3, label: "Mercredi", shortLabel: "Mer" },
  { value: 4, label: "Jeudi", shortLabel: "Jeu" },
  { value: 5, label: "Vendredi", shortLabel: "Ven" },
  { value: 6, label: "Samedi", shortLabel: "Sam" }
] as const;`}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Méthodes de paiement</h4>
            <CodeBlock 
              language="typescript"
              code={`// Méthodes de paiement acceptées
const PAYMENT_METHODS = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PAYPAL",
  "APPLE_PAY",
  "GOOGLE_PAY",
  "BANK_TRANSFER",
  "CASH_ON_DELIVERY"
] as const;`}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

// Composant pour afficher des blocs de code avec coloration syntaxique
function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-gray-400 text-sm">{language.toUpperCase()}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-gray-100 text-sm`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

// Composant pour le bouton de copie
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
    >
      {copied ? '✓ Copié !' : '📋 Copier'}
    </button>
  )
}

export default UtilityModelPage