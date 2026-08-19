//@/components/AllergenSelect.tsx
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { allergens } from "@/lib/data/allergenData";

interface AllergenSelectProps {
  useBy?: string; // Contexte d'utilisation : "product", "option", "profile", etc.
  initialSelected?: string[]; // IDs d'allergènes présélectionnés
  onSelectionChange?: (selectedIds: string[]) => void;
}

function AllergenSelect({
  useBy = "product",
  initialSelected = [],
  onSelectionChange,
}: AllergenSelectProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((a) => a !== id)
        : [...prev, id];
      if (onSelectionChange) onSelectionChange(next);
      return next;
    });
  };

  const selectedAllergens = allergens.filter((a) => selectedIds.includes(a.id));

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Sélection par cases à cocher */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Allergènes{" "}
              {useBy && (
                <span className="text-sm text-gray-500">(pour {useBy})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {allergens.map((allergen) => (
                <label
                  key={allergen.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(allergen.id)}
                    onChange={() => handleToggle(allergen.id)}
                  />
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">{allergen.name}</span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-white text-slate-700 border border-slate-200 shadow-lg shadow-slate-200/50"
                    >
                      <p>
                        {allergen.description ||
                          "Pas de description disponible"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Affichage des allergènes sélectionnés sous forme de badges */}
        {selectedAllergens.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allergènes sélectionnés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedAllergens.map((allergen) => (
                  <Badge
                    key={allergen.id}
                    variant="secondary"
                    className="gap-1 px-2 py-1"
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">{allergen.name}</span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-white text-slate-700 border border-slate-200 shadow-lg shadow-slate-200/50"
                      >
                        <p>
                          {allergen.description ||
                            "Pas de description disponible"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <button
                      onClick={() => handleToggle(allergen.id)}
                      className="ml-1 text-red-500 hover:text-red-700"
                      aria-label={`Retirer ${allergen.name}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}

export default AllergenSelect;
