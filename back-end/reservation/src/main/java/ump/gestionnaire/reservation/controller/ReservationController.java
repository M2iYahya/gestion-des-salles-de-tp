/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.reservation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ump.gestionnaire.reservation.entity.Reservation;
import ump.gestionnaire.reservation.service.ReservationService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/**
 *
 * @author dell
 */


import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import ump.gestionnaire.reservation.DTO.TimeSlotDto;
import ump.gestionnaire.reservation.Exceptions.ConflictException;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Ajouter une réservation
    @PostMapping
    public ResponseEntity<?> ajouterReservation(@Valid @RequestBody Reservation reservation) {
        try {
            Reservation savedReservation = reservationService.ajouterReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
        } catch (ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Modifier une réservation
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> modifierReservation(@PathVariable int id, @RequestBody Reservation updatedReservation) {
        System.out.println("hhhhhhhh" + updatedReservation.toString());
        return ResponseEntity.ok(reservationService.modifierReservation(id, updatedReservation));
    }

    // Supprimer une réservation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerReservation(@PathVariable int id) {
        reservationService.supprimerReservation(id);
        return ResponseEntity.noContent().build();
    }

    // Afficher toutes les réservations
    @GetMapping
    public ResponseEntity<List<Reservation>> afficherToutesLesReservations() {
        return ResponseEntity.ok(reservationService.afficherToutesLesReservations());
    }

    // Afficher une réservation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> afficherReservationParId(@PathVariable int id) {
        return ResponseEntity.ok(reservationService.afficherReservationParId(id));
    }
    
    @GetMapping("/availability")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam Integer localId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            List<TimeSlotDto> slots = reservationService.getAvailableSlots(localId, date);
            return ResponseEntity.ok(slots);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Invalid date format. Use yyyy-MM-dd"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Reservation>> searchReservations(@RequestParam("q") String query) {
        List<Reservation> reservations = reservationService.searchReservations(query);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Integer userId) {
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(reservations);
    }
}
