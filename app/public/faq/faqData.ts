// app/public/faq/faqData.ts

/* page d'aide - FAQ Publique */

export interface PublicFaq {
  id: string;
  user: "CLIENT" | "DRIVER" | "PRO";
  question: string;
  answer: string;
}

export const publicFaq: PublicFaq[] = [
  // ============================================================
  // SECTION CLIENT
  // ============================================================
  {
    id: "faq-client-001",
    user: "CLIENT",
    question: "Comment créer un compte sur l'application ?",
    answer:
      "Pour créer un compte, téléchargez l'application depuis l'App Store ou Google Play. Ouvrez l'application et cliquez sur 'S'inscrire'. Remplissez le formulaire avec votre nom, adresse e-mail et un mot de passe sécurisé. Vous recevrez un e-mail de confirmation pour vérifier votre compte. Vous pouvez également vous inscrire via Google ou Apple pour plus de rapidité.",
  },
  {
    id: "faq-client-002",
    user: "CLIENT",
    question: "Comment passer une commande ?",
    answer:
      "Pour passer une commande :\n1. Connectez-vous à votre compte\n2. Sélectionnez votre adresse de livraison ou autorisez la géolocalisation\n3. Parcourez les marques et restaurants disponibles autour de vous\n4. Choisissez vos produits et ajoutez-les au panier\n5. Personnalisez votre commande (options, suppléments, instructions spéciales)\n6. Validez votre panier et procédez au paiement\n7. Suivez votre commande en temps réel depuis l'application",
  },
  {
    id: "faq-client-003",
    user: "CLIENT",
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons plusieurs moyens de paiement :\n• Carte bancaire (Visa, Mastercard, American Express)\n• Apple Pay\n• Google Pay\n• PayPal\n• Portefeuille électronique de l'application\n\nTous les paiements sont sécurisés et cryptés. Vous pouvez enregistrer plusieurs moyens de paiement dans votre profil pour plus de commodité.",
  },
  {
    id: "faq-client-004",
    user: "CLIENT",
    question: "Comment suivre ma commande en temps réel ?",
    answer:
      "Une fois votre commande confirmée, vous pouvez la suivre en temps réel depuis la section 'Mes commandes' de l'application. Vous verrez :\n• La confirmation de la commande\n• La préparation par le restaurant\n• Le statut du livreur en temps réel sur une carte\n• L'estimation du temps de livraison\n• La notification lorsque le livreur est proche\n\nVous recevrez également des notifications push à chaque changement de statut.",
  },
  {
    id: "faq-client-005",
    user: "CLIENT",
    question: "Puis-je modifier ou annuler ma commande ?",
    answer:
      "Vous pouvez modifier ou annuler votre commande uniquement avant qu'elle ne soit acceptée par le restaurant. Une fois la commande acceptée et en préparation, les modifications ne sont plus possibles. Pour annuler, rendez-vous dans 'Mes commandes', sélectionnez la commande concernée et cliquez sur 'Annuler'. Les conditions d'annulation et de remboursement sont précisées dans nos Conditions Générales d'Utilisation.",
  },
  {
    id: "faq-client-006",
    user: "CLIENT",
    question: "Comment fonctionnent les codes promotionnels ?",
    answer:
      "Les codes promotionnels vous offrent des réductions sur vos commandes. Pour les utiliser :\n1. Ajoutez vos produits au panier\n2. Avant de valider, cliquez sur 'Ajouter un code promo'\n3. Saisissez votre code et validez\n4. La réduction s'appliquera automatiquement sur le total\n\nVérifiez les conditions d'utilisation : certains codes ont une valeur minimale de commande, une date d'expiration ou sont limités à certaines marques.",
  },
  {
    id: "faq-client-007",
    user: "CLIENT",
    question: "Comment gérer mes adresses de livraison ?",
    answer:
      "Depuis votre profil, accédez à la section 'Mes adresses'. Vous pouvez :\n• Ajouter une nouvelle adresse (domicile, travail, autre)\n• Modifier une adresse existante\n• Définir une adresse par défaut\n• Ajouter des instructions de livraison (code d'accès, étage, interphone)\n• Enregistrer vos coordonnées GPS précises pour faciliter la livraison\n\nVous pouvez avoir plusieurs adresses enregistrées pour plus de flexibilité.",
  },
  {
    id: "faq-client-008",
    user: "CLIENT",
    question: "Comment fonctionne le programme de fidélité ?",
    answer:
      "Notre programme de fidélité vous récompense à chaque commande :\n• Gagnez des points pour chaque euro dépensé\n• Les points s'accumulent automatiquement sur votre compte\n• Débloquez des niveaux : Bronze, Argent, Or et Platine\n• Chaque niveau offre des avantages exclusifs (livraison gratuite, réductions, offres spéciales)\n• Échangez vos points contre des réductions sur vos prochaines commandes\n\nConsultez votre solde de points dans la section 'Fidélité' de votre profil.",
  },
  {
    id: "faq-client-009",
    user: "CLIENT",
    question: "Que faire si je rencontre un problème avec ma commande ?",
    answer:
      "Si vous rencontrez un problème (article manquant, erreur, qualité) :\n1. Allez dans 'Mes commandes' et sélectionnez la commande concernée\n2. Cliquez sur 'Signaler un problème'\n3. Décrivez précisément le problème rencontré\n4. Joignez une photo si possible\n5. Notre équipe analysera votre réclamation dans les plus brefs délais\n\nVous pouvez également contacter le support client directement depuis le chat intégré à l'application.",
  },
  {
    id: "faq-client-010",
    user: "CLIENT",
    question: "Comment laisser un avis sur un restaurant ou un produit ?",
    answer:
      "Après chaque commande livrée, vous recevrez une notification vous invitant à laisser un avis. Vous pouvez également :\n• Aller dans 'Mes commandes'\n• Sélectionner la commande terminée\n• Cliquer sur 'Laisser un avis'\n• Noter le restaurant et/ou le livreur\n• Ajouter un commentaire et une photo\n• Votre avis aide la communauté et les marques à s'améliorer\n\nVous pouvez signaler un avis inapproprié via l'option dédiée.",
  },

  // ============================================================
  // SECTION LIVREUR
  // ============================================================
  {
    id: "faq-driver-001",
    user: "DRIVER",
    question: "Comment devenir livreur partenaire ?",
    answer:
      "Pour devenir livreur partenaire :\n1. Téléchargez l'application et sélectionnez 'Devenir livreur'\n2. Créez votre compte avec vos informations personnelles\n3. Téléchargez les documents KYC nécessaires (pièce d'identité, justificatif de domicile, permis de conduire si véhicule)\n4. Renseignez vos coordonnées bancaires pour les paiements\n5. Une fois validé par notre équipe, vous pourrez commencer à accepter des livraisons\n\nLe processus de validation prend généralement 24 à 48 heures.",
  },
  {
    id: "faq-driver-002",
    user: "DRIVER",
    question: "Comment accepter et gérer les livraisons ?",
    answer:
      "Pour gérer vos livraisons :\n• Passez en statut 'En ligne' pour recevoir des propositions de livraison\n• Une notification s'affiche avec les détails : restaurant, distance, montant estimé\n• Acceptez ou refusez la livraison\n• Une fois acceptée, rendez-vous au point de retrait\n• Récupérez la commande et validez le code OTP\n• Suivez l'itinéraire optimisé vers le client\n• Livrez la commande et validez la livraison avec le code OTP client\n• La transaction est automatiquement enregistrée dans votre historique",
  },
  {
    id: "faq-driver-003",
    user: "DRIVER",
    question: "Comment sont calculés mes revenus ?",
    answer:
      "Vos revenus sont calculés selon plusieurs facteurs :\n• Tarif de base par livraison\n• Bonus kilométrique selon la distance parcourue\n• Majorations aux heures de pointe ou conditions météorologiques\n• Pourboires des clients (intégralement reversés)\n• Bonus de performance et challenges ponctuels\n\nVous pouvez consulter le détail de chaque course et vos gains cumulés dans la section 'Mes revenus'. Les paiements sont effectués chaque semaine sur votre compte bancaire.",
  },
  {
    id: "faq-driver-004",
    user: "DRIVER",
    question: "Comment gérer mes disponibilités ?",
    answer:
      "Vous avez un contrôle total sur vos horaires :\n• Connectez-vous et déconnectez-vous librement\n• Définissez vos créneaux de disponibilité récurrents dans vos paramètres\n• L'application s'adapte à votre emploi du temps\n• Aucun minimum d'heures requis\n• Vous pouvez faire une pause à tout moment\n\nPlanifiez vos sessions pour optimiser vos revenus pendant les périodes de forte demande.",
  },
  {
    id: "faq-driver-005",
    user: "DRIVER",
    question: "Que faire en cas de problème lors d'une livraison ?",
    answer:
      "En cas de problème lors d'une livraison :\n• Client absent : utilisez le minuteur d'attente intégré, puis contactez le support\n• Adresse introuvable : contactez le client via le chat ou l'appel intégré\n• Commande endommagée : signalez-le immédiatement via l'option 'Signaler un problème'\n• Accident ou incident : contactez les secours si nécessaire, puis le support prioritaire\n• Vous avez accès à un chat d'urgence avec notre équipe support 24h/24 et 7j/7",
  },

  // ============================================================
  // SECTION PROFESSIONNEL (MARQUE)
  // ============================================================
  {
    id: "faq-pro-001",
    user: "PRO",
    question: "Comment référencer mon établissement sur la plateforme ?",
    answer:
      "Pour référencer votre établissement :\n1. Rendez-vous sur notre portail partenaire ou contactez notre équipe commerciale\n2. Créez votre compte professionnel\n3. Renseignez les informations de votre établissement : nom, adresse, horaires, description\n4. Téléchargez votre logo, photos et carte/menu\n5. Configurez vos produits, prix et options\n6. Définissez vos zones de livraison et frais\n7. Une fois validé, votre établissement sera visible sur l'application\n\nNotre équipe vous accompagne dans la configuration initiale.",
  },
  {
    id: "faq-pro-002",
    user: "PRO",
    question: "Comment gérer mon menu et mes produits ?",
    answer:
      "Depuis votre espace professionnel, vous pouvez gérer votre offre en temps réel :\n• Ajouter, modifier ou supprimer des produits\n• Mettre à jour les prix et descriptions\n• Gérer les stocks et rendre des produits indisponibles\n• Créer des menus composés (entrée + plat + dessert)\n• Ajouter des options personnalisables (suppléments, choix)\n• Mettre à jour les informations nutritionnelles et allergènes\n• Organiser vos catégories de produits\n\nToutes les modifications sont appliquées instantanément sur l'application.",
  },
  {
    id: "faq-pro-003",
    user: "PRO",
    question: "Comment fonctionnent les commissions et les paiements ?",
    answer:
      "Le système de commission est transparent :\n• Commission standard de X% sur chaque commande (hors frais de livraison)\n• Pas de frais d'inscription ni d'abonnement mensuel\n• Les paiements sont effectués chaque [période : quinzaine/mois]\n• Vous avez accès à un tableau de bord financier détaillé\n• Relevés de transactions téléchargeables\n• Facturation automatisée\n\nConsultez votre contrat partenaire pour le détail des conditions commerciales spécifiques à votre établissement.",
  },
  {
    id: "faq-pro-004",
    user: "PRO",
    question: "Comment gérer les commandes entrantes ?",
    answer:
      "La gestion des commandes se fait via :\n• L'application dédiée professionnel (tablette recommandée)\n• Notifications sonores et visuelles à chaque nouvelle commande\n• Acceptation automatique ou manuelle selon votre configuration\n• Délai de préparation configurable\n• Impression automatique des tickets (si imprimante connectée)\n• Possibilité de marquer les articles épuisés en temps réel\n• Communication directe avec le livreur et le client si nécessaire",
  },
  {
    id: "faq-pro-005",
    user: "PRO",
    question: "Comment optimiser ma visibilité sur la plateforme ?",
    answer:
      "Pour maximiser votre visibilité :\n• Soignez vos photos : des visuels de qualité attirent plus de clients\n• Maintenez une note élevée : la qualité de service et des produits est primordiale\n• Proposez des promotions ponctuelles pour attirer de nouveaux clients\n• Participez aux programmes qualité pour obtenir des badges\n• Mettez régulièrement à jour votre menu avec des offres saisonnières\n• Répondez aux avis clients pour montrer votre engagement\n• Optimisez vos temps de préparation pour un meilleur classement\n\nNotre algorithme favorise les établissements offrant la meilleure expérience client.",
  },
  {
    id: "faq-pro-006",
    user: "PRO",
    question: "Comment créer et gérer des promotions ?",
    answer:
      "Depuis votre tableau de bord professionnel :\n1. Allez dans la section 'Marketing' > 'Promotions'\n2. Créez une nouvelle promotion\n3. Définissez le type (pourcentage, montant fixe, livraison offerte, produit offert)\n4. Configurez les conditions (montant minimum, première commande, créneau horaire)\n5. Définissez la période de validité (dates et heures)\n6. Limitez le nombre d'utilisations si nécessaire\n7. Choisissez les sites concernés par la promotion\n\nSuivez les performances de vos promotions dans votre tableau de bord analytique.",
  },
  {
    id: "faq-pro-007",
    user: "PRO",
    question: "Comment consulter mes rapports financiers et analytiques ?",
    answer:
      "Votre espace professionnel offre des outils d'analyse complets :\n• Tableau de bord en temps réel (commandes, chiffre d'affaires)\n• Rapports financiers par période (jour, semaine, mois, personnalisé)\n• Analyse des produits les plus vendus\n• Suivi de la satisfaction client (notes, avis)\n• Comparaison période à période\n• Export des données (CSV, PDF)\n• Indicateurs de performance clés (panier moyen, délai moyen, taux de conversion)\n\nCes données vous aident à piloter votre activité et prendre les bonnes décisions.",
  },
  {
    id: "faq-pro-008",
    user: "PRO",
    question: "Comment gérer les litiges et réclamations clients ?",
    answer:
      "En cas de litige ou réclamation :\n• Les clients peuvent signaler un problème directement depuis l'application\n• Vous recevez une notification dans votre espace professionnel\n• Vous pouvez consulter le détail de la réclamation\n• Répondez au client avec une solution (remboursement partiel, geste commercial, explication)\n• Notre équipe de médiation peut intervenir si nécessaire\n• Gardez une trace de tous les échanges\n\nUne résolution rapide et satisfaisante des litiges améliore votre note et fidélise les clients.",
  },
  {
    id: "faq-pro-009",
    user: "PRO",
    question: "Puis-je utiliser mes propres livreurs ?",
    answer:
      "Oui, la plateforme offre deux options de livraison :\n• Livraison par nos livreurs partenaires (service inclus dans la commission)\n• Livraison par votre propre flotte de livreurs (auto-livraison)\n\nPour l'auto-livraison :\n• Configurez l'option dans vos paramètres\n• Gérez vos livreurs et leurs statuts\n• Les frais de livraison vous reviennent directement\n• Vous gardez le contrôle total sur la qualité du service de livraison\n\nVous pouvez également mixer les deux options selon vos besoins et créneaux horaires.",
  },
  {
    id: "faq-pro-010",
    user: "PRO",
    question: "Comment participer au programme qualité et obtenir des badges ?",
    answer:
      "Le programme qualité récompense l'excellence :\n• Des critères objectifs sont évalués automatiquement (note client, délai de préparation, taux d'acceptation, annulations)\n• Chaque trimestre, les établissements excellents reçoivent des badges (Top Qualité, Coup de Cœur, etc.)\n• Les badges sont affichés sur votre page établissement\n• Ils augmentent votre visibilité et attirent plus de clients\n• Consultez les critères dans votre espace 'Programme Qualité'\n• Suivez vos progrès et identifiez les axes d'amélioration",
  },

  // ============================================================
  // SECTION GÉNÉRALE (tous utilisateurs)
  // ============================================================
  {
    id: "faq-general-001",
    user: "CLIENT",
    question: "Comment contacter le support client ?",
    answer:
      "Notre support client est disponible 24h/24 et 7j/7 :\n• Chat en direct depuis l'application (recommandé pour une réponse rapide)\n• Formulaire de contact dans la section 'Aide'\n• E-mail : support@votreapp.com\n• Téléphone : numéro disponible dans l'application\n• FAQ intégrée avec recherche par mots-clés\n\nPour les urgences, privilégiez le chat en direct ou l'appel téléphonique.",
  },
  {
    id: "faq-general-002",
    user: "CLIENT",
    question: "Comment supprimer mon compte ?",
    answer:
      "Pour supprimer votre compte :\n1. Allez dans 'Paramètres' > 'Confidentialité'\n2. Sélectionnez 'Supprimer mon compte'\n3. Confirmez votre demande\n4. Vos données seront supprimées conformément à notre politique de confidentialité\n\nAttention : la suppression est irréversible. Les données liées aux commandes sont conservées pour des obligations légales. Vous pouvez également choisir de simplement désactiver votre compte temporairement.",
  },
  {
    id: "faq-general-003",
    user: "CLIENT",
    question: "Comment sont protégées mes données personnelles ?",
    answer:
      "La protection de vos données est notre priorité :\n• Toutes les données sont cryptées (HTTPS, chiffrement au repos)\n• Conformité RGPD : droit d'accès, rectification, suppression\n• Aucune revente de données à des tiers\n• Authentification sécurisée (2FA disponible)\n• Conservation limitée des données\n• Politique de confidentialité détaillée disponible dans l'application\n\nPour toute question sur vos données, contactez notre Délégué à la Protection des Données (DPO).",
  },
  {
    id: "faq-general-004",
    user: "PRO",
    question: "Comment signaler un bug ou suggérer une amélioration ?",
    answer:
      "Votre avis compte pour améliorer l'application :\n• Section 'Voix utilisateur' dans l'application : soumettez vos suggestions\n• Votez pour les suggestions d'autres utilisateurs\n• Suivez l'évolution des suggestions sur notre roadmap publique\n• Signalez les bugs via le formulaire dédié dans 'Aide' > 'Signaler un bug'\n• Plus une suggestion reçoit de votes, plus elle est priorisée\n\nNous lisons tous les retours et intégrons les meilleures idées dans nos mises à jour.",
  },
  {
    id: "faq-general-005",
    user: "CLIENT",
    question: "L'application est-elle disponible dans d'autres langues ?",
    answer:
      "Actuellement, l'application est disponible en :\n• Français\n• Anglais\n• Espagnol\n• Arabe\n• [Autres langues]\n\nLa langue est détectée automatiquement selon les paramètres de votre téléphone. Vous pouvez la modifier manuellement dans 'Paramètres' > 'Langue'. Nous ajoutons régulièrement de nouvelles langues selon la demande.",
  },
  {
    id: "faq-general-006",
    user: "CLIENT",
    question: "Comment fonctionne le parrainage ?",
    answer:
      "Parrainez vos amis et gagnez des récompenses :\n1. Trouvez votre code de parrainage dans 'Profil' > 'Parrainage'\n2. Partagez-le avec vos amis\n3. Votre ami reçoit une réduction sur sa première commande\n4. Vous recevez une récompense après sa première commande\n\nConditions : l'ami doit être nouveau sur la plateforme et passer une commande minimum. Les détails et montants sont indiqués dans la section parrainage.",
  },
  {
    id: "faq-general-007",
    user: "CLIENT",
    question: "Puis-je programmer une commande à l'avance ?",
    answer:
      "Oui, vous pouvez programmer vos commandes :\n• Sélectionnez vos produits normalement\n• Au moment de valider, choisissez 'Livraison programmée'\n• Sélectionnez la date et l'heure souhaitées\n• La commande sera automatiquement transmise au restaurant au bon moment\n\nIdéal pour planifier vos repas de la semaine, vos événements ou réunions. Vous pouvez annuler sans frais jusqu'à [délai] avant la livraison.",
  },
  {
    id: "faq-general-008",
    user: "CLIENT",
    question: "Comment sont calculés les frais de livraison ?",
    answer:
      "Les frais de livraison sont calculés selon :\n• La distance entre le restaurant et l'adresse de livraison\n• La demande en temps réel (tarification dynamique aux heures de pointe)\n• Votre niveau de fidélité (livraison gratuite ou réduite pour certains niveaux)\n• Les promotions en cours (livraison offerte)\n• Le montant minimum de commande défini par le restaurant\n\nLe montant exact est toujours affiché avant validation de votre commande.",
  },
  {
    id: "faq-general-009",
    user: "CLIENT",
    question: "Que faire si mon code promotionnel ne fonctionne pas ?",
    answer:
      "Si votre code promo ne fonctionne pas, vérifiez :\n• La date de validité (n'a pas expiré)\n• Les conditions d'utilisation (montant minimum, restaurant spécifique, première commande)\n• L'orthographe exacte du code\n• Si le code n'a pas déjà été utilisé (usage unique)\n• Si le code est applicable à votre zone de livraison\n\nSi tout semble correct mais que le code ne fonctionne toujours pas, contactez le support client avec le code concerné.",
  },
  {
    id: "faq-general-010",
    user: "CLIENT",
    question: "Puis-je commander depuis plusieurs restaurants en même temps ?",
    answer:
      "Actuellement, chaque commande est limitée à un seul restaurant. Pour commander chez plusieurs restaurants, vous devrez passer des commandes séparées. Chaque commande aura ses propres frais de livraison et sera livrée indépendamment. Nous travaillons sur une fonctionnalité de commande groupée pour le futur.",
  },
];

// Fonction utilitaire pour filtrer les FAQs par type d'utilisateur
export function getFaqByUser(userType: "CLIENT" | "DRIVER" | "PRO"): PublicFaq[] {
  return publicFaq.filter((faq) => faq.user === userType);
}

// Fonction utilitaire pour rechercher dans les FAQs
export function searchFaq(query: string): PublicFaq[] {
  const searchTerm = query.toLowerCase();
  return publicFaq.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.user.toLowerCase().includes(searchTerm)
  );
}