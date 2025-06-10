import { useAuth } from "@/app/components/providers/AuthProvider";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';
import { AlertCircle, Search } from "lucide-react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const LocalSearch: React.FC<{ onLocalSelect: (local: Local) => void }> = ({ onLocalSelect }) => {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Local[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
  
    const debouncedSearch = useMemo(() => 
      debounce(async (query: string) => {
        if (!query) {
          setResults([]);
          setIsOpen(false);
          return;
        }
        
        try {
          setLoading(true);
          setError('');
          const response = await fetch(
            `${apiUrl}/admin/local/search/${encodeURIComponent(query)}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          
          if (!response.ok) throw new Error('Search failed');
          const data = await response.json();
          
          const locals = Array.isArray(data) ? data : [data];
          setResults(locals);
          setIsOpen(locals.length > 0);
        } catch (err) {
          setError('Failed to search locations');
          setIsOpen(false);
        } finally {
          setLoading(false);
        }
      }, 300)
    , [token]);
  
    useEffect(() => {
      debouncedSearch(searchTerm);
      return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleLocalSelect = (local: Local) => {
      onLocalSelect(local);
      setSearchTerm('');
      setResults([]);
      setIsOpen(false);
    };
  
    return (
      <div className="relative mb-8" ref={containerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Recherchez les local par type ..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => results.length > 0 && setIsOpen(true)}
          />
        </div>
  
        {error && (
          <div className="mt-2 text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
  
        {loading && (
          <div className="mt-2 text-gray-600">Searching...</div>
        )}
  
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {results.map((local) => (
              <div
                key={local.id}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleLocalSelect(local)}
              >
                <div className="font-medium">{local.batiment} - Salle {local.numeroSalle}</div>
                <div className="text-sm text-gray-600">Type: {local.type}</div>
                <div className="text-sm text-gray-600">
                  Capacité: {local.capacite} | Statut: {local.disponibilite ? 'Available' : 'Occupied'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default LocalSearch;