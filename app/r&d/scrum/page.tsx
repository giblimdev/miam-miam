//@/app/r&d/scrum/page.tsx
/*role : Page principale Scrum affichant les Personas et User Stories via des onglets
   import : React, composants shadcn/ui, lucide-react, données scrum
   useBy : Navigation principale (/r&d/scrum)
*/

'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  ListChecks,
  Target,
  AlertCircle,
  Check,
  Filter,
  X,
  MapPin,
} from 'lucide-react';
import { personas, userStories, type Persona, type UserStory } from './scrumData';

// === Composant principal ===
export default function ScrumPage() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('all');

  // Filtrer les user stories par persona
  const filteredStories = useMemo(() => {
    if (selectedPersonaId === 'all') return userStories;
    return userStories.filter((story) => story.personaId === selectedPersonaId);
  }, [selectedPersonaId]);

  // Compter les stories par persona
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    userStories.forEach((story) => {
      map.set(story.personaId, (map.get(story.personaId) || 0) + 1);
    });
    return map;
  }, []);

  // Gestionnaire de changement de filtre (gère null)
  const handleFilterChange = (value: string | null) => {
    setSelectedPersonaId(value ?? 'all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 py-12 px-4 font-sans antialiased relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Users className="h-6 w-6 text-white" />
              </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Espace Scrum
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base max-w-xl">
              Personas et User Stories pour guider le développement.
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{personas.length}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">personas</span>
            <span className="mx-1">•</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{userStories.length}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">stories</span>
          </Badge>
        </div>

        <Tabs defaultValue="personas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <TabsTrigger value="personas" className="gap-2">
              <Users className="h-4 w-4" /> Personas
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-2">
              <ListChecks className="h-4 w-4" /> User Stories
            </TabsTrigger>
          </TabsList>

          {/* === ONGLET PERSONAS === */}
          <TabsContent value="personas" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas.map((persona: Persona) => (
                <Card
                  key={persona.id}
                  className="border border-indigo-200/30 dark:border-indigo-800/30 hover:shadow-xl transition-all group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                          <AvatarFallback className="text-2xl">
                            {persona.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-bold">{persona.name}</CardTitle>
                          <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
                            {persona.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-indigo-300/30 text-indigo-600 dark:text-indigo-400">
                        {persona.age} ans
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 text-indigo-400" />
                      <p className="leading-relaxed">{persona.profile}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5 mb-1.5">
                        <Target className="h-3.5 w-3.5" /> Objectifs
                      </h4>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-0.5">
                        {persona.goals.map((goal, idx) => (
                          <li key={idx}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-rose-500 dark:text-rose-400 flex items-center gap-1.5 mb-1.5">
                        <AlertCircle className="h-3.5 w-3.5" /> Frustrations
                      </h4>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-0.5">
                        {persona.frustrations.map((frustration, idx) => (
                          <li key={idx}>{frustration}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* === ONGLET USER STORIES === */}
          <TabsContent value="stories" className="mt-6">
            {/* Filtre par persona */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrer par persona :</span>
              </div>
              <Select value={selectedPersonaId} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Tous les personas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Tous ({userStories.length})
                  </SelectItem>
                  {personas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.avatar} {p.name} ({counts.get(p.id) || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPersonaId !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => setSelectedPersonaId('all')}
                >
                  <X className="h-3.5 w-3.5" /> Réinitialiser
                </Button>
              )}
            </div>

            {/* Liste des user stories */}
            <div className="space-y-4">
              {filteredStories.map((story: UserStory) => {
                const persona = personas.find((p) => p.id === story.personaId);
                return (
                  <Card
                    key={story.id}
                    className="border border-emerald-200/30 dark:border-emerald-800/30 hover:shadow-lg transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs font-mono border-emerald-300/40 text-emerald-700 dark:text-emerald-400">
                            {story.id}
                          </Badge>
                          <Badge variant="secondary" className="gap-1 text-xs">
                            {persona?.avatar} {persona?.name}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold mt-1.5">
                          {story.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {story.description}
                      </p>
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                          <Check className="h-3.5 w-3.5" /> Critères d'acceptation
                        </h4>
                        <ul className="list-disc list-inside text-sm text-foreground/80 space-y-0.5">
                          {story.acceptanceCriteria.map((criterion, idx) => (
                            <li key={idx}>{criterion}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredStories.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucune user story pour ce persona.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          <p>
            Ces données sont issues du backlog produit et servent de référence pour l’équipe de développement.
          </p>
        </footer>
      </div>
    </div>
  );
}