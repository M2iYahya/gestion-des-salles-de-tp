// AuthLayout.tsx
import { ReactNode } from 'react';
import { AuthProvider } from './providers/AuthProvider';
import ClientAuthLayout from './ClientAuthLayout';

type UserRole = "ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | 'UTILISATEUR';

interface AuthLayoutProps {
  children: ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

export default function AuthLayout({ 
  children, 
  requiredRole,
  allowedRoles 
}: AuthLayoutProps) {
  // If requiredRole is specified, create a single-item array
  const roles = requiredRole ? [requiredRole] : allowedRoles;
  
  return (
    <AuthProvider>
      <ClientAuthLayout allowedRoles={roles}>
        {children}
      </ClientAuthLayout>
    </AuthProvider>
  );
}