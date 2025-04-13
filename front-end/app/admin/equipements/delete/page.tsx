"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Header from '../../components/header';
import LocalSearch from '../../components/LocalSearch';
import { Label } from '@radix-ui/react-label';

const DeleteLocalForm: React.FC<{ 
    local: any;
    onDelete: () => Promise<void> 
}> = ({ local, onDelete }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [confirmation, setConfirmation] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:8080/admin/local/${local.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de la suppression');
            }

            await onDelete();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setConfirmation(false);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Confirmer la suppression de {local.batiment} - Salle {local.numeroSalle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <div className="p-2 border rounded-md">{local.type}</div>
                        </div>
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
                        {local.imageLocal && (
                            <div className="space-y-2">
                                <Label>Image actuelle</Label>
                                <img 
                                    src={`http://localhost:8089${local.imageLocal}`} 
                                    alt="Local" 
                                    className="h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    {!confirmation ? (
                        <div className="flex justify-end gap-4">
                            <Button 
                                variant="destructive" 
                                onClick={() => setConfirmation(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer le local
                            </Button>
                        </div>
                    ) : (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Confirmation finale</h3>
                            <div className="flex justify-end gap-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setConfirmation(false)}
                                >
                                    Annuler
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Suppression...
                                        </div>
                                    ) : (
                                        'Confirmer la suppression'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                            Local supprimé avec succès !
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const DeleteLocal = () => {
    const [selectedLocal, setSelectedLocal] = useState<any | null>(null);

    const handleDeleteSuccess = async () => {
        setSelectedLocal(null);
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
                activeLinkIndex={2} 
            />
                <Card className="w-full max-w-3xl p-6">
                    <CardHeader className='p-0'>
                        <CardTitle className="text-base font-medium">Suppression de local</CardTitle>
                    </CardHeader>
                    <CardContent className='px-0 py-4'>
                        <LocalSearch onLocalSelect={setSelectedLocal} />
                        {selectedLocal ? (
                            <DeleteLocalForm 
                                local={selectedLocal}
                                onDelete={handleDeleteSuccess}
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Recherchez un local à supprimer
                            </div>
                        )}
                    </CardContent>
                </Card>
        </div>
    );
};

export default DeleteLocal;