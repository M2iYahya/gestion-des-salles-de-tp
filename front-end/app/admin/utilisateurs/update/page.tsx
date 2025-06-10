"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserCircle, Building2, Briefcase, KeyRound, AlertCircle, Search } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Header from '../../components/header';
import { debounce } from 'lodash';

interface UpdateUserFormProps {
  user: User;
  onUpdateSuccess?: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user: initialUser, onUpdateSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(initialUser);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    setUser(initialUser);
    setStep(1);
  }, [initialUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/admin/personne/${user.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error('Update failed');
      onUpdateSuccess?.();
    } catch (error) {
      setError('Failed to update user information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (!user) return null;

    switch(step) {
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
                  value={user.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={user.prenom}
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
                  value={user.dateNaissance}
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
                  value={user.email}
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
                  value={user.cin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={user.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={user.adresse || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={user.ville || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  name="codePostal"
                  value={user.codePostal || ""}
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
                  value={user.grade}
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
                  value={user.responsabilite}
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
                  value={user.nomBanque}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroSom">Numéro SOM</Label>
                <Input
                  id="numeroSom"
                  name="numeroSom"
                  maxLength={7}
                  value={user.numeroSom}
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

  if (loading && !user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              <p>Loading user data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user && error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <div className="w-full max-w-2xl">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-medium">Mettre à jour le compte- Étape {step} sur 4</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(prev => prev - 1)}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  type="button" 
                  onClick={() => setStep(prev => prev + 1)} 
                  className="ml-auto"
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="ml-auto flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading && (
                    <div className="w-4 h-4 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                  )}
                  Update
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </div>
    );
};

const UserSearch: React.FC<{ onUserSelect: (user: User) => void }> = ({ onUserSelect }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(() => 
    debounce(async (query: string) => {
      if (!query) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        const response = await fetch(
          `${apiUrl}/admin/personne/rechercher?search=${encodeURIComponent(query)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Échec de la recherche');
        const data = await response.json();
        
        // Handle both array and single object responses
        const users = Array.isArray(data) ? data : [data];
        setResults(users);
        setIsOpen(users.length > 0);
      } catch (err) {
        setError("Échec de la recherche d'utilisateurs");
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300)
  , [token]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-8" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Rechercher des utilisateurs par nom ou CIN..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
      </div>

      {error && (
        <div className="mt-2 text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-2 text-gray-600">Searching...</div>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleUserSelect(user)}
            >
              <div className="font-medium">{user.prenom} {user.nom}</div>
              <div className="text-sm text-gray-600">CIN: {user.cin}</div>
              <div className="text-sm text-gray-600">Email: {user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Update = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
      <div className="w-[72%] flex flex-col items-start justify-start gap-4">
        <Header title={'Gérer les utilisateurs'}
          links={[
            { label: 'Ajouter un utilisateur', href: '/admin/utilisateurs' },
            { label: "Mettre à jour l'utilisateur", href: '/admin/utilisateurs/update' },
            { label: 'Supprimer un utilisateur', href: '/admin/utilisateurs/delete' },
          ]} activeLinkIndex={1} />
        <Card className="w-full max-w-3xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-medium">Mettre à jour le compte</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-4">
              <UserSearch onUserSelect={setSelectedUser} />
              {selectedUser ? (
                <UpdateUserForm user={selectedUser} />
              ) : (
                <div className="text-center text-gray-500 py-8">   
                  Rechercher un utilisateur pour commencer la modification
                </div>
              )}
            </CardContent>
        </Card>
      </div>
  );
};

export default Update;