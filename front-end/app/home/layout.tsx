"use client"
import React from "react";
import Header from "../components/header";
import SidePanel from "../components/sidePanel";
import "../globals.css";
import AuthLayout from "../components/AuthLayout";
import {
  HomeIcon as Home,
  BookOpenIcon as Réservations,
  User as Profile,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const menuItems = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Mes Réservations', href: '/home/reservations', icon: Réservations },
    { label: 'Profile', href: '/home/profile', icon: Profile },
  ];
  
  return (
        <AuthLayout requiredRole="UTILISATEUR">
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
