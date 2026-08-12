//@ /app/prompt/page.tsx
/*role : Page de bibliothèque de prompts avec recherche, filtres et copie.
   import: React, shadcn/ui, Lucide, données prompts.
   useBy : Navigation principale (/prompt)
*/

'use client';

import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { prompts, type Prompt } from '@/app/r&d/prompt/promptData';

// Composants shadcn/ui
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Icônes
import { Copy, Check, Search, Sparkles, Filter, X, BookOpen } from 'lucide-react';

// --- Types ---
interface PromptCardProps {
  prompt: Prompt;
}

// --- Copie ---
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

// --- Barre de recherche et filtres ---
interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string | null) => void;
  onReset: () => void;
  categories: string[];
  resultCount: number;
}

const SearchFilterBar = memo(({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onReset,
  categories,
  resultCount,
}: SearchFilterBarProps) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
    [onSearchChange]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
      <div className="relative flex-1 sm:max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <Input
          placeholder="Rechercher un prompt..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 pr-9 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-all bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4 text-muted-foreground/50" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground/50" />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px] shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="shadow-sm hover:shadow-md transition-all border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        >
          Réinitialiser
        </Button>
      </div>

      <p className="text-sm text-muted-foreground font-medium ml-auto whitespace-nowrap">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
          {resultCount}
        </span>
        {' '}prompt{resultCount > 1 ? 's' : ''}
      </p>
    </div>
  );
});
SearchFilterBar.displayName = 'SearchFilterBar';

// --- Carte d'un prompt ---
const PromptCard = memo(({ prompt }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) setCopied(true);
  }, [prompt.content]);

  const handleContentClick = useCallback(() => {
    handleCopy();
  }, [handleCopy]);

  // Couleurs dynamiques par catégorie
  const categoryStyle = useMemo(() => {
    const styles: Record<string, string> = {
      'développement': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      'design': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      'marketing': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
      'productivité': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
      'stratégie': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
      'innovation': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
    };
    return styles[prompt.category] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700';
  }, [prompt.category]);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
      {/* Dégradé de fond au survol */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="relative z-10 pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            {prompt.title}
          </CardTitle>
          <Badge variant="outline" className={`capitalize whitespace-nowrap border ${categoryStyle}`}>
            {prompt.category}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
          {prompt.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <div
          className="relative bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-700/60 border border-gray-200/50 dark:border-gray-700/50 shadow-inner group/content"
          onClick={handleContentClick}
          title="Cliquer pour copier"
        >
          {prompt.content}

          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover/content:opacity-100 transition-opacity gap-1.5 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copié</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copier</span>
              </>
            )}
          </Button>

          {copied && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl pointer-events-none animate-in fade-in duration-300">
              <span className="bg-emerald-500/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm flex items-center gap-2">
                <Check className="h-5 w-5" />
                Copié dans le presse‑papier
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-3">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-0 hover:bg-gray-200 dark:hover:bg-gray-600/70 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
});
PromptCard.displayName = 'PromptCard';

// --- Page principale ---
const PromptPage = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('toutes');

  const categories = useMemo(
    () => ['toutes', ...new Set(prompts.map((p) => p.category))],
    []
  );

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'toutes' || prompt.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value: string | null) => {
    setSelectedCategory(value ?? 'toutes');
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('toutes');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 py-12 px-4 font-sans antialiased relative">
      {/* Blobs décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-2xl shadow-lg shadow-purple-500/20">
                <BookOpen className="h-6 w-6 text-white" />
              </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Bibliothèque de prompts
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base max-w-xl">
              Copiez en un clic les prompts qui vous feront gagner du temps.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-sm">
            <span className="font-bold text-purple-600 dark:text-purple-400">{prompts.length}</span>
            <span className="text-gray-500 dark:text-gray-400">prompts disponibles</span>
          </div>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onReset={handleReset}
          categories={categories}
          resultCount={filteredPrompts.length}
        />

        <div className="grid grid-cols-1 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-20 px-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 backdrop-blur-sm shadow-inner">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4">
              <Search className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Aucun résultat</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
              Essayez d’ajuster vos mots‑clés ou de réinitialiser les filtres.
            </p>
            <Button
              variant="outline"
              onClick={handleReset}
              className="mt-6 shadow-sm hover:shadow-md transition-all border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70"
            >
              Réinitialiser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
PromptPage.displayName = 'PromptPage';

export default PromptPage;