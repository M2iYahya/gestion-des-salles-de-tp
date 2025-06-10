"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Header from '../../components/header';
import LocalSearch from '../../components/LocalSearch';

const LocalDetailsForm: React.FC<{ 
  local: Local;
  onInsert: (materiels: Omit<Materiel, 'id'>[]) => Promise<void>;
  onDeleteMateriel: (materielId: number) => void;
}> = ({ local, onInsert, onDeleteMateriel }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newMateriels, setNewMateriels] = useState<Omit<Materiel, 'id'>[]>([{
    nom: '',
    type: '',
    quantite: 1
  }]);

  const addMateriel = () => {
    setNewMateriels([...newMateriels, {
      nom: '',
      type: '',
      quantite: 1
    }]);
  };

  const removeNewMateriel = (index: number) => {
    setNewMateriels(newMateriels.filter((_, i) => i !== index));
  };

  const handleMaterielChange = <T extends keyof Omit<Materiel, "id">>(
    index: number,
    field: T,
    value: Omit<Materiel, "id">[T]
  ) => {
    const updated = [...newMateriels];
    updated[index][field] = value;
    setNewMateriels(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isValid = newMateriels.every(m => 
        m.nom.trim() && m.type.trim() && m.quantite > 0
      );
      
      if (!isValid) throw new Error('Veuillez remplir tous les champs obligatoires');

      await onInsert(newMateriels);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setNewMateriels([{ nom: '', type: '', quantite: 1 }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {local.batiment} - Salle {local.numeroSalle} ({local.type})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Capacité</Label>
              <div className="p-2 border rounded-md">{local.capacite}</div>
            </div>
            <div className="space-y-2">
              <Label>Disponibilité</Label>
              <div className="p-2 border rounded-md">
                {local.disponibilite ? 'Disponible' : 'Occupé'}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Équipement existant</h3>
            
            {local.materiels.length === 0 ? (
              <div className="text-gray-500">Aucun équipement trouvé</div>
            ) : (
              local.materiels.map((materiel) => (
                <div key={materiel.id} className="mb-4 border rounded-lg p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{materiel.nom}</div>
                    <div className="text-sm text-gray-500">
                      Type: {materiel.type} | Quantité: {materiel.quantite}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => materiel.id && onDeleteMateriel(materiel.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouvel équipement</h3>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                Équipement ajouté avec succès !
              </div>
            )}

            {newMateriels.map((materiel, index) => (
              <div key={index} className="mb-6 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Équipement #{index + 1}</h4>
                  {newMateriels.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNewMateriel(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={materiel.nom}
                      onChange={(e) => handleMaterielChange(index, 'nom', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input
                      value={materiel.type}
                      onChange={(e) => handleMaterielChange(index, 'type', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      value={materiel.quantite}
                      onChange={(e) => handleMaterielChange(index, 'quantite', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={addMateriel}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un équipement
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-t-2 border-b-2 border-current rounded-full animate-spin" />
                    Insertion...
                  </div>
                ) : (
                  'Insérer l\'équipement'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InsertEquipment = () => {
  const { token } = useAuth();
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);

  const handleInsert = async (materiels: Omit<Materiel, 'id'>[]) => {
    const response = await fetch(
      `${apiUrl}/admin/local/${selectedLocal?.id}/materiels`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materiels)
      }
    );

    if (!response.ok) throw new Error('Échec de l\'insertion');
    
    const created = await response.json();
    setSelectedLocal(prev => prev ? {
      ...prev,
      materiels: [...prev.materiels, ...created]
    } : null);
  };

  const handleDeleteMateriel = async (materielId: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${apiUrl}/admin/local/${materielId}/materiels`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) throw new Error('Échec de la suppression');
    
    setSelectedLocal(prev => prev ? {
      ...prev,
      materiels: prev.materiels.filter(m => m.id !== materielId)
    } : null);
  };

  return (
    <div className="w-[72%] flex flex-col items-start justify-start gap-2">
      <Header 
        title={'Gérer les équipements'}
        links={[
          { label: 'Ajouter un Local', href: '/admin/equipements' },
          { label: "Mettre à jour un Local", href: '/admin/equipements/update' },
          { label: 'Supprimer un Local', href: '/admin/equipements/delete' },
          { label: 'Gérer le matériel des locaux', href: '/admin/equipements/gest' },  
        ]} 
        activeLinkIndex={3} 
      />
        <Card className="w-full max-w-3xl p-6">
          <CardHeader className='p-0'>
            <CardTitle className="text-base font-medium">Gestion du matériel des locaux</CardTitle>
          </CardHeader>
          <CardContent className='px-0 py-4'>
            <LocalSearch onLocalSelect={setSelectedLocal} />
            {selectedLocal ? (
              <LocalDetailsForm 
                local={selectedLocal} 
                onInsert={handleInsert}
                onDeleteMateriel={handleDeleteMateriel}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Rechercher un local pour gérer le matériel
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};

export default InsertEquipment;