"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/components/providers/AuthProvider';
import { debounce } from 'lodash';
import { AlertCircle, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '../../components/header';

interface Reservation {
  id: number;
  utilisateur: {
    id: number;
    prenom: string;
    nom: string;
    cin: string;
  };
  local: {
    id: number
    batiment: string;
    numeroSalle: string;
    capacite: number;
  };
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE'; 
}

const ReservationSearch: React.FC<{ onResrvationSelect: (reservation: Reservation) => void }> = ({ onResrvationSelect }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Reservation[]>([]);
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
          `http://localhost:8080/admin/reservations/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Échec de la recherche');
        const data = await response.json();
        
        // Handle both array and single object responses
        const reservations = Array.isArray(data) ? data : [data];
        setResults(reservations);
        setIsOpen(reservations.length > 0);
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

  const handleReservationSelect = (resrvation: Reservation) => {
    onResrvationSelect(resrvation);
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-8" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Rechercher reservation par nom, CIN, statut or Date..."
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
          {results.map((reservation) => (
            <div
              key={reservation.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleReservationSelect(reservation)}
            >
              <div className="font-medium">{reservation.utilisateur.prenom} {reservation.utilisateur.nom}</div>
              <div className="text-sm text-gray-600">local: {reservation.local.batiment} - {reservation.local.numeroSalle}</div>
              <div className="text-sm text-gray-600">Date: {reservation.dateReservation}, de : {reservation.heureDebut} à {reservation.heureFin} </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DeleteReservationForm = ({ reservation }: { reservation: Reservation }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?");
    if (!confirmDelete) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/admin/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la suppression");
      }

      setSuccess('Réservation supprimée avec succès');
      setTimeout(() => {
        setSuccess('');
        window.location.reload(); // Refresh to clear selection
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Détails de la réservation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Utilisateur</label>
            <p className="font-medium">{reservation.utilisateur.prenom} {reservation.utilisateur.nom}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">CIN</label>
            <p className="font-medium">{reservation.utilisateur.cin}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Local</label>
            <p className="font-medium">{reservation.local.batiment} - {reservation.local.numeroSalle}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Date</label>
            <p className="font-medium">{reservation.dateReservation}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Heures</label>
            <p className="font-medium">{reservation.heureDebut} - {reservation.heureFin}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Statut</label>
            <p className="font-medium">{reservation.statut}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={loading}
        className="w-full mt-4"
      >
        {loading ? (
          <span>Suppression en cours...</span>
        ) : (
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Supprimer définitivement la réservation</span>
          </div>
        )}
      </Button>
    </div>
  );
};

function DeleteReservationPage() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  return (
    <div className="w-[72%] flex flex-col items-start justify-start gap-4">
      <Header 
        title={'Gestion des Réservations'}
        links={[
          { label: "Mettre à jour une Réservation", href: '/admin/reservations' },
          { label: 'Supprimer une Réservation', href: '/admin/reservations/delete' },
        ]} 
        activeLinkIndex={1} 
      />
      
      <Card className="w-full max-w-3xl p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base font-medium">Supprimer une réservation</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-4">
          <ReservationSearch onResrvationSelect={setSelectedReservation} />
          
          {selectedReservation ? (
            <DeleteReservationForm reservation={selectedReservation} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Rechercher une réservation pour la supprimer
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeleteReservationPage;