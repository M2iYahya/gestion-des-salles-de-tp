type Grade = 'PROFESSEUR' | 'INGENIEUR' | 'TECHNICIEN';
type Responsabilite = 'ADMINISTRATEUR' | 'CHEF_DEPARTEMENT' | 'ADJOINT_CHEF_DEPARTEMENT' | 'DIRECTEUR_LABORATOIRE' | 'UTILISATEUR';

interface User {
  id: number
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  cin: string;
  telephone: string;
  grade: Grade | '';
  adresse: string | null;
  ville: string | null;
  codePostal: string | null;
  responsabilite: Responsabilite | '';
  nomBanque: string;
  numeroSom: string;
}

type LocalType = 
  | "mecanique" 
  | "optique" 
  | "thermodynamique" 
  | "electromagnetisme" 
  | "electronique" 
  | "chimie";


interface Materiel {
  id?: number;
  nom: string;
  type: string;
  quantite: number;
}
  
  
interface Local {
  id: number | null;
  type: LocalType;
  capacite: number;
  disponibilite: boolean;
  batiment: string;
  numeroSalle: string;
  imageLocal?: string; 
  materiels: Materiel[];
}

type TimeSlot = {
  start: string;
  end: string;
};

interface Reservation {
  id: number;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE'; 
}