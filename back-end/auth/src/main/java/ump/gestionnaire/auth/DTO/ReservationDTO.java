/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

/**
 *
 * @author yahya
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Integer id;
    private String dateReservation;
    private String heureDebut;
    private String heureFin;
    private String statut;
    private Integer utilisateurId;
    private Integer localId;
    private PersonneDTO utilisateur;
    private LocalDTO local;
}