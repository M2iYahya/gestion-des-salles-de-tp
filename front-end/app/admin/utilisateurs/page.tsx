"use client"
import Header from "../components/header";

const UserManagement = () => {
  return (
      <div className="w-[72%] flex flex-col items-start justify-start gap-4">
        <Header title={'Gérer les utilisateurs'}
          links={[
            { label: 'Ajouter un utilisateur', href: '/admin/utilisateurs' },
            { label: "Mettre à jour l'utilisateur", href: '/admin/utilisateurs/update' },
            { label: 'Supprimer un utilisateur', href: '/admin/utilisateurs/delete' },
          ]} activeLinkIndex={0} />
        <PersonRegistrationForm />
      </div>
  );
}

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserCircle, Building2, Briefcase, KeyRound } from 'lucide-react';
import { useAuth } from "@/app/components/providers/AuthProvider";
import { toast } from 'react-toastify';

interface FormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  cin: string;
  telephone: string;
  grade: Grade | '';
  adresse: string;
  ville: string;
  codePostal: string;
  responsabilite: Responsabilite | '';
  nomBanque: string;
  numeroSom: string;
  motDePasse: string;
}

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  email: '',
  cin: '',
  telephone: '',
  grade: '',
  adresse: '',
  ville: '',
  codePostal: '',
  responsabilite: '',
  nomBanque: '',
  numeroSom: '',
  motDePasse: '',
};

const PersonRegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { token } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    try {
      const response = await fetch('http://localhost:8080/admin/personne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      toast.success('Person added successfully!', {
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
      let errorMessage = 'Something went wrong!'; // Default error message

      if (error instanceof Error) {
        errorMessage = error.message; // Safely access error.message
      }

      console.error('Error:', errorMessage);

      toast.error(`Error: ${errorMessage}`, {
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
              <UserCircle className="h-6 w-6" />
              <h3 className="text-lg font-medium">Information personnels</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  name="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
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
              <h3 className="text-lg font-medium">Coordonnées</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cin">CIN</Label>
                <Input
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Briefcase className="h-6 w-6" />
              <h3 className="text-lg font-medium">Informations professionnelles</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleSelectChange('grade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROFESSEUR">Professeur</SelectItem>
                    <SelectItem value="INGENIEUR">Ingénieur</SelectItem>
                    <SelectItem value="TECHNICIEN">Technicien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsabilite">Responsabilité</Label>
                <Select
                  value={formData.responsabilite}
                  onValueChange={(value) => handleSelectChange('responsabilite', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select responsabilité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRATEUR">Administrateur</SelectItem>
                    <SelectItem value="CHEF_DEPARTEMENT">Chef Département</SelectItem>
                    <SelectItem value="ADJOINT_CHEF_DEPARTEMENT">Adjoint Chef Département</SelectItem>
                    <SelectItem value="DIRECTEUR_LABORATOIRE">Directeur Laboratoire</SelectItem>
                    <SelectItem value="UTILISATEUR">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomBanque">Nom de la banque</Label>
                <Input
                  id="nomBanque"
                  name="nomBanque"
                  value={formData.nomBanque}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroSom">Numéro SOM</Label>
                <Input
                  id="numeroSom"
                  name="numeroSom"
                  maxLength={7}
                  value={formData.numeroSom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <KeyRound className="h-6 w-6" />
              <h3 className="text-lg font-medium">Sécurité</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <Input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
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
        <CardTitle className="text-base font-medium">Formulaire d'ajout de compte - Étape {step} sur 4</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Submit
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserManagement;