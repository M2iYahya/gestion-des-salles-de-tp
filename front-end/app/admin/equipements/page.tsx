"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, DoorOpen, ImageIcon, Ruler } from 'lucide-react';
import { useAuth } from "@/app/components/providers/AuthProvider";
import { toast } from 'react-toastify';
import Header from '../components/header';

interface FormData {
    type: string;
    capacite: number;
    disponibilite: boolean;
    batiment: string;
    numeroSalle: string;
    images: File[];
}

const initialFormData: FormData = {
    type: '',
    capacite: 0,
    disponibilite: true,
    batiment: '',
    numeroSalle: '',
    images: [],
};
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const LocalRegistrationForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const { token } = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        
        if (name === 'images' && files) {
            const filesArray = Array.from(files);
            setFormData(prev => ({
                ...prev,
                images: filesArray,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'capacite' ? Number(value) : value,
            }));
        }
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === 'disponibilite' ? value === 'true' : value,
        }));
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formPayload = new FormData();
        formPayload.append('type', formData.type);
        formPayload.append('capacite', formData.capacite.toString());
        formPayload.append('disponibilite', formData.disponibilite.toString());
        formPayload.append('batiment', formData.batiment);
        formPayload.append('numeroSalle', formData.numeroSalle);

        formData.images.forEach((image, index) => {
            formPayload.append(`images`, image);
        });

        try {
            const response = await fetch(`${apiUrl}/admin/local`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formPayload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la création du local');
            }

            toast.success('Local créé avec succès !', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setFormData(initialFormData);
            setStep(1);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            toast.error(`Erreur : ${errorMessage}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <DoorOpen className="h-6 w-6" />
                            <h3 className="text-lg font-medium">Informations de base</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleSelectChange('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>     
                                        <SelectItem value="mecanique">Mécanique</SelectItem>
                                        <SelectItem value="optique">Optique</SelectItem>
                                        <SelectItem value="thermodynamique">Thermodynamique</SelectItem>
                                        <SelectItem value="electromagnetisme">Électromagnétisme</SelectItem>
                                        <SelectItem value="electronique">Électronique</SelectItem>
                                        <SelectItem value="chimie">Chimie</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacite">Capacité</Label>
                                <Input
                                    id="capacite"
                                    name="capacite"
                                    type="number"
                                    value={formData.capacite}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <Building2 className="h-6 w-6" />
                            <h3 className="text-lg font-medium">Détails de l'emplacement</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batiment">Bâtiment</Label>
                                <Input
                                    id="batiment"
                                    name="batiment"
                                    value={formData.batiment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="numeroSalle">Numéro de salle</Label>
                                <Input
                                    id="numeroSalle"
                                    name="numeroSalle"
                                    value={formData.numeroSalle}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <Ruler className="h-6 w-6" />
                            <h3 className="text-lg font-medium">Disponibilité</h3>
                        </div>
                        <div className="space-y-2">
                            <Label>Disponibilité</Label>
                            <Select
                                value={formData.disponibilite.toString()}
                                onValueChange={(value) => handleSelectChange('disponibilite', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner la disponibilité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Disponible</SelectItem>
                                    <SelectItem value="false">Non disponible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <ImageIcon className="h-6 w-6" />
                            <h3 className="text-lg font-medium">Télécharger des images</h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="images">Images de la salle (clicker sur ctrl pour sélectionner plus d'images)</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-3xl p-6">
            <CardHeader className="p-0">
                <CardTitle className="text-base font-medium">
                    Formulaire d'enregistrement des locaux - Étape {step} sur 4
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-4">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {renderStep()}

                    <div className="flex justify-between">
                        {step > 1 && (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                Précédent
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button type="button" onClick={nextStep} className="ml-auto">
                                Suivant
                            </Button>
                        ) : (
                            <Button type="submit" className="ml-auto">
                                Soumettre
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};


const LocalManagement = () => {
    return (
        <div className="w-[72%] flex flex-col items-start justify-start gap-4">
          <Header title={'Gestion des équipements'}
              links={[
                  { label: 'Ajouter un Local', href: '/admin/equipements' },
                  { label: "Mettre à jour un Local", href: '/admin/equipements/update' },
                  { label: 'Supprimer un Local', href: '/admin/equipements/delete' },
                  { label: 'Gérer le matériel des Locaux', href: '/admin/equipements/gest' },  
              ]} activeLinkIndex={0} />
          <LocalRegistrationForm />
        </div>
    );
}

export default LocalManagement;