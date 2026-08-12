//@/app/design/page.tsx
/*role : Page de démonstration des ressources de design (icônes, couleurs, emojis)
   responsabilité : Afficher et permettre la recherche d'icônes Lucide, présenter la palette de couleurs, les emojis et des exemples d'intégration
   import : React, lucide-react, composants shadcn/ui
   useBy : (aucun autre fichier)
*/

'use client';

import React, { useState, useMemo, useCallback } from 'react';

// === Composants shadcn/ui ===
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// === Icônes Lucide (beaucoup plus complet) ===
import {
  // Navigation
  Home, User, Users, Settings, Menu, X, Search, Filter,
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  // Actions
  Check, Edit, Trash2, Plus, Minus, Copy, Clipboard,
  Heart, Star, ShoppingCart, ShoppingBag, Truck, Phone, Mail, MapPin,
  Clock, Calendar, Eye, EyeOff, LogOut, UserPlus, Bell, Gift,
  Award, Zap, Code, Save, Share, Download, Upload,
  // Media
  Image, Video, Music, Camera, Mic,
  // Communication
  MessageCircle, MessageSquare, Send, AtSign, Link,
  // Commerce
  CreditCard, Wallet, DollarSign, Percent, Tag, Ticket,
  // Files
  File, FileText, Folder, FolderOpen,
  // UI
  AlertCircle, AlertTriangle, Info, HelpCircle, CheckCircle,
  XCircle, Loader, RefreshCw, MoreVertical, MoreHorizontal,
  // Social
  // Nature & Food
  Leaf, Coffee, Pizza, Utensils, Cake,
  // Miscellaneous
  Rocket, Lightbulb, TrendingUp, Shield, Lock, Unlock,
  Globe, Briefcase, Wrench, Scissors,
  // Sport & Health
  HeartPulse, Dumbbell, Bike,
  // Weather
  Sun, Cloud, CloudRain, Snowflake,
} from 'lucide-react';

// === Organisation des icônes par catégorie ===
const iconCategories: Record<string, string[]> = {
  Navigation: ['Home', 'User', 'Users', 'Settings', 'Menu', 'X', 'Search', 'Filter'],
  NavigationArrows: ['ChevronDown', 'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  Actions: ['Check', 'Edit', 'Trash2', 'Plus', 'Minus', 'Copy', 'Clipboard', 'Save', 'Share', 'Download', 'Upload'],
  Commerce: ['ShoppingCart', 'ShoppingBag', 'Truck', 'CreditCard', 'Wallet', 'DollarSign', 'Percent', 'Tag', 'Ticket'],
  Communication: ['Phone', 'Mail', 'MapPin', 'Clock', 'Calendar', 'MessageCircle', 'MessageSquare', 'Send', 'AtSign', 'Link'],
  Media: ['Image', 'Video', 'Music', 'Camera', 'Mic'],
  Files: ['File', 'FileText', 'Folder', 'FolderOpen'],
  UI: ['AlertCircle', 'AlertTriangle', 'Info', 'HelpCircle', 'CheckCircle', 'XCircle', 'Loader', 'RefreshCw', 'MoreVertical', 'MoreHorizontal'],
  Social: ['Facebook', 'Twitter', 'Instagram', 'Github', 'Youtube'],
  NatureFood: ['Leaf', 'Coffee', 'Pizza', 'Utensils', 'Cake'],
  Miscellaneous: ['Rocket', 'Lightbulb', 'TrendingUp', 'Shield', 'Lock', 'Unlock', 'Globe', 'Briefcase', 'Wrench', 'Scissors'],
  Health: ['HeartPulse', 'Dumbbell', 'Bike', 'Running'],
  Weather: ['Sun', 'Cloud', 'CloudRain', 'Snowflake'],
};

// Map des icônes par nom
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, User, Users, Settings, Menu, X, Search, Filter,
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Check, Edit, Trash2, Plus, Minus, Copy, Clipboard,
  Heart, Star, ShoppingCart, ShoppingBag, Truck, Phone, Mail, MapPin,
  Clock, Calendar, Eye, EyeOff, LogOut, UserPlus, Bell, Gift,
  Award, Zap, Code, Save, Share, Download, Upload,
  Image, Video, Music, Camera, Mic,
  MessageCircle, MessageSquare, Send, AtSign, Link,
  CreditCard, Wallet, DollarSign, Percent, Tag, Ticket,
  File, FileText, Folder, FolderOpen,
  AlertCircle, AlertTriangle, Info, HelpCircle, CheckCircle,
  XCircle, Loader, RefreshCw, MoreVertical, MoreHorizontal,
  Leaf, Coffee, Pizza, Utensils, Cake,
  Rocket, Lightbulb, TrendingUp, Shield, Lock, Unlock,
  Globe, Briefcase, Wrench, Scissors,
  HeartPulse, Dumbbell, Bike,
  Sun, Cloud, CloudRain, Snowflake,
};

// Liste de tous les noms d'icônes
const allIconNames = Object.keys(iconMap);

// === PALETTE DE COULEURS (Food Delivery / Rappy) ===
const colorPalette = [
  { name: 'Primary', value: 'hsl(25 100% 60%)' },              // #FF6B35 - Orange vif
  { name: 'Primary-foreground', value: 'hsl(0 0% 100%)' },
  { name: 'Secondary', value: 'hsl(30 100% 95%)' },            // #FFF5E6 - Crème orange
  { name: 'Secondary-foreground', value: 'hsl(25 100% 40%)' }, // #CC4400 - Orange foncé
  { name: 'Accent', value: 'hsl(40 100% 55%)' },               // #FFB800 - Jaune
  { name: 'Accent-foreground', value: 'hsl(0 0% 100%)' },
  { name: 'Muted', value: 'hsl(30 20% 96%)' },
  { name: 'Muted-foreground', value: 'hsl(30 10% 55%)' },
  { name: 'Destructive', value: 'hsl(0 72% 51%)' },
  { name: 'Destructive-foreground', value: 'hsl(0 0% 100%)' },
  { name: 'Border', value: 'hsl(30 20% 90%)' },
  { name: 'Input', value: 'hsl(30 20% 90%)' },
  { name: 'Ring', value: 'hsl(25 100% 60%)' },
  { name: 'Background', value: 'hsl(0 0% 100%)' },
  { name: 'Foreground', value: 'hsl(25 10% 20%)' },
];

// === Emojis (dédoublonnés) ===
const uniqueEmojis = (arr: string[]) => [...new Set(arr)];

const emojiCategories: Record<string, string[]> = {
  'Visage & émotions': uniqueEmojis(['😊', '😂', '🤣', '❤️', '💔', '🔥', '✨', '💯', '👍', '👎', '👌', '🤞', '🙌', '👏', '🤝', '🙏']),
  'Animaux & nature': uniqueEmojis(['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🐴', '🦄', '🐝', '🐞', '🦋', '🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃']),
  'Nourriture & boissons': uniqueEmojis(['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🥃']),
  'Voyage & lieux': uniqueEmojis(['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🚦', '🚥', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🌍', '🌎', '🌏', '🌐', '🗺️', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '⛺', '🏖️', '🏜️', '🏝️', '🏞️']),
  'Activités & sports': uniqueEmojis(['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '⛸️', '🥌', '🛷', '🎿', '🏂', '⛷️', '🏄', '🏇', '🏊', '🤽', '🚣', '🏋️', '🤸', '🤹', '🧘', '🧗', '🤼', '🤾', '🏌️', '🚴', '🚵', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎪', '🎨', '🎭', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻']),
  'Objets & symboles': uniqueEmojis([
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '🧮', '🎮', '🧩', '🏷️', '📟', '☎️', '📞', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🪫', '💯', '🔢', '🔤', '🆎', '🆑', '🆒', '🆓', '🆔', '🆕', '🆖', '🆗', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '💮', '🏮', '📛', '🔰', '💠', '🎵', '🎶', '♻️', '💲', '⚜️', '💹', '🔱', '✅', '❌', '❎', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↖️', '↙️', '↕️', '↔️', '🔄', '↩️', '↪️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♿', '🛗', '🈳', '🈴', '🈺', '🈵', '🛐', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '🕎', '🔯', '🪯', '🌙', '☀️', '🌟', '⭐', '🌠', '🌌', '🌃', '🏙️', '🌉', '🌅', '🌄', '🌆', '🌇', '🎑', '🌁', '🗾', '🎠', '🎡', '🎢', '💈', '🎪', '🎭', '🖼️', '🎨', '🎬', '🎤', '🎧', '🎹', '🎸', '🎺', '🎻', '🥁', '🎼', '🎷', '🪕', '🎯', '🎱', '🎳', '🎲', '🧩', '🧸', '🧵', '🧶'
  ]),
};

// === Composant principal ===
export default function DesignPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('icons');

  // Filtrer les icônes selon la recherche
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return allIconNames;
    return allIconNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Copier le nom de l'icône
  const copyIconName = useCallback((name: string) => {
    const iconCode = `<${name} className="h-4 w-4" />`;
    navigator.clipboard.writeText(iconCode);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  }, []);

  // Copier l'emoji
  const copyEmoji = useCallback((emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    setTimeout(() => setCopiedEmoji(null), 2000);
  }, []);

  // Grouper les icônes par catégorie pour l'affichage
  const getIconsByCategory = useCallback(() => {
    const result: Record<string, string[]> = {};
    for (const [category, names] of Object.entries(iconCategories)) {
      const filtered = names.filter(name => filteredIcons.includes(name));
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    }
    return result;
  }, [filteredIcons]);

  const groupedIcons = getIconsByCategory();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 py-12 px-4 font-sans antialiased relative">
        {/* Blobs décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-2xl shadow-lg shadow-purple-500/20">
                  <span className="text-white text-2xl">🎨</span>
                </span>
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Ressources de design
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base max-w-xl">
                Explorez les icônes, couleurs, emojis et polices de l’application.
              </p>
            </div>
            <Badge variant="outline" className="px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <span className="font-bold text-purple-600 dark:text-purple-400">{allIconNames.length}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">icônes</span>
            </Badge>
          </header>

          {/* Onglets avec shadcn/ui Tabs */}
          <Tabs defaultValue="icons" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <TabsTrigger value="icons">Icônes</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="emojis">Emojis</TabsTrigger>
            </TabsList>

            {/* === ONGLET ICÔNES === */}
            <TabsContent value="icons" className="mt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    placeholder="Rechercher une icône..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-9 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-all bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredIcons.length} résultat{filteredIcons.length > 1 ? 's' : ''}
                </div>
              </div>

              {Object.entries(groupedIcons).map(([category, names]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{category}</Badge>
                    <span className="text-xs text-muted-foreground">({names.length})</span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {names.map((name) => {
                      const Icon = iconMap[name];
                      const isCopied = copiedIcon === name;
                      return (
                        <Tooltip key={name}>
                          <TooltipTrigger
                            className="flex flex-col items-center justify-center p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 group relative"
                            onClick={() => copyIconName(name)}
                          >
                            {Icon && <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />}
                            <span className="mt-1.5 text-[10px] text-center text-gray-500 dark:text-gray-400 leading-tight max-w-full break-words">
                              {name}
                            </span>
                            {isCopied && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                ✓
                              </span>
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Cliquer pour copier <code className="bg-muted px-1 rounded">{`<${name} className="h-4 w-4" />`}</code></p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredIcons.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune icône ne correspond à votre recherche.</p>
                </div>
              )}
            </TabsContent>

            {/* === ONGLET COULEURS (version enrichie) === */}
            <TabsContent value="colors" className="mt-6">
              {/* Palette de couleurs */}
              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Palette de couleurs</CardTitle>
                  <CardDescription>
                    Couleurs principales de l’application (food delivery). Utilisez-les via les classes Tailwind.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {colorPalette.map(({ name, value }) => (
                      <div
                        key={name}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 shadow-sm"
                      >
                        <div
                          className="h-20"
                          style={{ backgroundColor: value }}
                        />
                        <div className="p-3">
                          <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* === EXEMPLE D'INTÉGRATION AVANCÉ === */}
              <Card className="mt-6 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Découvrez votre palette en action
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Interface complète d'une application de livraison utilisant vos couleurs Primary, Secondary, Accent et leurs dégradés.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* === BARRE DE RECHERCHE AVEC FILTRES === */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        placeholder="Rechercher un restaurant ou un plat..."
                        className="pl-9 border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <Filter className="h-4 w-4" /> Filtres
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <MapPin className="h-4 w-4" /> 75001
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <Clock className="h-4 w-4" /> Livraison
                      </Button>
                    </div>
                  </div>

                  {/* === GRILLE DE 6 CARTES RESTAURANTS === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Carte 1 - Primary + Accent */}
                    <Card className="overflow-hidden border border-primary/20 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-primary/30 to-primary/20">
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent text-accent-foreground gap-1.5">
                            <Zap className="h-3 w-3" /> Livraison gratuite
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.8
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~25 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">Le Petit Gourmet</h4>
                            <p className="text-sm text-muted-foreground">🍣 Sushi • 🥢 Asiatique</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 10e</p>
                          </div>
                          <Button variant="default" size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carte 2 - Secondary + Primary */}
                    <Card className="overflow-hidden border border-secondary/30 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-secondary/30 to-secondary/20">
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className="gap-1.5 bg-primary text-primary-foreground">
                            <Gift className="h-3 w-3" /> -20% avec code RAPPY
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~35 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">La Table d'Antoine</h4>
                            <p className="text-sm text-muted-foreground">🍖 Grillades • 🥗 Salades</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 11e</p>
                          </div>
                          <Button variant="secondary" size="sm" className="gap-1.5">
                            <ShoppingCart className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carte 3 - Accent + Primary (corrigé) */}
                    <Card className="overflow-hidden border border-accent/30 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-accent/40 to-accent/20">
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground gap-1.5">
                            <Truck className="h-3 w-3" /> Livraison express
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.7
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~15 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">Burger Factory</h4>
                            <p className="text-sm text-muted-foreground">🍔 Burgers • 🍟 Fast-food</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 9e</p>
                          </div>
                          <Button variant="default" size="sm" className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90">
                            <Plus className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carte 4 - Dégradé Primary → Secondary */}
                    <Card className="overflow-hidden border border-primary/10 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-primary/40 to-secondary/40">
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="gap-1.5 bg-white/90 dark:bg-gray-800/90 border-primary/30">
                            <Percent className="h-3 w-3 text-primary" /> -15% sur le menu
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.6
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~30 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">Pizza Mia</h4>
                            <p className="text-sm text-muted-foreground">🍕 Pizzas • 🥗 Italien</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 12e</p>
                          </div>
                          <Button variant="default" size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carte 5 - Secondary + Accent */}
                    <Card className="overflow-hidden border border-secondary/20 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-secondary/30 to-accent/30">
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent text-accent-foreground gap-1.5">
                            <Coffee className="h-3 w-3" /> Offre petit-déjeuner
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.8
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~20 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">Le Café Gourmand</h4>
                            <p className="text-sm text-muted-foreground">☕ Café • 🥐 Pâtisserie</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 6e</p>
                          </div>
                          <Button variant="secondary" size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carte 6 - Primary + Accent */}
                    <Card className="overflow-hidden border border-accent/20 hover:shadow-xl transition-all group">
                      <div className="relative h-32 bg-gradient-to-r from-primary/30 to-accent/30">
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive" className="gap-1.5">
                            <Clock className="h-3 w-3" /> Dernière commande
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-gray-800/90">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                          </Badge>
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            ~40 min
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-foreground">Saveurs d'Asie</h4>
                            <p className="text-sm text-muted-foreground">🥢 Thaï • 🍜 Vietname</p>
                            <p className="text-xs text-muted-foreground mt-1">🇫🇷 Paris 13e</p>
                          </div>
                          <Button variant="default" size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Commander
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* === TOUS LES BOUTONS DE L'APPLICATION === */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Vos boutons dans toutes les variantes</span>
                      <span className="h-px flex-1 bg-border" />
                    </h4>
                    <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-xl">
                      <Button variant="default" className="gap-2">
                        <User className="h-4 w-4" /> Se connecter
                      </Button>
                      <Button variant="secondary" className="gap-2">
                        <ShoppingCart className="h-4 w-4" /> Panier (3)
                      </Button>
                      <Button variant="default" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                        <Gift className="h-4 w-4" /> Promo
                      </Button>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Search className="h-4 w-4" /> Rechercher
                      </Button>
                      <Button variant="ghost" className="gap-2">
                        <Heart className="h-4 w-4" /> Favoris
                      </Button>
                      <Button variant="link" className="gap-2">
                        <Link className="h-4 w-4" /> Voir plus
                      </Button>
                    </div>
                  </div>

                  {/* === ÉLÉMENTS D'INTERFACE AVEC ICÔNES === */}
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">3 notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-secondary/10 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-secondary" />
                      </div>
                      <span className="text-sm font-medium">Panier: 2 articles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-accent/10 rounded-full">
                        <Percent className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-sm font-medium">-25% promo</span>
                    </div>
                    <div className="flex-1" />
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Wallet className="h-4 w-4" /> 12,50 €
                    </Button>
                    <Button variant="default" size="sm" className="gap-1.5">
                      <Truck className="h-4 w-4" /> Commander
                    </Button>
                  </div>

                  {/* === BADGES VARIÉS === */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Badges et étiquettes</span>
                      <span className="h-px flex-1 bg-border" />
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default" className="gap-1.5">
                        <Clock className="h-3 w-3" /> Livraison en 25 min
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5">
                        <Check className="h-3 w-3" /> Commandé par 54 personnes
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                        <Truck className="h-3 w-3" /> Livraison gratuite
                      </Badge>
                      <Badge className="gap-1.5 bg-accent text-accent-foreground">
                        <Percent className="h-3 w-3" /> -25% sur votre première commande
                      </Badge>
                      <Badge variant="destructive" className="gap-1.5">
                        <AlertCircle className="h-3 w-3" /> Stock limité
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 border-secondary/50 text-secondary">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Note exceptionnelle
                      </Badge>
                    </div>
                  </div>

                  {/* === RÉCAPITULATIF DE LA PALETTE === */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-muted/20 rounded-xl text-center text-xs">
                    <div className="space-y-1">
                      <div className="h-6 rounded bg-primary" />
                      <span className="font-medium">Primary</span>
                      <span className="block text-muted-foreground">CTA, boutons principaux</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-6 rounded bg-secondary" />
                      <span className="font-medium">Secondary</span>
                      <span className="block text-muted-foreground">Actions secondaires</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-6 rounded bg-accent" />
                      <span className="font-medium">Accent</span>
                      <span className="block text-muted-foreground">Promos, offres spéciales</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-6 rounded bg-destructive" />
                      <span className="font-medium">Destructive</span>
                      <span className="block text-muted-foreground">Suppression, alertes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === ONGLET EMOJIS === */}
            <TabsContent value="emojis" className="mt-6">
              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Emojis disponibles</CardTitle>
                  <CardDescription>
                    Cliquez sur un emoji pour le copier dans le presse-papier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        {category}
                        <Badge variant="outline" className="text-xs">{emojis.length}</Badge>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {emojis.map((emoji) => {
                          const isCopied = copiedEmoji === emoji;
                          return (
                            <button
                              key={emoji}
                              onClick={() => copyEmoji(emoji)}
                              className={`
                                text-2xl p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 
                                transition-all duration-200 hover:scale-110
                                ${isCopied ? 'ring-2 ring-emerald-500 ring-offset-2 bg-emerald-50 dark:bg-emerald-900/30' : ''}
                              `}
                              title={isCopied ? 'Copié !' : 'Cliquer pour copier'}
                            >
                              {emoji}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Pied de page */}
          <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
            <p>
              Utilisez ces ressources pour construire des interfaces cohérentes. 
              Les icônes proviennent de <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Lucide</a>.
            </p>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}