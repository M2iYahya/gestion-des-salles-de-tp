/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package ump.gestionnaire.local.entity;

/**
 *
 * @author yahya
 */

import java.util.ArrayList;
import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;
    
    @Column(nullable = false)
    private Integer capacite;
    
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    @Builder.Default
    private Boolean disponibilite = true;
    
    @Column(nullable = false, length = 50)
    private String batiment;
    
    @Column(name = "numero_salle", nullable = false, length = 20)
    private String numeroSalle;
    
    @Column(name = "image_local", length = 255)
    private String imageLocal;
    
    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Materiel> materiels = new ArrayList<>();
    
    public enum Type {
        mecanique,
        optique,
        thermodynamique, 
        electromagnetisme, 
        electronique,
        chimie
    }
}

