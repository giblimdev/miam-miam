// app/b2b/brandManager/BrandForm.tsx
'use client';

import { useState, useRef, useEffect, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { createBrand, updateBrand } from '@/actions/brandManager';
import { slugify } from '@/lib/utils/slugify';
import { BRAND_TYPES, getBrandTypeLabel } from '@/lib/data/brandTypeData';

import {
  AlertCircle,
  Upload,
  X,
  ImageIcon,
  FileText,
  CheckCircle,
  Plus,
  Save,
  Loader2,
} from 'lucide-react';

import type {
  CreateBrandInput,
  UpdateBrandInput,
} from '@/lib/validations/brand';

/* ============================================================
   TYPES
   ============================================================ */

interface FileWithPreview extends File {
  preview?: string;
}

interface BrandFormProps {
  initialData?: CreateBrandInput & { id?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

/* ============================================================
   CONFIGURATION
   ============================================================ */

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_FILE_SIZE = 199 * 1024;

/* ============================================================
   COMPONENT
   ============================================================ */

export function BrandForm({ initialData, onSuccess, onCancel }: BrandFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  /* ============================================================
     FORM STATE
     ============================================================ */

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [types, setTypes] = useState<string[]>(initialData?.type || []);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFile, setLogoFile] = useState<FileWithPreview | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(initialData?.logo || '');

  const isEdit = !!initialData?.id;

  /* ============================================================
     SLUG AUTOMATIQUE
     ============================================================ */

  useEffect(() => {
    if (name && !isEdit) {
      setSlug(slugify(name));
    }
  }, [name, isEdit]);

  /* ============================================================
     NETTOYAGE PREVIEW
     ============================================================ */

  useEffect(() => {
    return () => {
      if (logoFile?.preview) {
        URL.revokeObjectURL(logoFile.preview);
      }
    };
  }, [logoFile]);

  /* ============================================================
     VALIDATION FICHIER
     ============================================================ */

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `Format non autorisé. Utilisez : ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024} Ko)`;
    }
    return null;
  };

  /* ============================================================
     GESTION DU LOGO
     ============================================================ */

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    const preview = URL.createObjectURL(file);
    const fileWithPreview = Object.assign(file, { preview });
    setLogoFile(fileWithPreview);
    setLogoPreview(preview);
    setLogoFileName(file.name);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors((prev) => ({ ...prev, logo: '' }));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleLogoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoFileName(e.target.value);
  };

  const removeLogo = () => {
    if (logoFile?.preview) {
      URL.revokeObjectURL(logoFile.preview);
    }
    setLogoFile(null);
    setLogoPreview('');
    setLogoFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* ============================================================
     TYPES DE MARQUE (sélection multi)
     ============================================================ */

  const toggleType = (value: string) => {
    setTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  /* ============================================================
     VALIDATION
     ============================================================ */

  const isFormValid = (): boolean => {
    if (!name.trim()) return false;
    if (!slug.trim()) return false;
    if (!isEdit && !logoFile && !logoPreview) return false;
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!slug.trim()) newErrors.slug = 'Le slug est obligatoire';
    if (!isEdit && !logoFile && !logoPreview) {
      newErrors.logo = 'Le logo est obligatoire pour une nouvelle marque';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ============================================================
     SUBMIT
     ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setLoading(true);
    try {
      let logoUrl = logoPreview || initialData?.logo || '';
      if (logoFile) {
        const extension = logoFile.name.split('.').pop();
        const fileName = logoFileName.trim() || `${slug}.${extension}`;
        logoUrl = `/uploads/brands/${fileName}`;
        // TODO : remplacer par un vrai upload vers votre API
      }
      const data = { name, slug, description, logo: logoUrl, website, type: types };
      if (isEdit) {
        await updateBrand(initialData.id!, data as UpdateBrandInput);
        toast.success('Marque mise à jour avec succès !');
      } else {
        await createBrand(data as CreateBrandInput);
        toast.success('Marque créée avec succès !');
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     HELPERS
     ============================================================ */

  const isFieldError = (field: string) => !!errors[field];
  const requiredMark = <span className="ml-0.5 text-destructive">*</span>;
  const formValid = isFormValid();

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 pb-20">
      {/* ---- NOM + SLUG ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Nom de la marque {requiredMark}
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Pizzeria Bella"
            className={`transition-colors ${
              isFieldError('name')
                ? 'border-destructive focus-visible:ring-destructive'
                : name.trim()
                ? 'border-emerald-500 focus-visible:ring-emerald-500'
                : 'border-muted focus-visible:ring-primary'
            }`}
            aria-invalid={isFieldError('name')}
            data-error={isFieldError('name')}
          />
          {errors.name ? (
            <p className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.name}
            </p>
          ) : (
            name.trim() && (
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle className="h-3 w-3" /> Valide
              </p>
            )
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="slug" className="block text-sm font-medium text-foreground">
            Slug {requiredMark}
          </label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: pizzeria-bella"
            className={`transition-colors ${
              isFieldError('slug')
                ? 'border-destructive focus-visible:ring-destructive'
                : slug.trim()
                ? 'border-emerald-500 focus-visible:ring-emerald-500'
                : 'border-muted focus-visible:ring-primary'
            }`}
            aria-invalid={isFieldError('slug')}
            data-error={isFieldError('slug')}
          />
          <p className="text-xs text-muted-foreground">
            Généré automatiquement, modifiable.
          </p>
          {errors.slug ? (
            <p className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.slug}
            </p>
          ) : (
            slug.trim() && (
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle className="h-3 w-3" /> Valide
              </p>
            )
          )}
        </div>
      </div>

      {/* ---- LOGO ---- */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Logo {requiredMark}
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              relative flex min-h-[150px] flex-col items-center justify-center rounded-lg
              border-2 border-dashed p-6 transition-all duration-200
              ${isDragging ? 'border-orange-500 bg-orange-50 shadow-lg dark:bg-orange-950/20' : ''}
              ${isFieldError('logo') ? 'border-destructive bg-destructive/5' : ''}
              ${
                !isFieldError('logo') && (logoPreview || logoFile)
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10'
                  : 'border-muted-foreground/25 hover:border-orange-400/60 hover:bg-orange-50/50 dark:hover:bg-orange-950/10'
              }
            `}
          >
            {logoPreview ? (
              <div className="relative flex w-full flex-col items-center">
                <img
                  src={logoPreview}
                  alt="Aperçu du logo"
                  className="max-h-32 w-auto rounded-md object-contain"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  aria-label="Supprimer le logo"
                  className="
                    absolute -right-2 -top-2 rounded-full bg-orange-500 p-1 text-white shadow-md
                    transition-all duration-200 hover:bg-red-500 hover:scale-110 focus:outline-none
                    focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload
                  className={`h-8 w-8 ${
                    isDragging ? 'text-orange-500' : 'text-muted-foreground'
                  }`}
                />
                <p className="text-sm text-muted-foreground">
                  {isDragging ? 'Relâchez pour déposer' : 'Glissez-déposez une image'}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, GIF (max 199 Ko)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              onChange={handleFileChange}
              className="hidden"
              id="logo-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
            >
              {logoPreview ? 'Changer' : 'Parcourir'}
            </Button>
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <label htmlFor="logoFileName" className="block text-sm font-medium text-foreground">
              Nom du fichier (éditable)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="logoFileName"
                value={logoFileName}
                onChange={handleLogoNameChange}
                placeholder="mon-logo.png"
                className="border-muted pl-9 focus-visible:ring-orange-500"
                disabled={!logoFile && !logoPreview}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Laissez vide pour utiliser le nom du fichier uploadé.
            </p>
            {logoFile && (
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <ImageIcon className="h-3 w-3" /> {logoFile.name} (
                {(logoFile.size / 1024).toFixed(0)} Ko)
              </p>
            )}
          </div>
        </div>

        {errors.logo && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3 w-3" /> {errors.logo}
          </p>
        )}
        {!errors.logo && (logoFile || logoPreview) && (
          <p className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle className="h-3 w-3" /> Logo sélectionné
          </p>
        )}
      </div>

      {/* ---- DESCRIPTION ---- */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la marque"
          rows={3}
          className="resize-vertical border-muted focus-visible:ring-orange-500"
        />
      </div>

      {/* ---- SITE WEB ---- */}
      <div className="space-y-1">
        <label htmlFor="website" className="block text-sm font-medium text-foreground">
          Site web
        </label>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          className="border-muted focus-visible:ring-orange-500"
        />
      </div>

      {/* ---- TYPES DE MARQUE (SÉLECTION MULTI) ---- */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Types de marque
        </label>
        <p className="text-xs text-muted-foreground">
          Sélectionnez un ou plusieurs types correspondant à votre enseigne.
        </p>
        <div className="flex flex-wrap gap-2">
          {BRAND_TYPES.map(({ value, label, emoji }) => {
            const isSelected = types.includes(value);
            return (
              <Button
                key={value}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(value)}
                className={`transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                    : 'hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20'
                }`}
              >
                <span className="mr-1">{emoji}</span>
                {label}
                {isSelected && <CheckCircle className="ml-1 h-3 w-3" />}
              </Button>
            );
          })}
        </div>
        {types.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground">Sélectionnés :</span>
            {types.map((v) => (
              <Badge key={v} variant="secondary" className="text-xs">
                {getBrandTypeLabel(v)}
              </Badge>
            ))}
          </div>
        )}
        {types.length === 0 && (
          <p className="text-xs italic text-muted-foreground">Aucun type sélectionné.</p>
        )}
      </div>

      {/* ---- ACTIONS (STICKY) ---- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 rounded-xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur-sm sm:flex-row">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="order-2 w-full sm:order-1 sm:w-auto"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || !formValid}
          className={`
            order-1 w-full rounded-xl border-0 font-semibold text-white shadow-md
            transition-all duration-200 sm:order-2 sm:w-auto
            ${
              !loading && formValid
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25'
                : 'cursor-not-allowed bg-orange-300 opacity-60'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : isEdit ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Mettre à jour
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Créer la marque
            </>
          )}
        </Button>
      </div>
    </form>
  );
}