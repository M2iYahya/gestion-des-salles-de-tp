/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import ump.gestionnaire.auth.DTO.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ump.gestionnaire.auth.entity.Personne;
import ump.gestionnaire.auth.services.AuthenticationService;
import ump.gestionnaire.auth.services.JwtService;
import jakarta.servlet.http.Cookie;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 *
 * @author yahya
 */

@RestController
@RequestMapping("/auth")
class AuthController {

    private final JwtService jwtService;
    
    private final AuthenticationService authenticationService;
    
    public AuthController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest loginUserDto, HttpServletResponse response) {
        System.out.println("chi7aja mcriptya : "+passwordEncoder.encode(loginUserDto.getPassword()));
        Personne authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser,authenticatedUser.getResponsabilite().toString(),authenticatedUser.getId());

        ResponseCookie cookie = ResponseCookie.from("authToken", jwtToken)
                .httpOnly(false) // Makes the cookie HTTP-only
                .secure(false) // Use true in production with HTTPS
                .path("/")
                .maxAge(60 * 60) // 1 H in seconds
                .build();

        // Add the cookie to the response
        response.addHeader("Set-Cookie", cookie.toString());
        
        AuthResponse loginResponse = new AuthResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setMessage("login mrigle");

        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping("/disconnect")
    public ResponseEntity<String> disconnect(HttpServletResponse response) {
        // Clear the SecurityContext
        SecurityContextHolder.clearContext();

        // Expire the JWT cookie
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.status(200)
                .body("User disconnected successfully, cookie expired.");
    }
    
}
