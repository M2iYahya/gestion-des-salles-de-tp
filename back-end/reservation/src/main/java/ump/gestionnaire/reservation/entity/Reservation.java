package ump.gestionnaire.reservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "personne_id", nullable = false)
    @JsonIgnoreProperties("reservations") 
    private Personne utilisateur;

    @ManyToOne
    @JoinColumn(name = "local_id", nullable = false)
    @JsonIgnoreProperties("reservations")  
    private Local local;

    @Column(name = "date_reservation", nullable = false)
    private String dateReservation;

    @Column(name = "heure_debut", nullable = false)
    private String heureDebut;

    @Column(name = "heure_fin", nullable = false)
    private String heureFin;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutReservation statut = StatutReservation.EN_ATTENTE;

    public enum StatutReservation {
        EN_ATTENTE, APPROUVEE, REJETEE
    }
}
