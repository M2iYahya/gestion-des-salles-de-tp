/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.reservation.Exceptions;

/**
 *
 * @author yahya
 */

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
