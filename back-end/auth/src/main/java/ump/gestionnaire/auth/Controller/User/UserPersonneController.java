/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller.User;

/**
 *
 * @author yahya
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import ump.gestionnaire.auth.DTO.PersonneDTO;

@RestController
@RequestMapping("/user/personne")
public class UserPersonneController {

    @Autowired
    private final RestTemplate restTemplate;

    @Value("${service.personne.url}")
    private String personneServiceUrl;

    public UserPersonneController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Construct BASE_URL dynamically in methods
    private String getBaseUrl() {
        return personneServiceUrl + "/api/utilisateurs";
    }

    // Afficher un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<PersonneDTO> afficherUtilisateurParId(@PathVariable int id) {
        String url = getBaseUrl() + "/" + id;
        ResponseEntity<PersonneDTO> response = restTemplate.getForEntity(url, PersonneDTO.class);
        return ResponseEntity.ok(response.getBody());
    }
}



