// app/b2b/brandManager/SiteForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { createSite, updateSite } from '@/actions/siteManager';

// Type pour les données du formulaire (sans brandId car passé en prop)
type SiteFormData = {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  isOpen: boolean;
};

interface SiteFormProps {
  brandId: string; // passé en prop séparée
  initialData?: SiteFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SiteForm({ brandId, initialData, onSuccess, onCancel }: SiteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [isOpen, setIsOpen] = useState(initialData?.isOpen ?? true);

  const isEdit = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On construit les données avec brandId
      const data = { name, phone, email, isOpen, brandId };
      if (isEdit) {
        await updateSite(initialData.id!, data);
        toast.success('Site mis à jour');
      } else {
        await createSite(data);
        toast.success('Site créé');
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="site-name" className="block text-sm font-medium">Nom du site *</label>
        <Input
          id="site-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Centre-ville"
          required
        />
      </div>

      <div>
        <label htmlFor="site-phone" className="block text-sm font-medium">Téléphone</label>
        <Input
          id="site-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+33 1 23 45 67 89"
        />
      </div>

      <div>
        <label htmlFor="site-email" className="block text-sm font-medium">Email</label>
        <Input
          id="site-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="site@exemple.com"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <label className="text-sm font-medium">Ouvert</label>
          <p className="text-sm text-muted-foreground">Le site est disponible pour les commandes</p>
        </div>
        <Switch checked={isOpen} onCheckedChange={setIsOpen} />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}