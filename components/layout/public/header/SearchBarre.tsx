/*
  Chemin : /components/layout/public/SearchBarre.tsx
  Rôle : Barre de recherche avec autocomplétion (simulée) et soumission vers /recherche?q=...
  Imports : React, useState, useRouter de 'next/navigation', lucide-react (Search)
  Dépendances : lucide-react
  Fichiers liés : Page de recherche (/app/recherche/page.tsx)
*/

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarreProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBarre = ({ 
  className, 
  placeholder = "Rechercher un produit...",
  onSearch 
}: SearchBarreProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative ${className || ''}`}
    >
      <div
        className={`
          relative flex items-center w-full h-12
          transition-all duration-200
          ${isFocused ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full h-full py-0 pl-11 pr-11
            text-sm font-medium
            bg-white
            border-2
            rounded-xl
            transition-all duration-200
            placeholder:text-gray-400
            focus:outline-none
            ${isFocused 
              ? 'border-orange-400 shadow-lg shadow-orange-100/50' 
              : 'border-red-500 hover:border-orange-300'
            }
          `}
          aria-label="Rechercher"
        />
        
        <Search 
          className={`
            absolute left-3.5 top-1/2 -translate-y-1/2
            w-5 h-5
            transition-colors duration-200
            ${isFocused ? 'text-orange-500' : 'text-gray-400'}
          `}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-3.5 top-1/2 -translate-y-1/2
              p-0.5
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
              rounded-full hover:bg-gray-100
            "
            aria-label="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button 
          type="submit" 
          className="sr-only"
        >
          Rechercher
        </button>
      </div>

      {/* Suggestions rapides (optionnel) */}
      {isFocused && query.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
          <div className="p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {['Pâtes', 'Huile d\'olive', 'Vins', 'Fromages', 'Chocolat'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="
                    px-3 py-1.5
                    text-xs font-medium
                    bg-gray-100 hover:bg-orange-100
                    text-gray-700 hover:text-orange-600
                    rounded-full
                    transition-colors duration-200
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBarre;