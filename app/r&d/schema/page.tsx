//@/app/schema/page.tsx
/* role : Page présentant le schéma de données complet de l'application AppFood.
   Elle décrit le rôle de chaque entité (table/interface) et les relations entre elles,
   afin d'aider à comprendre l'architecture et les fonctionnalités de la plateforme.
   import: Composants shadcn/ui (Accordion, AccordionContent, AccordionItem, AccordionTrigger), Card, Badge, Separator,
           données depuis schemaData.ts
   useBy : Consultée par les développeurs, chefs de projet, nouveaux arrivants dans l'équipe.
*/

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { entityGroups } from './schemaData';

/**
 * Composant principal de la page.
 * Affiche les entités groupées par thématique dans des accordéons,
 * avec la liste complète des champs (nom + description) et les relations.
 */
export default function SchemaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Schéma de données
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
            AppFood — Modèle de données complet
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Chaque entité est décrite avec ses champs et leurs descriptions, ainsi que les relations avec les autres tables.
          </p>
          <Separator className="mt-6 max-w-xs mx-auto" />
        </div>

        {/* Liste des groupes */}
        <div className="space-y-8">
          {entityGroups.map((group) => (
            <Card key={group.group} className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  {group.group}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion className="w-full">
                  {group.entities.map((entity) => (
                    <AccordionItem
                      key={entity.name}
                      value={`${group.group}-${entity.name}`}
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-3 rounded-md transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg text-slate-800 dark:text-white">
                            {entity.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {entity.relations.length} relation(s)
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                        {/* Description générale */}
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {entity.description}
                        </p>

                        {/* Liste des champs avec leur description */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                            Champs :
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {entity.fields.map((field) => (
                              <div
                                key={field.name}
                                className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1"
                              >
                                <Badge variant="outline" className="text-xs font-mono">
                                  {field.name}
                                </Badge>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {field.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Relations */}
                        {entity.relations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                              Relations :
                            </h4>
                            <ul className="space-y-1">
                              {entity.relations.map((rel) => (
                                <li
                                  key={rel.with}
                                  className="text-sm text-slate-700 dark:text-slate-300"
                                >
                                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                                    {rel.with}
                                  </span>
                                  <span className="mx-2 text-slate-400">—</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {rel.type}
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pied de page */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-6">
          <p>
            Ce schéma est utilisé comme source de vérité pour le typage TypeScript et les
            relations entre les données de l'application.
          </p>
          <p className="mt-1">
            Les entités marquées avec <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">deletedAt</code>{' '}
            supportent la suppression logique.
          </p>
        </div>
      </div>
    </div>
  );
}