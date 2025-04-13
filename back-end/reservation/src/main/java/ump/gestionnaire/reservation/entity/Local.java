package ump.gestionnaire.reservation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "local")
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String type;
    private int capacite;
    private String batiment;
    
    @Column(name = "numero_salle", nullable = false, length = 20)
    private String numeroSalle;
    
    @OneToMany(mappedBy = "local")
    @JsonIgnoreProperties("local")  
    private List<Reservation> reservations = new ArrayList<>();
}
