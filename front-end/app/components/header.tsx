import React, { useState } from 'react';
import { Search, Settings, HelpCircle, Menu, X } from 'lucide-react';
import Image from './image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Header() {
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/disconnect`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to log out:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="w-full z-50 sticky top-0 bg-white border-b">
      <div className="w-full mx-auto px-4 md:px-8 h-[70px]">
        <div className="h-full flex items-center justify-between gap-4">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <Image 
                className="h-10 md:h-16 w-auto"
                src="/assets/logo-fso.svg"
                alt="FSO Lab Management"
                fallbackSrc={''}
              />
              <h1 className='font-bold text-xl md:text-3xl font-mono hidden sm:block'>
                GestSalle
              </h1>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <input
              type="text"
              placeholder="Rechercher une salle, un équipement..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 hover:bg-gray-100 rounded-xl text-sm md:text-base"
              >
                Se déconnecter
              </button>
            </div>

            {/* Mobile Logout */}
            <button 
              onClick={handleLogout} 
              className="md:hidden px-3 py-2 hover:bg-gray-100 rounded-xl text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;