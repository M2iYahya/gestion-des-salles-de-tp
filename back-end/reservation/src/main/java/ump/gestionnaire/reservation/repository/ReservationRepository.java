/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.reservation.repository;

/**
 *
 * @author dell
 */
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ump.gestionnaire.reservation.entity.Local;
import ump.gestionnaire.reservation.entity.Personne;
import ump.gestionnaire.reservation.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    @Query("SELECT r FROM Reservation r WHERE " +
           "r.local.id = :localId AND " +
           "r.dateReservation = :date AND " +
           "((r.heureDebut < :heureFin AND r.heureFin > :heureDebut) OR " +
           "(r.heureDebut = :heureDebut AND r.heureFin = :heureFin))")
    List<Reservation> findConflictingReservations(
        @Param("localId") int localId,
        @Param("date") String date,
        @Param("heureDebut") String startTime,
        @Param("heureFin") String endTime
    );
    
    List<Reservation> findByLocalAndDateReservation(Local local, String dateReservation);
    List<Reservation> findByUtilisateurId(Integer userId);

    
    @Query("SELECT r FROM Reservation r " +
           "JOIN r.utilisateur u " +
           "JOIN r.local l " +
           "WHERE LOWER(u.nom) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.cin) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(l.numeroSalle) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(CAST(r.statut AS string)) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR r.dateReservation LIKE CONCAT('%', :query, '%')")
    List<Reservation> searchReservations(@Param("query") String query);
}