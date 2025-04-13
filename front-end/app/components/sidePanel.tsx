import React, { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface SidePanelProps {
  menuItems: MenuItem[];
}

const SidePanel: React.FC<SidePanelProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('.side-panel');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-50 p-3 bg-black text-white rounded-full shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`side-panel fixed md:sticky md:top-[70px] left-0 z-40 w-[80vw] max-w-[300px] md:w-[272px] h-screen md:h-[91vh] border-r px-4 flex flex-col gap-5 bg-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <ul className="flex flex-col items-start justify-start w-full mt-5 gap-1">
          {menuItems.map(({ label, href, icon: Icon }) => {
            const isActive = currentPath === href;

            return (
              <Link
                key={label}
                href={href}
                className={`rounded-md w-full px-3 py-4 transition-colors ${
                  isActive ? "bg-[#f1f1f1]" : "hover:bg-[#f1f1f1]"
                }`}
                onClick={(e) => {
                  if (window.innerWidth < 768) setIsOpen(false);
                  setCurrentPath(new URL(e.currentTarget.href).pathname);
                }}
              >
                <li className="poppins-regular flex items-center gap-3 text-md">
                  <Icon className="w-6 h-6" />
                  {label}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SidePanel;