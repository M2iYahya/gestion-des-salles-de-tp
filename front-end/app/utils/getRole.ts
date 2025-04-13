import { jwtDecode } from 'jwt-decode';
import { getToken } from './auth';

export interface JwtPayload {
  email: string;
  role: "ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | 'UTILISATEUR';
  id: number;
}

export const getRoleFromToken = (): 
  | "ADMINISTRATEUR"
  | "DIRECTEUR_LABORATOIRE"
  | "ADJOINT_CHEF_DEPARTEMENT"
  | "CHEF_DEPARTEMENT"
  | "UTILISATEUR"
  | null => {
  
  // Fetch the token from cookies
  const token = getToken();

  if (!token) {
    return null; // No token found
  }

  // Simulate backend returning role; you can adjust based on your backend logic
  // Assume the role is stored in the token payload as a plain string
  try {
    const decoded  = jwtDecode<JwtPayload>(token);
    const mockRole =  decoded.role; // Replace this with logic to decode the actual token.
    switch (mockRole) {
      case "ADMINISTRATEUR":
      case "DIRECTEUR_LABORATOIRE":
      case "ADJOINT_CHEF_DEPARTEMENT":
      case "CHEF_DEPARTEMENT":
      case "UTILISATEUR":
        return mockRole;
      default:
        return null;
    }
  } catch (error) {
    console.error("Error parsing role from token:", error);
    return null;
  }
};

export const getIdFromToken = (): 
| number
| null => {

  // Fetch the token from cookies
  const token = getToken();

  if (!token) {
    return null; // No token found
  }

  // Simulate backend returning role; you can adjust based on your backend logic
  // Assume the role is stored in the token payload as a plain string
  try {
    const decoded  = jwtDecode<JwtPayload>(token);
    const mockRole =  decoded.id; // Replace this with logic to decode the actual token.
    return mockRole
  } catch (error) {
    console.error("Error parsing role from token:", error);
    return null;
  }
};