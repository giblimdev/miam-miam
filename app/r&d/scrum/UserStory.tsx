//@/app/scrum/userStory.tsx
/*role : Page d'affichage des User Stories du projet Scrum
   import : React, composants shadcn/ui, lucide-react, données personas & user stories
   useBy : Navigation principale (/scrum/user-story)
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
import { Check, ListChecks, Filter, X } from 'lucide-react';
import { personas, userStories, type UserStory } from './scrumData';

// === Composant principal ===
export default function UserStoryPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 py-12 px-4 font-sans antialiased relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                <ListChecks className="h-6 w-6 text-white" />
              </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                User Stories
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base max-w-xl">
              Consultez les besoins fonctionnels exprimés par chaque persona.
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{userStories.length}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">user stories</span>
          </Badge>
        </div>

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
                  {p.avatar} {p.role} ({counts.get(p.id) || 0})
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

        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          <p>
            Ces user stories sont extraites du backlog produit et priorisées par la team.
          </p>
        </footer>
      </div>
    </div>
  );
}