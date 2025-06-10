"use client"

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/app/components/providers/AuthProvider';

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

interface UpdateReservationPayload {
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: string;
  localId: number;
  utilisateurId: number;
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}/admin/reservations`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setReservations(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  const handleSubmit = async (reservation: Reservation, newStatus: string) => {
    try {
      const payload: UpdateReservationPayload = {
        dateReservation: reservation.dateReservation,
        heureDebut: reservation.heureDebut,
        heureFin: reservation.heureFin,
        statut: newStatus,
        localId: reservation.local.id,
        utilisateurId: reservation.utilisateur.id
      };

      const response = await fetch(
        `${apiUrl}/admin/reservations/${reservation.id}`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (!response.ok) throw new Error('Update failed');
      
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROUVEE':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'REJETEE':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'text-yellow-500';
      case 'APPROUVEE':
        return 'text-green-500';
      case 'REJETEE':
        return 'text-red-500';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestion des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Utilisateur</TableHead>
                  <TableHead className="font-semibold">Salle</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Heure</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={`reservation-${reservation.id}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {reservation.utilisateur.prenom} {reservation.utilisateur.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CIN: {reservation.utilisateur.cin}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{reservation.local.batiment}</div>
                        <div className="text-sm">Salle {reservation.local.numeroSalle}</div>
                        <div className="text-sm text-muted-foreground">
                          Capacité: {reservation.local.capacite}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.dateReservation).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {reservation.heureDebut} - {reservation.heureFin}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(reservation.statut)}
                        <span className={getStatusStyle(reservation.statut)}>
                          {reservation.statut}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {reservation.statut === 'EN_ATTENTE' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSubmit(reservation, 'APPROUVEE')}
                              className="flex items-center gap-2"
                              variant="default"
                            >
                              <Check className="h-4 w-4" />
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmit(reservation, 'REJETEE')}
                              className="flex items-center gap-2"
                              variant="destructive"
                            >
                              <X className="h-4 w-4" />
                              Refuser
                            </Button>
                          </>
                        )}
                        {reservation.statut === 'APPROUVEE' && (
                          <Button
                            size="sm"
                            onClick={() => handleSubmit(reservation, 'REJETEE')}
                            className="flex items-center gap-2"
                            variant="destructive"
                          >
                            <X className="h-4 w-4" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReservations;