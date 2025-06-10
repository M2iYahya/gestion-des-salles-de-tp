'use client';
import AuthLayout from "../components/AuthLayout";

import React from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { Building, Wrench, User } from 'lucide-react';
import { getFirstImage } from "../utils/utils";
import Link from "next/link";


interface Materiel {
  id: number;
  nom: string;
  type: string;
  quantite: number;
  imageMateriel?: string;
}

interface Local {
  id: number;
  type: 'mecanique' | 'optique' | 'thermodynamique' | 'electromagnetisme' | 'electronique' | 'chimie';
  capacite: number;
  disponibilite: boolean;
  batiment: string;
  numeroSalle: string;
  imageLocal?: string;
  materiels: Materiel[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AdminHome = () => {
  const [locals, setLocals] = React.useState<Local[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { token } = useAuth();

  console.log('Auth API:', process.env.NEXT_PUBLIC_API_URL);

  React.useEffect(() => {
    const fetchPersonnes = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}/admin/local`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: Local[] = await res.json();
        setLocals(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonnes();
  }, [token]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
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

  const getLocalTypeColor = (type: Local['type']) => {
    const colors = {
      mecanique: 'bg-blue-100 text-blue-800',
      optique: 'bg-purple-100 text-purple-800',
      thermodynamique: 'bg-red-100 text-red-800',
      electromagnetisme: 'bg-green-100 text-green-800',
      electronique: 'bg-yellow-100 text-yellow-800',
      chimie: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  
  return (
    <div className="w-[90%] bg-slate-50 min-h-screen px-8 py-4">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Locaux</h1>
          <p className="mt-2 text-gray-600">Gérez les espaces et le matériel de votre établissement</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
          {locals.map((local) => (
            <Link href={`/admin/local/${local.id}`} key={local.id} className="bg-white rounded-xl hover:shadow-md transition-shadow cursor-pointer duration-200">
              {local.imageLocal ? (
                  <div className="relative h-48 w-full">
                  <img 
                    src={`http://localhost:8089${getFirstImage(local.imageLocal)}`}
                    alt="Local preview"
                    className="rounded-t-xl object-cover h-full w-full"
                  /></div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Aucune image disponible</span>
                  </div>
                )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {local.batiment} - {local.numeroSalle}
                  </h2>
                  <span className={`${getLocalTypeColor(local.type)} px-3 py-1 rounded-full text-sm`}>
                    {local.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="w-5 h-5" />
                    <span>Capacité: {local.capacite} personnes</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${local.disponibilite ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={local.disponibilite ? 'text-green-600' : 'text-red-600'}>
                      {local.disponibilite ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>

                  {local.materiels?.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                        <Wrench className="w-5 h-5" />
                        <span>Matériels ({local.materiels.length})</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {local.materiels.map((materiel) => (
                          <div key={materiel.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                            {materiel.imageMateriel && (
                              <img 
                                src={materiel.imageMateriel} 
                                alt={materiel.nom}
                                className="w-8 h-8 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{materiel.nom}</p>
                              <p className="text-xs text-gray-500">
                                {materiel.quantite}x {materiel.type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {locals.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mb-4 text-gray-400">
              <Building className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">Aucun local trouvé</p>
            <p className="text-sm text-gray-500 mt-1">Commencez par ajouter un nouveau local</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <AuthLayout allowedRoles={[
      "ADMINISTRATEUR",
      "DIRECTEUR_LABORATOIRE",
      "ADJOINT_CHEF_DEPARTEMENT",
      "CHEF_DEPARTEMENT"
    ]}>
      <AdminHome />
    </AuthLayout>
  );
}
