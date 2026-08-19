//@/productTools/nutriScoreLab/page.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllergenSelect from "@/components/AllergenSelect";

export default function NutriScoreLabPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          NutriScore-Lab
        </h1>
        <p className="text-muted-foreground text-lg">
          Gérez tout le profil santé et qualité du produit : allergènes,
          informations nutritionnelles, Nutri‑Score et scores composites.
        </p>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="allergens" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allergens">Allergènes</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="nutriscore">Nutri‑Score</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>

        {/* Onglet Allergènes */}
        <TabsContent value="allergens">
          <AllergenSelect useBy="product" />
        </TabsContent>

        {/* Onglet Nutrition (exemple) */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Informations nutritionnelles</CardTitle>
              <CardDescription>
                Saisissez les valeurs pour 100g ou par portion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenu à venir : calories, protéines, glucides, lipides, etc.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Nutri‑Score (exemple) */}
        <TabsContent value="nutriscore">
          <Card>
            <CardHeader>
              <CardTitle>Calcul du Nutri‑Score</CardTitle>
              <CardDescription>
                Évaluez le score nutritionnel du produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Outil de calcul bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Scores composites (exemple) */}
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle>Scores composites</CardTitle>
              <CardDescription>Éco‑score, note qualité, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestion des scores additionnels à venir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
