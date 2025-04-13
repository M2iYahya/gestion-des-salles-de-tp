"use client"
import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Info, AlertCircle, Phone, Mail, Banknote, Home, Briefcase, IdCard } from 'lucide-react'
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/components/providers/AuthProvider';

export default function ProfilePage() {
    const { token, user } = useAuth()
    const [profile, setProfile] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          setIsLoading(true)
          const res = await fetch(
            `http://localhost:8080/user/personne/${user?.id}`, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
  
          if (!res.ok) throw new Error(`Échec du chargement du profil (${res.status})`)
          const data = await res.json()
          setProfile(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Échec du chargement du profil')
        } finally {
          setIsLoading(false)
        }
      }
  
      if (token && user?.id) fetchProfile()
    }, [token, user?.id])
  
    if (error) {
      return (
        <div className="container max-w-2xl py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )
    }
  
    return (
      <div className="container max-w-4xl py-8">
        <Card className="p-6">
          {/* En-tête du profil */}
          <div className="mb-4">          
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-64 mx-auto" />
                ) : (
                  `${profile?.prenom} ${profile?.nom}`
                )}
              </h1>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-72" />
                ) : (
                  <>
                    <IdCard className="h-4 w-4" />
                    <span>CIN: {profile?.cin}</span>
                  </>
                )}
              </div>
            </div>
          </div>
  
          <Separator className="my-6" />
  
          {/* Détails du profil */}
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations Personnelles
                </h2>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Date de naissance</dt>
                    <dd className="font-medium">
                        {profile?.dateNaissance}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="font-medium">
                      {isLoading ? (
                        <Skeleton className="h-5 w-48" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {profile?.email}
                        </div>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Téléphone</dt>
                    <dd className="font-medium">
                      {isLoading ? (
                        <Skeleton className="h-5 w-40" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {profile?.telephone || 'Non fourni'}
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
  
              {/* Informations professionnelles */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informations Professionnelles
                </h2>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Grade</dt>
                    <dd className="font-medium">
                      {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                      ) : (
                        profile?.grade || 'Non spécifié'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Responsabilité</dt>
                    <dd className="font-medium">
                      {isLoading ? (
                        <Skeleton className="h-5 w-48" />
                      ) : (
                        profile?.responsabilite || 'Aucune'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Numéro SOM</dt>
                    <dd className="font-medium">
                      {isLoading ? (
                        <Skeleton className="h-5 w-40" />
                      ) : (
                        profile?.numeroSom || 'Non fourni'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
  
            <Separator />
  
            {/* Adresse */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5" />
                Adresse
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Adresse</dt>
                  <dd className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-5 w-48" />
                    ) : (
                      profile?.adresse || 'Non fournie'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Ville</dt>
                  <dd className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-5 w-32" />
                    ) : (
                      profile?.ville || 'Non fournie'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Code Postal</dt>
                  <dd className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-5 w-24" />
                    ) : (
                      profile?.codePostal || 'Non fourni'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
  
            <Separator />
  
            {/* Informations bancaires */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Informations Bancaires
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Nom de la banque</dt>
                  <dd className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-5 w-48" />
                    ) : (
                      profile?.nomBanque || 'Non fourni'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>
      </div>
    )
  }