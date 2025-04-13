export interface User {
    role: "ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | 'UTILISATEUR';
    email: string;
    id: number;
}
  
export interface AuthToken {
    role: string;
    id: number;
    sub: string;
    iat: number;
    exp: number;
}