/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.reservation.service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import ump.gestionnaire.reservation.Exceptions.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ump.gestionnaire.reservation.entity.Reservation;
import ump.gestionnaire.reservation.repository.ReservationRepository;

import java.util.List;
import java.util.Optional;
import ump.gestionnaire.reservation.DTO.TimeSlotDto;
import ump.gestionnaire.reservation.entity.Local;
import ump.gestionnaire.reservation.repository.LocalRepository;
import ump.gestionnaire.reservation.repository.PersonneRepository;
/**
 *
 * @author dell
 */


@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private LocalRepository localRepository;
    
    @Autowired
    private PersonneRepository personneRepository;

    public Reservation ajouterReservation(Reservation reservation) {
        // Validate time format and logic
        validateReservationTime(reservation);
        
        // Check local availability
        checkLocalAvailability(reservation);
        
        // Check user exists
        personneRepository.findById(reservation.getUtilisateur().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return reservationRepository.save(reservation);
    }

    private void validateReservationTime(Reservation reservation) {
        if (reservation.getHeureDebut().compareTo(reservation.getHeureFin()) >= 0) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void checkLocalAvailability(Reservation reservation) {
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
            reservation.getLocal().getId(),
            reservation.getDateReservation(),
            reservation.getHeureDebut(),
            reservation.getHeureFin()
        );
        
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Local is already reserved during this time slot");
        }
    }

    // Modifier une réservation
    public Reservation modifierReservation(int id, Reservation updatedReservation) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isPresent()) {
            Reservation reservation = existingReservation.get();
            reservation.setDateReservation(updatedReservation.getDateReservation());
            reservation.setHeureDebut(updatedReservation.getHeureDebut());
            reservation.setHeureFin(updatedReservation.getHeureFin());
            reservation.setStatut(updatedReservation.getStatut());
            reservation.setLocal(updatedReservation.getLocal());
            reservation.setUtilisateur(updatedReservation.getUtilisateur());
            return reservationRepository.save(reservation);
        }
        throw new RuntimeException("Réservation non trouvée");
    }

    // Supprimer une réservation
    public void supprimerReservation(int id) {
        reservationRepository.deleteById(id);
    }

    // Afficher toutes les réservations
    public List<Reservation> afficherToutesLesReservations() {
        return reservationRepository.findAll();
    }

    // Afficher une réservation par ID
    public Reservation afficherReservationParId(int id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }
    
    public List<TimeSlotDto> getAvailableSlots(Integer localId, LocalDate date) {
        // Verify local exists
        Local local = localRepository.findById(localId)
                .orElseThrow(() -> new EntityNotFoundException("Local not found"));

        // Get existing reservations for this date and local
        List<Reservation> reservations = reservationRepository
                .findByLocalAndDateReservation(local, date.toString());

        // Define operating hours (08:00 to 20:00)
        LocalTime openingTime = LocalTime.of(8, 0);
        LocalTime closingTime = LocalTime.of(20, 0);
        
        return calculateAvailableSlots(reservations, openingTime, closingTime);
    }

    private List<TimeSlotDto> calculateAvailableSlots(
            List<Reservation> reservations,
            LocalTime openingTime,
            LocalTime closingTime) {
        
        List<TimeSlotDto> availableSlots = new ArrayList<>();
        LocalTime currentStart = openingTime;

        // Sort reservations by start time
        reservations.sort(Comparator.comparing(res -> 
            LocalTime.parse(res.getHeureDebut())));

        for (Reservation res : reservations) {
            LocalTime reservationStart = LocalTime.parse(res.getHeureDebut());
            LocalTime reservationEnd = LocalTime.parse(res.getHeureFin());

            if (reservationStart.isAfter(currentStart)) {
                availableSlots.add(new TimeSlotDto(
                    currentStart.toString(),
                    reservationStart.toString()
                ));
            }
            
            // Move current start to after this reservation
            currentStart = reservationEnd.isAfter(currentStart) ? 
                          reservationEnd : currentStart;
        }

        // Add remaining time after last reservation
        if (currentStart.isBefore(closingTime)) {
            availableSlots.add(new TimeSlotDto(
                currentStart.toString(),
                closingTime.toString()
            ));
        }

        return availableSlots;
    }
    
    public List<Reservation> searchReservations(String query) {
        return reservationRepository.searchReservations(query);
    }
    
    public List<Reservation> getReservationsByUserId(Integer userId) {
        return reservationRepository.findByUtilisateurId(userId);
    }
}

