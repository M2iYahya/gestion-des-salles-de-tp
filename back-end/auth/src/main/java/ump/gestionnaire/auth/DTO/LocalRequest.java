/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author yahya
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalRequest {
    private Integer id;               
    private String type;              
    private Integer capacite;         
    private Boolean disponibilite;    
    private String batiment;          
    private String numeroSalle;
    private List<MultipartFile> images;
    private String imageLocal;
    private List<MaterielDTO> materiels;
}