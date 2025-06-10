"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserCircle, AlertCircle, Search, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Header from '../../components/header';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';

type Grade = 'professeur' | 'ingénieur' | 'technicien';
type Responsabilite = 'administrateur' | 'chef departement' | 'adjoint chef departement' | 'directeur laboratoire' | 'utilisateur';

interface User {
  id: number;
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
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const UserDetails: React.FC<{ user: User; onDelete: () => void }> = ({ user, onDelete }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/admin/personne/${user.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');
      setSuccess(true);
      setTimeout(() => {
        onDelete();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détails de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              Utilisateur supprimé avec succès !
            </div>
          )}

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Prénom</Label>
                <div className="p-2 border rounded-md">{user.prenom}</div>
            </div>
            <div className="space-y-2">
                <Label>Nom</Label>
                <div className="p-2 border rounded-md">{user.nom}</div>
            </div>
            <div className="space-y-2">
                <Label>Date de Naissance</Label>
                <div className="p-2 border rounded-md">{user.dateNaissance}</div>
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-2 border rounded-md">{user.email}</div>
            </div>
            <div className="space-y-2">
                <Label>CIN</Label>
                <div className="p-2 border rounded-md">{user.cin}</div>
            </div>
            <div className="space-y-2">
                <Label>Téléphone</Label>
                <div className="p-2 border rounded-md">{user.telephone}</div>
            </div>
            <div className="space-y-2">
                <Label>Grade</Label>
                <div className="p-2 border rounded-md">{user.grade}</div>
            </div>
            <div className="space-y-2">
                <Label>Responsabilité</Label>
                <div className="p-2 border rounded-md">{user.responsabilite}</div>
            </div>
            <div className="space-y-2">
                <Label>Nom de la Banque</Label>
                <div className="p-2 border rounded-md">{user.nomBanque}</div>
            </div>
            <div className="space-y-2">
                <Label>Numéro SOM</Label>
                <div className="p-2 border rounded-md">{user.numeroSom}</div>
            </div>
            </div>


          <Button 
            variant="destructive" 
            className="mt-6"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-t-2 border-b-2 border-current rounded-full animate-spin" />
                Suppression...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
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

const DeleteUser = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteSuccess = () => {
    setSelectedUser(null);
  };

  return (
      <div className="w-[72%] flex flex-col items-start justify-start gap-4">
        <Header title={'Gérer les utilisateurs'}
        links={[
          { label: 'Ajouter un utilisateur', href: '/admin/utilisateurs' },
          { label: "Mettre à jour l'utilisateur", href: '/admin/utilisateurs/update' },
          { label: 'Supprimer un utilisateur', href: '/admin/utilisateurs/delete' },
        ]} activeLinkIndex={2} />
        <Card className="w-full max-w-3xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-medium">supprimer le compte d'utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-4">
              <UserSearch onUserSelect={setSelectedUser} />
              {selectedUser ? (
                <UserDetails user={selectedUser} onDelete={handleDeleteSuccess} />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Rechercher un utilisateur pour afficher les détails
                </div>
              )}
            </CardContent>
        </Card>
      </div>
  );
};

export default DeleteUser;