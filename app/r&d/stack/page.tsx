//@/app/r&d/stack/page.tsx
/*role : Page de présentation de la stack technique
   import : React, composants shadcn/ui, lucide-react, stackData
   useBy : Navigation principale (/tech-stack)
*/

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  Server,
  Layout,
  ShieldCheck,
  Database,
  FormInput,
  Paintbrush,
  Layers,
  Sparkles,
  Workflow,
  RefreshCw,
  Lock,
  CreditCard,
  Mail,
  Move,
  Terminal,
  Calendar,
  BarChart3,
  Link,
  Copy,
  Check,
} from 'lucide-react';
import { techStack, type TechItem } from './stackData';

// Map des noms d'icônes vers les composants Lucide
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Layout,
  ShieldCheck,
  Database,
  FormInput,
  Paintbrush,
  Layers,
  Sparkles,
  Workflow,
  RefreshCw,
  Lock,
  CreditCard,
  Mail,
  Move,
  Terminal,
  Calendar,
  BarChart3,
  Code,
};

// Fallback si l'icône n'existe pas
const FallbackIcon = ({ className }: { className?: string }) => (
  <Code className={className} />
);

const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName] || FallbackIcon;
  return <Icon className="h-6 w-6" />;
};

// === Composant principal ===
export default function TechStackPage() {
  const categories = Array.from(new Set(techStack.map((t) => t.category)));
  const [activeCategory, setActiveCategory] = React.useState(categories[0] || 'Toutes');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTech =
    activeCategory === 'Toutes'
      ? techStack
      : techStack.filter((t) => t.category === activeCategory);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950/20 py-12 px-4 font-sans antialiased relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
                <Code className="h-6 w-6 text-white" />
              </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Stack technique
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base max-w-xl">
              Découvrez les technologies qui font tourner l’application.
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <span className="font-bold text-orange-600 dark:text-orange-400">{techStack.length}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">technologies</span>
          </Badge>
        </div>

        <Tabs defaultValue={categories[0]} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="flex flex-wrap gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTech.map((tech: TechItem) => (
                <Card
                  key={tech.id + tech.name}
                  className="border border-primary/10 hover:shadow-xl transition-all group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tech.color}`}>
                          {getIcon(tech.iconName)}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{tech.name}</CardTitle>
                          <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
                            {tech.category}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {tech.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs font-normal">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-2 space-y-2">
                      <div
                        className="bg-muted/30 rounded-lg p-2 font-mono text-xs text-muted-foreground truncate flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => copyToClipboard(tech.cmdI, tech.id)}
                      >
                        <span>
                          <span className="text-primary font-semibold">$</span> {tech.cmdI}
                        </span>
                        <span className="text-muted-foreground/50 hover:text-foreground transition-colors">
                          {copiedId === tech.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 text-xs"
                        onClick={() => window.open(tech.docs, '_blank')}
                      >
                        <Link className="h-3 w-3" /> Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredTech.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune technologie dans cette catégorie.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          <p>
            Cette stack est utilisée pour développer l’application avec une approche moderne, typée et performante.
          </p>
        </footer>
      </div>
    </div>
  );
}