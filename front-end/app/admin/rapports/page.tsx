"use client"
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";
import "chart.js/auto";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import autoTable from 'jspdf-autotable';
import { Loader2 } from "lucide-react";

interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  cin: string;
}

interface Local {
  id: number;
  batiment: string;
  numeroSalle: string;
  capacite: number;
}

interface Reservation {
  id: number;
  utilisateur: Utilisateur;
  local: Local;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: "EN_ATTENTE" | "APPROUVEE" | "REJETEE";
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PageStatistiques: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const recupererReservations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}/admin/reservations`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) throw new Error(`Erreur HTTP! statut: ${res.status}`);
        const donnees = await res.json();
        setReservations(donnees);
      } catch (erreur) {
        setError(erreur instanceof Error ? erreur.message : 'Échec de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    recupererReservations();
  }, [token]);

  const statistiques = {
    total: reservations.length,
    approuvees: reservations.filter(r => r.statut === "APPROUVEE").length,
    enAttente: reservations.filter(r => r.statut === "EN_ATTENTE").length,
    rejetees: reservations.filter(r => r.statut === "REJETEE").length,
  };

  const utilisationLocaux = reservations.reduce((acc, r) => {
    const cle = `${r.local.batiment} - ${r.local.numeroSalle}`;
    acc[cle] = (acc[cle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const donneesGraphique = {
    labels: Object.keys(utilisationLocaux),
    datasets: [{
      label: "Réservations par Salle",
      data: Object.values(utilisationLocaux),
      backgroundColor: [
        '#4f46e5',
        '#7c3aed',
        '#2563eb',
        '#7c3aed',
        '#3b82f6',
      ],
    }],
  };

  const donneesStatut = {
    labels: ['Approuvées', 'En Attente', 'Rejetées'],
    datasets: [{
      data: [statistiques.approuvees, statistiques.enAttente, statistiques.rejetees],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    }],
  };

  const genererPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const largeurPage = doc.internal.pageSize.width;
      
      // En-tête
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text("Rapport des Réservations", largeurPage / 2, 20, { align: 'center' });
      
      // Date
      doc.setFontSize(12);
      doc.text(`Généré le : ${format(new Date(), 'PPP', { locale: fr })}`, largeurPage / 2, 30, { align: 'center' });

      // Résumé des statistiques
      doc.setFontSize(16);
      doc.text("Statistiques des Réservations", 14, 45);
      
      const donneesStats = [
        ['Réservations Totales', statistiques.total.toString()],
        ['Approuvées', statistiques.approuvees.toString()],
        ['En Attente', statistiques.enAttente.toString()],
        ['Rejetées', statistiques.rejetees.toString()],
      ];

      autoTable(doc, {
        startY: 50,
        head: [['Métrique', 'Nombre']],
        body: donneesStats,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
      });

      // Tableau détaillé des réservations
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Détail des Réservations", 14, 20);

      const donneesReservation = reservations.map(res => [
        `${res.utilisateur.prenom} ${res.utilisateur.nom}`,
        res.utilisateur.cin,
        `${res.local.batiment} - ${res.local.numeroSalle}`,
        format(new Date(res.dateReservation), 'PP', { locale: fr }),
        `${res.heureDebut} - ${res.heureFin}`,
        res.statut === "APPROUVEE" ? "Approuvée" :
        res.statut === "EN_ATTENTE" ? "En Attente" : "Rejetée"
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Utilisateur', 'CIN', 'Salle', 'Date', 'Horaire', 'Statut']],
        body: donneesReservation,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
        },
      });

      doc.save("rapport_reservations.pdf");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistiques et Rapport</h1>
        <Button 
          onClick={genererPDF} 
          disabled={isGeneratingPDF}
          className="flex items-center gap-2"
        >
          {isGeneratingPDF && <Loader2 className="h-4 w-4 animate-spin" />}
          {isGeneratingPDF ? 'Génération du PDF...' : 'Générer le Rapport PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total des Réservations</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-primary">{statistiques.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approuvées</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-500">{statistiques.approuvees}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>En Attente</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-yellow-500">{statistiques.enAttente}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rejetées</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-500">{statistiques.rejetees}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution d'Utilisation des Salles</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar 
              data={donneesGraphique}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Statuts de Réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut 
              data={donneesStatut}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageStatistiques;