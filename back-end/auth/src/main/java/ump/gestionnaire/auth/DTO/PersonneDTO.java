/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author yahya
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonneDTO {
    private int id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String email;
    private String cin;
    private String telephone;
    private String grade;
    private String responsabilite;
    private String adresse;
    private String ville;
    private String codePostal;
    private String nomBanque;
    private String numeroSom;
    private String motDePasse;
}
