"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Header from '../../components/header';
import LocalSearch from '../../components/LocalSearch';

type LocalType = 
  | "mecanique" 
  | "optique" 
  | "thermodynamique" 
  | "electromagnetisme" 
  | "electronique" 
  | "chimie";

interface Local {
  id: number | null;
  type: LocalType;
  capacite: number;
  disponibilite: boolean;
  batiment: string;
  numeroSalle: string;
  imageLocal?: string;
  materiels: any[];
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const UpdateLocalForm: React.FC<{ 
    local: Local;
    onUpdate: (updatedLocal: Local) => Promise<void> 
  }> = ({ local, onUpdate }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<Local>(local);
  
    const handleChange = <K extends keyof Local>(field: K, value: Local[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setImageFile(e.target.files[0]);
      }
    };
  
    const handleSubmit = async () => {
        try {
          setLoading(true);
          setError(null);
      
          const formPayload = new FormData();
      
          // Ajouter l'image si elle existe
          if (imageFile) {
            formPayload.append('file', imageFile);
          }
      
          // Créer un objet JSON valide avec les données
          const localData = {
            type: formData.type,
            batiment: formData.batiment,
            numeroSalle: formData.numeroSalle,
            capacite: formData.capacite,
            disponibilite: formData.disponibilite,
          };
      
          // Ajouter les données au format JSON
          formPayload.append('local', new Blob([JSON.stringify(localData)], {
            type: 'application/json'
          }));
      
          const response = await fetch(`${apiUrl}/admin/local/${local.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formPayload
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Échec de la mise à jour');
          }
      
          const updatedLocal = await response.json();
          await onUpdate(updatedLocal);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="w-full max-w-4xl mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Mettre à jour {local.batiment} - Salle {local.numeroSalle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bâtiment</Label>
              <Input
                value={formData.batiment}
                onChange={(e) => handleChange('batiment', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Numéro de salle</Label>
              <Input
                value={formData.numeroSalle}
                onChange={(e) => handleChange('numeroSalle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacité</Label>
              <Input
                type="number"
                value={formData.capacite}
                onChange={(e) => handleChange('capacite', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Disponibilité</Label>
              <Select
                value={formData.disponibilite ? 'true' : 'false'}
                onValueChange={(value) => handleChange('disponibilite', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Disponible</SelectItem>
                  <SelectItem value="false">Occupé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value as LocalType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {(["mecanique", "optique", "thermodynamique", "electromagnetisme", "electronique", "chimie"] as const).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imageLocal && (
                <div className="mt-2 text-sm text-gray-600">
                  Image actuelle : <a href={`http://localhost:8089${formData.imageLocal}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir</a>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              Local mis à jour avec succès !
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mise à jour...
                </div>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UpdateLocal = () => {
  const { token } = useAuth();
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);

  const handleUpdate = async (updatedLocal: Local) => {
    const response = await fetch(`${apiUrl}/admin/local/${updatedLocal.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de la mise à jour');
    }
  };

  return (
    <div className="w-[72%] flex flex-col items-start justify-start gap-2">
      <Header 
        title={'Gérer les équipements'}
        links={[
          { label: 'Ajouter un Local', href: '/admin/equipements' },
          { label: "Mettre à jour un Local", href: '/admin/equipements/update' },
          { label: 'Supprimer un Local', href: '/admin/equipements/delete' },
          { label: 'Gérer les materiel des Local', href: '/admin/equipements/gest' },  
        ]} 
        activeLinkIndex={1} 
      />
        <Card className="w-full max-w-3xl p-6">
          <CardHeader className='p-0'>
            <CardTitle className="text-base font-medium">Mise à jour des informations du local</CardTitle>
          </CardHeader>
          <CardContent className='px-0 py-4'>
            <LocalSearch onLocalSelect={setSelectedLocal} />
            {selectedLocal ? (
              <UpdateLocalForm 
                local={selectedLocal}
                onUpdate={handleUpdate}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Recherchez un local pour le modifier
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};

export default UpdateLocal;