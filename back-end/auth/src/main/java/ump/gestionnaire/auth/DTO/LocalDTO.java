/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

/**
 *
 * @author yahya
 */

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalDTO {
    private Integer id;                      
    private String type;                     
    private Integer capacite;                
    private Boolean disponibilite;           
    private String batiment;                 
    private String numeroSalle;              
    private String imageLocal;               
    private List<MaterielDTO> materiels;     
}
