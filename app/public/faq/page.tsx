// app/public/faq/FaqPage.tsx
"use client";

import { useState, useMemo } from "react";
import { publicFaq, getFaqByUser, searchFaq, type PublicFaq } from "./faqData";
import { Search, User, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

// Types d'utilisateurs disponibles
type UserType = "CLIENT" | "DRIVER" | "PRO" | "ALL";

// Icônes et libellés pour chaque type
const userTypeConfig: Record<UserType, { label: string; icon: React.ReactNode; color: string }> = {
  ALL: {
    label: "Toutes les questions",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
  CLIENT: {
    label: "Client",
    icon: <User className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  DRIVER: {
    label: "Livreur",
    icon: <User className="w-5 h-5" />,
    color: "bg-green-100 text-green-700 border-green-300",
  },
  PRO: {
    label: "Professionnel",
    icon: <User className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
};

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<UserType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filtrer les FAQs selon le type d'utilisateur et la recherche
  const filteredFaqs = useMemo(() => {
    let faqs: PublicFaq[];

    if (searchQuery.trim()) {
      faqs = searchFaq(searchQuery);
    } else if (activeTab === "ALL") {
      faqs = publicFaq;
    } else {
      faqs = getFaqByUser(activeTab);
    }

    return faqs;
  }, [activeTab, searchQuery]);

  // Grouper les FAQs par type pour l'affichage "ALL"
  const groupedFaqs = useMemo(() => {
    if (activeTab !== "ALL" || searchQuery.trim()) return null;

    return {
      CLIENT: publicFaq.filter((f) => f.user === "CLIENT"),
      DRIVER: publicFaq.filter((f) => f.user === "DRIVER"),
      PRO: publicFaq.filter((f) => f.user === "PRO"),
    };
  }, [activeTab, searchQuery]);

  // Toggle l'expansion d'un élément
  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Étendre ou réduire tous les éléments
  const toggleAll = (expand: boolean) => {
    if (expand) {
      setExpandedItems(new Set(filteredFaqs.map((f) => f.id)));
    } else {
      setExpandedItems(new Set());
    }
  };

  // Rendu d'un groupe de FAQs
  const renderFaqGroup = (faqs: PublicFaq[], type: UserType) => {
    if (faqs.length === 0) return null;

    const config = userTypeConfig[type];

    return (
      <div className="mb-8">
        {/* En-tête du groupe */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color}`}>
            {config.icon}
            <span className="font-semibold text-sm">{config.label}</span>
          </div>
          <span className="text-sm text-gray-500">({faqs.length} questions)</span>
        </div>

        {/* Liste des questions */}
        <div className="space-y-3">
          {faqs.map((faq) => renderFaqItem(faq))}
        </div>
      </div>
    );
  };

  // Rendu d'un élément FAQ individuel
  const renderFaqItem = (faq: PublicFaq) => {
    const isExpanded = expandedItems.has(faq.id);
    const config = userTypeConfig[faq.user];

    return (
      <div
        key={faq.id}
        className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
      >
        {/* Question - cliquable */}
        <button
          onClick={() => toggleItem(faq.id)}
          className="w-full flex items-center justify-between p-4 md:p-5 text-left gap-4"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Badge type utilisateur (affiché seulement en mode "ALL") */}
            {activeTab === "ALL" && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${config.color}`}
              >
                {config.icon}
                {config.label}
              </span>
            )}
            <h3 className="font-medium text-gray-900 text-sm md:text-base">
              {faq.question}
            </h3>
          </div>
          <span className="text-gray-400 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </span>
        </button>

        {/* Réponse - expandable */}
        {isExpanded && (
          <div className="px-4 md:px-5 pb-4 md:pb-5 animate-fadeIn">
            <div className="border-t border-gray-100 pt-4">
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {faq.answer}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Centre d&apos;aide
            </h1>
            <p className="text-gray-600 text-lg">
              Comment pouvons-nous vous aider ?
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Onglets de filtrage (masqués en mode recherche) */}
        {!searchQuery.trim() && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {(["ALL", "CLIENT", "DRIVER", "PRO"] as UserType[]).map((type) => {
                const config = userTypeConfig[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      activeTab === type
                        ? `${config.color} shadow-sm scale-105`
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Boutons étendre/réduire tout */}
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={() => toggleAll(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tout déplier
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => toggleAll(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tout replier
              </button>
            </div>
          </>
        )}

        {/* Résultats de recherche */}
        {searchQuery.trim() && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredFaqs.length} résultat{filteredFaqs.length > 1 ? "s" : ""} pour &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {/* Affichage groupé (mode ALL sans recherche) */}
        {groupedFaqs && !searchQuery.trim() ? (
          <>
            {renderFaqGroup(groupedFaqs.CLIENT, "CLIENT")}
            {renderFaqGroup(groupedFaqs.DRIVER, "DRIVER")}
            {renderFaqGroup(groupedFaqs.PRO, "PRO")}
          </>
        ) : (
          /* Affichage simple (mode filtré ou recherche) */
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => renderFaqItem(faq))
            ) : (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune question trouvée
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier votre recherche ou{" "}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("ALL");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    revenir à toutes les questions
                  </button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contact support */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe support est disponible 24h/24 et 7j/7
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              <MessageCircle className="w-5 h-5" />
              Contacter le support
            </button>
          </div>
        </div>
      </div>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}