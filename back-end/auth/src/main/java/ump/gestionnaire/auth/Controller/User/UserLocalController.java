/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller.User;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import ump.gestionnaire.auth.DTO.LocalDTO;

/**
 *
 * @author yahya
 */
@RestController
@RequestMapping("/user/local")
public class UserLocalController {

    private final RestTemplate restTemplate;

    @Value("${service.local.url}")
    private String localServiceUrl;

    public UserLocalController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    @GetMapping
    public ResponseEntity<?> getAllLocals() {
        try {
            ResponseEntity<List<LocalDTO>> response = restTemplate.exchange(
                localServiceUrl + "/api/local",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LocalDTO>>() {}
            );
            return ResponseEntity.ok(response.getBody());
        } catch (RestClientException e) {
            return ResponseEntity.internalServerError().body("Failed to retrieve locals");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocalById(@PathVariable Integer id) {
        try {
            LocalDTO local = restTemplate.getForObject(
                localServiceUrl + "/api/local/" + id, 
                LocalDTO.class
            );
            return ResponseEntity.ok(local);
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RestClientException e) {
            return ResponseEntity.internalServerError().body("Error retrieving local");
        }
    }
    
    @GetMapping("/search/{type}")
    public ResponseEntity<?> getLocalsByType(@PathVariable String type) {
        try {
            ResponseEntity<List<LocalDTO>> response = restTemplate.exchange(
                localServiceUrl + "/api/local/search/" + type,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LocalDTO>>() {}
            );
            return ResponseEntity.ok(response.getBody());
        } catch (RestClientException e) {
            return ResponseEntity.internalServerError().body("Error searching locals");
        }
    }
}
