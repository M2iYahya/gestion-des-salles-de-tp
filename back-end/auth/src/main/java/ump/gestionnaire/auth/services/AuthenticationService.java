/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.services;

/**
 *
 * @author yahya
 */

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ump.gestionnaire.auth.DTO.LoginRequest;
import ump.gestionnaire.auth.entity.Personne;
import ump.gestionnaire.auth.repository.PersonneRepository;

@Service
public class AuthenticationService {
    private final PersonneRepository personneRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        PersonneRepository personneRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.personneRepository = personneRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Personne authenticate(LoginRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );
        
        return personneRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}