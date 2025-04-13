/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

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
public class AuthResponse {
    private boolean valid;
    private String message;
    private String token;
    private long expiresIn;   
}

