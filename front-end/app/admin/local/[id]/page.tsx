"use client"
import { useAuth } from '@/app/components/providers/AuthProvider';
import { useState, useEffect } from 'react';
import ImageCarousel from '../../../components/imageCarousel';
import { Card } from '@/components/ui/card';
import { getIdFromToken } from '@/app/utils/getRole';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const LocalPage = () => {
  const [localData, setLocalData] = useState<Local | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(-1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedStart, setSelectedStart] = useState('');
  const [selectedEnd, setSelectedEnd] = useState('');
  const { token } = useAuth();
  const [reservationData, setReservationData] = useState({
    date: '',
  });
  const [reservationStatus, setReservationStatus] = useState('');

  const UserId = getIdFromToken();

  const getLocalId = (): string => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  useEffect(() => {
    const fetchLocal = async () => {
      const id = getLocalId();
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/admin/local/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Local = await res.json();
        setLocalData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchLocal();
  }, [token]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!reservationData.date || !localData) return;
      
      try {
        setLoadingSlots(true);
        const response = await fetch(
          `${apiUrl}/admin/reservations/availability?localId=${localData.id}&date=${reservationData.date}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error('Failed to fetch availability');
        const slots: TimeSlot[] = await response.json();
        setAvailableSlots(slots);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error fetching slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailableSlots();
  }, [reservationData.date, localData, token]);

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localData?.disponibilite || !selectedStart || !selectedEnd) return;

    try {
      const response = await fetch(`${apiUrl}/admin/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: localData.id,
          utilisateurId: UserId,
          dateReservation: reservationData.date,
          heureDebut: selectedStart,
          heureFin: selectedEnd,
        }),
      });

      if (response.ok) {
        setReservationStatus('Reservation réussie!');
        setReservationData({ date: '' });
        setSelectedStart('');
        setSelectedEnd('');
      } else {
        const errorData = await response.json();
        setReservationStatus(errorData.message || 'Reservation failed');
      }
    } catch (err) {
      setReservationStatus('Network error. Please try again.');
    }
  };

  const generateTimeOptions = (startTime: string, endTime: string, interval: number = 15) => {
    const options: string[] = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    while (start < end) {
      const hours = start.getHours().toString().padStart(2, '0');
      const minutes = start.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      options.push(timeString);
      
      start.setMinutes(start.getMinutes() + interval);
    }
    
    // Add the end time if it's not already included
    const endHours = end.getHours().toString().padStart(2, '0');
    const endMinutes = end.getMinutes().toString().padStart(2, '0');
    const endTimeString = `${endHours}:${endMinutes}`;
    if (!options.includes(endTimeString)) {
      options.push(endTimeString);
    }
    
    return options;
  };

  const getAvailableStartTimes = (slot: TimeSlot): string[] => {
    return generateTimeOptions(slot.start, slot.end);
  };

  const getAvailableEndTimes = (startTime: string, slot: TimeSlot): string[] => {
    const allTimes = generateTimeOptions(startTime, slot.end);
    return allTimes.filter(time => time > startTime);
  };

  const handleStartTimeChange = (value: string, slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    setSelectedStart(value);
    setSelectedEnd('');
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!localData) return <div className="p-4 text-center">Local not found</div>;

  return (
    <div className="mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Section galerie d'images inchangée */}
        <Card className="rounded-lg h-fit overflow-hidden p-6">
          <ImageCarousel images={localData.imageLocal} />
        </Card>
        <div className="space-y-6">
          {/* En-tête avec statut */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {localData.batiment} - {localData.numeroSalle}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                localData.disponibilite 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {localData.disponibilite ? 'Disponible' : 'Indisponible'}
              </span>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Capacité : {localData.capacite}</span>
                <span>• Type : {localData.type}</span>
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Équipements</h2>
            <div className="grid grid-cols-2 gap-3">
              {localData.materiels.map((materiel) => (
                <div key={materiel.id} className="p-3 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium">{materiel.nom}</h3>
                  <p className="text-sm text-gray-600">
                    {materiel.type} (x{materiel.quantite})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire de réservation */}
          {localData.disponibilite && (
            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-4">Réserver ce local</h2>
              <form onSubmit={handleReservation} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date de réservation</Label>
                  <Input
                    type="date"
                    id="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                    value={reservationData.date}
                    onChange={(e) => {
                      setReservationData({ date: e.target.value });
                      setSelectedStart('');
                      setSelectedEnd('');
                    }}
                  />
                </div>

                {reservationData.date && (
                  <div className="space-y-4">
                    <Label>Créneaux disponibles</Label>
                    {loadingSlots ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid gap-4">
                        {availableSlots.map((slot, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                              <Clock className="h-4 w-4 text-blue-600" />
                              {slot.start} - {slot.end}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Heure de début</Label>
                                <select
                                  value={selectedSlotIndex === index ? selectedStart : ''}
                                  onChange={(e) => handleStartTimeChange(e.target.value, index)}
                                  className="w-full p-2 border rounded-md"
                                >
                                  <option value="">Sélectionnez...</option>
                                  {getAvailableStartTimes(slot).map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Heure de fin</Label>
                                <select
                                  value={selectedEnd}
                                  onChange={(e) => setSelectedEnd(e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                  disabled={selectedSlotIndex !== index}
                                >
                                  <option value="">Sélectionnez...</option>
                                  {selectedStart && selectedSlotIndex === index &&
                                    getAvailableEndTimes(
                                      selectedStart,
                                      availableSlots[selectedSlotIndex]
                                    ).map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-red-500 text-sm">
                        Aucun créneau disponible pour cette date
                      </div>
                    )}
                  </div>
                )}

                {selectedStart && selectedEnd && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Sélection : {selectedStart} - {selectedEnd}
                      </p>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Confirmer la réservation
                    </Button>
                  </div>
                )}

                {reservationStatus && (
                  <div className={`p-4 rounded-lg flex items-center gap-2 ${
                    reservationStatus.includes('réussie') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reservationStatus.includes('réussie') ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span>{reservationStatus}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalPage;