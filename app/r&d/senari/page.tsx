//@/app/r&d/senarie/page.tsx
/*
 role : Page de documentation des scénarios fonctionnels.
        Présente les parcours utilisateurs, les personas concernés,
        et les étapes détaillées de chaque scénario.
        Sert de base à la validation fonctionnelle et aux tests E2E.
 import:
   - lucide-react : ArrowRight, CheckCircle2, ClipboardList, UserRound
   - shadcn/ui : Card, CardContent, CardDescription, CardHeader, CardTitle, Badge
   - @/lib/data/personaData : personas, Persona
 useBy : Route /r&d/senarie (cette page)
*/

/*
 ARCHITECTURE & FLUX DE DONNÉES :
 - Rôle des sections :
   * Header : badge "Documentation fonctionnelle", titre, description.
   * Liste des scénarios : chaque scénario affiche son persona, ses étapes et son statut.
   * Carte Persona : icône, nom et description du persona (depuis personaData.ts).
   * Étapes : liste numérotée avec cercle, ligne de connexion, titre et description.
   * Pied de carte : compteur d'étapes, bouton "Voir le scénario".
 - Choix techniques :
   * Client Component ('use client') pour l'interactivité future (filtres, recherche).
   * Données personas importées depuis @/lib/data/personaData.ts (source unique).
   * Scénarios définis en constante typée Senari[] avec référence au Persona.
   * Helper getStatusLabel() pour l'affichage du statut.
 - Flux de données :
   * personas (import) → utilisé dans les scénarios via scenario.persona.
   * scenarios (constante) → map() → Card par scénario.
   * Aucun état local pour l'instant (évolution possible : filtres, recherche).
 - Interactions UX :
   * Badges de statut colorés (brouillon, valide, en_test).
   * Numérotation visuelle des étapes avec ligne de connexion.
   * Bouton "Voir le scénario" avec icône fléchée (action à implémenter).
*/

/* IMPERATIF : 
Architecture de l'ensemble des fichiers impliqués dans le fonctionnement de la feature
Liste des chemins des fichiers :
- /app/r&d/senarie/page.tsx (ce fichier)
- /lib/data/personaData.ts (données des personas)
*/

'use client';

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  UserRound,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { type Persona, personas } from '@/lib/data/personaDaata';

/* ============================================================
   TYPES
   ============================================================ */

interface ScenarioStep {
  id: string;
  titre: string;
  description: string;
}

interface Senari {
  id: string;
  titre: string;
  description: string;
  persona: Persona;
  steps: ScenarioStep[];
  statut?: 'brouillon' | 'valide' | 'en_test';
}

/* ============================================================
   DONNÉES
   ============================================================ */

const scenarios: Senari[] = [
  {
    id: 'SCN-001',
    titre: 'Créer un compte client',
    description:
      'Permettre à un nouveau client de créer son compte afin d\'utiliser les fonctionnalités de l\'application.',
    persona: personas[0], // FinalClient
    steps: [
      {
        id: 'STEP-001',
        titre: 'Accéder à l\'inscription',
        description:
          'Le client ouvre la page d\'inscription depuis la page de connexion.',
      },
      {
        id: 'STEP-002',
        titre: 'Saisir ses informations',
        description:
          'Le client renseigne son nom, son adresse email et son mot de passe.',
      },
      {
        id: 'STEP-003',
        titre: 'Accepter les conditions',
        description:
          'Le client accepte les conditions générales d\'utilisation.',
      },
      {
        id: 'STEP-004',
        titre: 'Créer le compte',
        description:
          'Le système valide les données et crée le compte utilisateur.',
      },
      {
        id: 'STEP-005',
        titre: 'Accéder à son espace',
        description:
          'Le client est connecté et peut accéder à son espace personnel.',
      },
    ],
    statut: 'valide',
  },
  {
    id: 'SCN-002',
    titre: 'Passer une commande',
    description:
      'Permettre à un client connecté de sélectionner des produits et de valider une commande.',
    persona: personas[0], // FinalClient
    steps: [
      {
        id: 'STEP-001',
        titre: 'Consulter le catalogue',
        description: 'Le client consulte les produits disponibles.',
      },
      {
        id: 'STEP-002',
        titre: 'Ajouter des produits',
        description: 'Le client ajoute les produits souhaités à son panier.',
      },
      {
        id: 'STEP-003',
        titre: 'Vérifier le panier',
        description:
          'Le client vérifie les quantités, les prix et le montant total.',
      },
      {
        id: 'STEP-004',
        titre: 'Choisir une adresse',
        description: 'Le client sélectionne son adresse de livraison.',
      },
      {
        id: 'STEP-005',
        titre: 'Valider la commande',
        description:
          'Le client confirme sa commande et procède au paiement.',
      },
    ],
    statut: 'brouillon',
  },
  {
    id: 'SCN-003',
    titre: 'Gérer les horaires d\'ouverture',
    description:
      'Permettre au responsable de site de définir les horaires d\'ouverture de son établissement.',
    persona: personas[2], // SiteManager
    steps: [
      {
        id: 'STEP-001',
        titre: 'Accéder à la gestion du site',
        description:
          'Le responsable se connecte et accède au tableau de bord de son site.',
      },
      {
        id: 'STEP-002',
        titre: 'Ouvrir les paramètres',
        description:
          'Il navigue vers la section "Horaires d\'ouverture".',
      },
      {
        id: 'STEP-003',
        titre: 'Définir les plages horaires',
        description:
          'Pour chaque jour, il saisit les heures d\'ouverture et de fermeture.',
      },
      {
        id: 'STEP-004',
        titre: 'Enregistrer les modifications',
        description:
          'Le système valide et enregistre les nouveaux horaires.',
      },
    ],
    statut: 'valide',
  },
  {
    id: 'SCN-004',
    titre: 'Accepter une livraison',
    description:
      'Permettre au livreur de confirmer la prise en charge et la livraison d\'une commande.',
    persona: personas[1], // Driver
    steps: [
      {
        id: 'STEP-001',
        titre: 'Recevoir une notification',
        description:
          'Le livreur reçoit une notification de nouvelle commande à livrer.',
      },
      {
        id: 'STEP-002',
        titre: 'Accepter la course',
        description:
          'Il accepte la course et se rend au restaurant.',
      },
      {
        id: 'STEP-003',
        titre: 'Récupérer la commande',
        description:
          'Il valide la récupération avec le code OTP.',
      },
      {
        id: 'STEP-004',
        titre: 'Livrer la commande',
        description:
          'Il se rend à l\'adresse et remet la commande au client.',
      },
      {
        id: 'STEP-005',
        titre: 'Confirmer la livraison',
        description:
          'Il confirme la livraison et prend une photo comme preuve.',
      },
    ],
    statut: 'brouillon',
  },
  {
    id: 'SCN-005',
    titre: 'Créer une promotion',
    description:
      'Permettre au gestionnaire de marque de créer une campagne promotionnelle.',
    persona: personas[3], // BrandManager
    steps: [
      {
        id: 'STEP-001',
        titre: 'Accéder au dashboard marketing',
        description:
          'Le gestionnaire accède à la section promotions de sa marque.',
      },
      {
        id: 'STEP-002',
        titre: 'Définir le type de promotion',
        description:
          'Il choisit entre pourcentage, montant fixe ou offre spéciale.',
      },
      {
        id: 'STEP-003',
        titre: 'Configurer les conditions',
        description:
          'Il définit le code promo, la valeur, les dates et les sites concernés.',
      },
      {
        id: 'STEP-004',
        titre: 'Publier la promotion',
        description:
          'La promotion est activée et visible pour les clients.',
      },
    ],
    statut: 'en_test',
  },
  {
    id: 'SCN-006',
    titre: 'Traiter un ticket de support',
    description:
      'Permettre à l\'agent de support de répondre à une demande client.',
    persona: personas[6], // ClientSupport
    steps: [
      {
        id: 'STEP-001',
        titre: 'Consulter les tickets',
        description:
          'L\'agent ouvre la file des tickets en attente.',
      },
      {
        id: 'STEP-002',
        titre: 'Analyser la demande',
        description:
          'Il lit le message du client et consulte l\'historique de commande.',
      },
      {
        id: 'STEP-003',
        titre: 'Répondre au client',
        description:
          'Il envoie une réponse via le chat de support.',
      },
      {
        id: 'STEP-004',
        titre: 'Résoudre ou escalader',
        description:
          'Il résout le ticket ou le transfère au service concerné.',
      },
    ],
    statut: 'valide',
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Retourne le libellé d'affichage d'un statut de scénario.
 */
function getStatusLabel(status: Senari['statut']): string {
  switch (status) {
    case 'valide':
      return 'Validé';
    case 'en_test':
      return 'En test';
    case 'brouillon':
    default:
      return 'Brouillon';
  }
}

/**
 * Retourne la variante de Badge selon le statut.
 */
function getStatusVariant(
  status: Senari['statut']
): 'default' | 'outline' | 'secondary' {
  switch (status) {
    case 'valide':
      return 'default';
    case 'en_test':
      return 'secondary';
    case 'brouillon':
    default:
      return 'outline';
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function SenariePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-gray-950 dark:via-gray-950 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            HEADER
            ====================================================== */}
        <header className="mb-10">
          <Badge
            variant="outline"
            className="mb-4 border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950/40 dark:text-pink-300"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Documentation fonctionnelle
          </Badge>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Scénarios
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Définition des parcours utilisateurs, des personas et des étapes
            fonctionnelles permettant de valider le comportement de
            l&apos;application.
          </p>

          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            {scenarios.length} scénarios documentés
          </p>
        </header>

        {/* ======================================================
            LISTE DES SCÉNARIOS
            ====================================================== */}
        <section className="grid gap-6 lg:grid-cols-2">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="overflow-hidden border-slate-200/70 bg-white/90 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-3 font-mono text-xs">
                      {scenario.id}
                    </Badge>

                    <CardTitle className="text-xl">
                      {scenario.titre}
                    </CardTitle>

                    <CardDescription className="mt-2 leading-6">
                      {scenario.description}
                    </CardDescription>
                  </div>

                  {scenario.statut && (
                    <Badge variant={getStatusVariant(scenario.statut)}>
                      {getStatusLabel(scenario.statut)}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* ==================================================
                    PERSONA
                    ================================================== */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Persona
                      </p>

                      <p className="font-semibold text-slate-900 dark:text-white">
                        {scenario.persona.label}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {scenario.persona.description}
                  </p>
                </div>

                {/* ==================================================
                    ÉTAPES
                    ================================================== */}
                <div>
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Parcours
                  </h2>

                  <div className="space-y-3">
                    {scenario.steps.map((step, index) => (
                      <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {index + 1}
                          </div>

                          {index < scenario.steps.length - 1 && (
                            <div className="mt-1 h-full w-px bg-slate-200 dark:bg-slate-800" />
                          )}
                        </div>

                        <div className="pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {step.titre}
                            </h3>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ==================================================
                    PIED DE CARTE
                    ================================================== */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    {scenario.steps.length} étape
                    {scenario.steps.length > 1 ? 's' : ''}
                  </span>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Voir le scénario
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}