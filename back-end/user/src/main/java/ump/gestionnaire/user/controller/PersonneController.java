/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ump.gestionnaire.user.entity.Personne;
import ump.gestionnaire.user.service.PersonneService;

import java.util.List;
import org.springframework.http.HttpStatus;
/**
 *
 * @author dell
 */
@RestController
@RequestMapping("/api/utilisateurs")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    // Ajouter un utilisateur
    @PostMapping
    public ResponseEntity<Personne> ajouterUtilisateur(@RequestBody Personne personne) {
        
        return ResponseEntity.ok(personneService.ajouterPersonne(personne));
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Personne> modifierUtilisateur(@PathVariable int id, @RequestBody Personne updatedPersonne) {
        return ResponseEntity.ok(personneService.modifierPersonne(id, updatedPersonne));
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable int id) {
        personneService.supprimerPersonne(id);
        return ResponseEntity.noContent().build();
    }

    // Afficher tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Personne>> afficherTousLesUtilisateurs() {
        return ResponseEntity.ok(personneService.afficherTousLesUtilisateurs());
    }

    // Afficher un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Personne> afficherUtilisateurParId(@PathVariable int id) {
        return ResponseEntity.ok(personneService.afficherUtilisateurParId(id));
    }
    
    @GetMapping("/rechercher")
    public ResponseEntity<?> rechercher(@RequestParam String search) {
        try {
            // Check if the input is a CIN (e.g., numeric or matches a specific pattern)
            if (search.matches("[A-Z]{1,2}\\d{5,6}")) { // Adjust regex based on CIN format if necessary
                Personne personne = personneService.rechercherParCin(search);
                return ResponseEntity.ok(personne);
            } else {
                // Otherwise, assume it's a name
                List<Personne> personnes = personneService.rechercherParNom(search);
                return ResponseEntity.ok(personnes);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

