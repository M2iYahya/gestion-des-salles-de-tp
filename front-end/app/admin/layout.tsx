"use client"
import React from "react";
import Header from "../components/header";
import SidePanel from "../components/sidePanel";
import "../globals.css";
import AuthLayout from "../components/AuthLayout";
import {
  HomeIcon as Home,
  UsersIcon as Utilisateurs,
  CalendarIcon as Calendrier,
  BookOpenIcon as Réservations,
  PackageIcon as Équipements,
  BarChartIcon as Rapports,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const menuItems = [
    { label: 'Home', href: '/admin', icon: Home },
    { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Utilisateurs },
    { label: 'Calendrier', href: '/admin/calendrier', icon: Calendrier },
    { label: 'Réservations', href: '/admin/reservations', icon: Réservations },
    { label: 'Équipements', href: '/admin/equipements', icon: Équipements },
    { label: 'Rapports', href: '/admin/rapports', icon: Rapports },
  ];
  
  return (
        <AuthLayout allowedRoles={[
          "ADMINISTRATEUR",
          "DIRECTEUR_LABORATOIRE",
          "ADJOINT_CHEF_DEPARTEMENT",
          "CHEF_DEPARTEMENT"
        ]}>
          <Header />
          <div className="grid grid-cols-1 md:grid-cols-[272px_1fr] min-h-screen">
            <SidePanel menuItems={menuItems} />
            <div className="w-full md:max-w-[calc(100vw-290px)] bg-slate-50 flex items-start justify-center gap-16 p-4">
              <div className="w-full flex justify-center  items-center mx-auto">{children}</div>
            </div>
          </div>
        </AuthLayout>
  );
}
