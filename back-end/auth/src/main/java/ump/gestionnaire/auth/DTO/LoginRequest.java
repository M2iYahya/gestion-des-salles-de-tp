/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.DTO;

import lombok.Data;

/**
 *
 * @author yahya
 */

@Data
public class LoginRequest {
    private String email;
    private String password;
}
