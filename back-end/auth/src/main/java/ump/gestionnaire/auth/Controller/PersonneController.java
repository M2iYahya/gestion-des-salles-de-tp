/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import ump.gestionnaire.auth.DTO.PersonneDTO;

/**
 *
 * @author yahya
 */

@RestController
@RequestMapping("/admin/personne")
public class PersonneController {

    @Autowired
    private final RestTemplate restTemplate;

    @Value("${service.personne.url}")
    private String personneServiceUrl;

    public PersonneController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Construct BASE_URL dynamically in methods
    private String getBaseUrl() {
        return personneServiceUrl + "/api/utilisateurs";
    }

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    // Ajouter un utilisateur
    @PostMapping
    public ResponseEntity<PersonneDTO> ajouterUtilisateur(@RequestBody PersonneDTO personne) {
        personne.setMotDePasse(passwordEncoder.encode(personne.getMotDePasse()));
        ResponseEntity<PersonneDTO> response = restTemplate.postForEntity(getBaseUrl(), personne, PersonneDTO.class);
        return ResponseEntity.ok(response.getBody());
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<PersonneDTO> modifierUtilisateur(@PathVariable int id, @RequestBody PersonneDTO updatedPersonne) {
        String url = getBaseUrl() + "/" + id;
        restTemplate.put(url, updatedPersonne);
        return ResponseEntity.ok(updatedPersonne);
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable int id) {
        String url = getBaseUrl() + "/" + id;
        restTemplate.delete(url);
        return ResponseEntity.noContent().build();
    }

    // Afficher tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<PersonneDTO>> afficherTousLesUtilisateurs() {
        ResponseEntity<PersonneDTO[]> response = restTemplate.getForEntity(getBaseUrl(), PersonneDTO[].class);
        return ResponseEntity.ok(Arrays.asList(response.getBody()));
    }

    // Afficher un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<PersonneDTO> afficherUtilisateurParId(@PathVariable int id) {
        String url = getBaseUrl() + "/" + id;
        ResponseEntity<PersonneDTO> response = restTemplate.getForEntity(url, PersonneDTO.class);
        return ResponseEntity.ok(response.getBody());
    }

    // Rechercher un utilisateur par CIN ou nom
    @GetMapping("/rechercher")
    public ResponseEntity<?> rechercher(@RequestParam String search) {
        String url = getBaseUrl() + "/rechercher?search=" + search;
        try {
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable");
        }
    }
}


