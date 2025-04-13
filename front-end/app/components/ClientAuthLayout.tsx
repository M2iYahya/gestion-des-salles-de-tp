'use client';
import { ReactNode, useEffect } from 'react';
import { useAuth } from './providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

const adminRoles = [
  "ADMINISTRATEUR",
  "DIRECTEUR_LABORATOIRE",
  "ADJOINT_CHEF_DEPARTEMENT",
  "CHEF_DEPARTEMENT"
];

interface ClientAuthLayoutProps {
  children: ReactNode;
  requiredRole?: "ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | "UTILISATEUR";
  allowedRoles?: ("ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | "UTILISATEUR")[];
}

export default function ClientAuthLayout({ 
  children, 
  requiredRole,
  allowedRoles 
}: ClientAuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/');
        return;
      }

      // Handle specific role requirement
      if (requiredRole && user.role !== requiredRole) {
        if (adminRoles.includes(user.role)) {
          router.push('/admin');
        } else {
          router.push('/home');
        }
        return;
      }

      // Handle allowed roles
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (adminRoles.includes(user.role)) {
          router.push('/admin');
        } else {
          router.push('/home');
        }
        return;
      }

      // Additional routing logic for root path
      if (pathname === '/') {
        if (adminRoles.includes(user.role)) {
          router.push('/admin');
        } else {
          router.push('/home');
        }
        return;
      }
    }
  }, [user, loading, requiredRole, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative">
          {/* Outer spinner */}
          <div className="w-16 h-16 border-4 border-blue-200 border-solid rounded-full animate-spin"></div>
          {/* Inner spinner */}
          <div className="absolute top-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-lg font-medium text-gray-700">Chargement en cours</span>
          <span className="text-sm text-gray-500">Veuillez patienter...</span>
        </div>
      </div>
    );
  }

  // Only render children if authentication is valid
  if (!user || 
      (requiredRole && user.role !== requiredRole) || 
      (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}