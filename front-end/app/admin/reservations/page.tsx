"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/header'
import { useAuth } from '@/app/components/providers/AuthProvider';
import { debounce } from 'lodash';
import { User } from '@/app/types/auth';
import { AlertCircle, Search, UserSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
          `${apiUrl}/admin/reservations/search?q=${encodeURIComponent(query)}`,
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

interface UpdateReservationPayload {
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE';
  localId: number;
  utilisateurId: number;
}

const UpdateReservationForm = ({ reservation }: { reservation: Reservation }) => {
  const { token } = useAuth();
  const [formState, setFormState] = useState({
    dateReservation: reservation.dateReservation,
    heureDebut: reservation.heureDebut,
    heureFin: reservation.heureFin,
    statut: reservation.statut
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFormState({
      dateReservation: reservation.dateReservation,
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin,
      statut: reservation.statut
    });
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate time
      if (formState.heureDebut >= formState.heureFin) {
        throw new Error("L'heure de début doit être avant l'heure de fin");
      }

      const payload: UpdateReservationPayload = {
        ...formState,
        localId: reservation.local.id,
        utilisateurId: reservation.utilisateur.id
      };

      const response = await fetch(`${apiUrl}/admin/reservations/${reservation.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la mise à jour");
      }

      setSuccess('Réservation mise à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Date de réservation</label>
          <Input
            type="date"
            required
            value={formState.dateReservation}
            onChange={(e) => setFormState(prev => ({ ...prev, dateReservation: e.target.value }))}
          />
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={formState.statut}
            onChange={(e) => setFormState(prev => ({ ...prev, statut: e.target.value as any }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="EN_ATTENTE">En attente</option>
            <option value="APPROUVEE">Approuvée</option>
            <option value="REJETEE">Rejetée</option>
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Heure de début</label>
          <Input
            type="time"
            required
            value={formState.heureDebut}
            onChange={(e) => setFormState(prev => ({ ...prev, heureDebut: e.target.value }))}
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Heure de fin</label>
          <Input
            type="time"
            required
            value={formState.heureFin}
            onChange={(e) => setFormState(prev => ({ ...prev, heureFin: e.target.value }))}
          />
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

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Envoi en cours...' : 'Mettre à jour la réservation'}
      </button>
    </form>
  );
};

function page() {
  const [selectedreservation, setSelectedreservation] = useState<Reservation | null>(null);

  return (
        <div className="w-[72%] flex flex-col items-start justify-start gap-4">
          <Header title={'Gestion des Réservations'}
              links={[
                  { label: "Mettre à jour une Réservation", href: '/admin/reservations' },
                  { label: 'Supprimer une Réservation', href: '/admin/reservations/delete' },
              ]} activeLinkIndex={0} />
          <Card className="w-full max-w-3xl p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-medium">Mettre à jour une réservation</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-4">
              <ReservationSearch onResrvationSelect={setSelectedreservation} />
              {selectedreservation ? (
                <UpdateReservationForm reservation={selectedreservation} />
              ) : (
                <div className="text-center text-gray-500 py-8">   
                  Rechercher un utilisateur pour commencer la modification
                </div>
              )}
            </CardContent>
        </Card>
        </div>
  )
}

export default page