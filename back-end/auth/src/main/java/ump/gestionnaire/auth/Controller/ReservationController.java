/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import ump.gestionnaire.auth.DTO.ReservationDTO;
import ump.gestionnaire.auth.DTO.TimeSlotDto;

/**
 *
 * @author yahya
 */

@RestController
@RequestMapping("/admin/reservations")
public class ReservationController {

    private final RestTemplate restTemplate;
    
    @Value("${service.reservation.url}")
    private String reservationServiceUrl;

    public ReservationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getBaseUrl() {
        return reservationServiceUrl + "/api/reservations";
    }

    // POST - Create reservation
    @PostMapping
    public ResponseEntity<String> ajouterReservation(
            @RequestBody ReservationDTO requestDTO) {
        Map<String, Object> requestBody = createRequestBody(requestDTO);  
        
        restTemplate.postForEntity(
            getBaseUrl(), 
            requestBody, 
            Void.class
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body("Reservation created successfully");
    }

    // PUT - Update reservation
    @PutMapping("/{id}")
    public ResponseEntity<String> modifierReservation(
            @PathVariable int id, 
            @RequestBody ReservationDTO requestDTO) {
        
        Map<String, Object> requestBody = createRequestBody(requestDTO);
        String url = getBaseUrl() + "/" + id;
                
        restTemplate.put(url, requestBody);
        return ResponseEntity.ok("Reservation updated successfully");
    }

    private Map<String, Object> createRequestBody(ReservationDTO dto) {
        Map<String, Object> body = new HashMap<>();
        body.put("dateReservation", dto.getDateReservation());
        body.put("heureDebut", dto.getHeureDebut());
        body.put("heureFin", dto.getHeureFin());
        if(dto.getStatut() != null && !dto.getStatut().isEmpty()){
            body.put("statut", dto.getStatut());
        }
        body.put("utilisateur", Map.of("id", dto.getUtilisateurId()));
        body.put("local", Map.of("id", dto.getLocalId()));
        return body;
    }

    // DELETE - Delete reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimerReservation(@PathVariable int id) {
        String url = getBaseUrl() + "/" + id;
        restTemplate.delete(url);
        return ResponseEntity.noContent().build();
    }

    // GET - All reservations (keeps full response)
    @GetMapping
    public ResponseEntity<ReservationDTO[]> afficherToutesLesReservations() {
        return restTemplate.getForEntity(getBaseUrl(), ReservationDTO[].class);
    }

    @GetMapping("/search")
    public ResponseEntity<ReservationDTO[]> chercherLesReservations(@RequestParam("q") String query) {
        
        String Url = getBaseUrl() + "/search?q=" + query;
        return restTemplate.getForEntity(Url, ReservationDTO[].class);
    }
    
    // GET - Single reservation (keeps full response)
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> afficherReservationParId(@PathVariable int id) {
        String url = getBaseUrl() + "/" + id;
        return restTemplate.getForEntity(url, ReservationDTO.class);
    }
    
    @GetMapping("/availability")
    public ResponseEntity<TimeSlotDto[]> afficherToutesLesReservations(
            @RequestParam Integer localId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String url = getBaseUrl() + "/availability?localId={localId}&date={date}";
        return restTemplate.getForEntity(url, TimeSlotDto[].class, localId, date);
    }
}
