'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, decodeToken, isTokenValid } from '@/app/utils/auth';
import { User } from '@/app/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
}

const adminRoles = [
  "ADMINISTRATEUR",
  "DIRECTEUR_LABORATOIRE",
  "ADJOINT_CHEF_DEPARTEMENT",
  "CHEF_DEPARTEMENT"
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (user: User | null, currentPath: string) => {
    if (!user) {
      if (currentPath !== '/') {
        router.push('/');
      }
      return;
    }

    // If user is logged in and tries to access login page
    if (currentPath === '/') {
      if (adminRoles.includes(user.role)) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
      return;
    }

    // Handle admin routes access
    if (currentPath.startsWith('/admin')) {
      if (!adminRoles.includes(user.role)) {
        router.push('/home');
      }
      return;
    }

    // Handle home route access
    if (currentPath === '/home') {
      if (adminRoles.includes(user.role)) {
        router.push('/admin');
      }
      return;
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      
      if (!storedToken || !isTokenValid(storedToken)) {
        setUser(null);
        setToken(null);
        setLoading(false);
        handleNavigation(null, pathname);
        return;
      }

      const decoded = decodeToken(storedToken);
      if (decoded) {
        const userData = {
          role: decoded.role as "ADMINISTRATEUR" | "DIRECTEUR_LABORATOIRE" | "ADJOINT_CHEF_DEPARTEMENT" | "CHEF_DEPARTEMENT" | 'UTILISATEUR',
          email: decoded.sub,
          id: decoded.id
        };
        setUser(userData);
        setToken(storedToken);
        handleNavigation(userData, pathname);
      }
      setLoading(false);
    };

    initAuth();
  }, [pathname]); // Add pathname as dependency to react to route changes

  if (loading) {
    return null; // or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};