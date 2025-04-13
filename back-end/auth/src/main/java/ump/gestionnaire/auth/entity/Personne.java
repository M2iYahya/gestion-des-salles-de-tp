/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.entity;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 *
 * @author yahya
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personne")
public class Personne implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(name = "date_naissance", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateNaissance;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(nullable = false, length = 20, unique = true)
    private String cin;

    @Column(nullable = false, length = 20)
    private String telephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Grade grade;

    @Column(length = 255)
    private String adresse;

    @Column(length = 100)
    private String ville;

    @Column(name = "code_postal", length = 10)
    private String codePostal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Responsabilite responsabilite;

    @Column(name = "nom_banque", length = 100)
    private String nomBanque;

    @Column(name = "numero_som", nullable = false, length = 7, unique = true)
    private String numeroSom;

    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword(){
        return motDePasse;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum Grade {
        PROFESSEUR, INGENIEUR, TECHNICIEN
    }

    public enum Responsabilite {
        ADMINISTRATEUR,
        CHEF_DEPARTEMENT,
        ADJOINT_CHEF_DEPARTEMENT,
        DIRECTEUR_LABORATOIRE,
        UTILISATEUR
    }
}