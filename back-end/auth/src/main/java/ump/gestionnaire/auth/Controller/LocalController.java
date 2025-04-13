/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.auth.Controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import ump.gestionnaire.auth.DTO.LocalDTO;
import ump.gestionnaire.auth.DTO.LocalRequest;
import ump.gestionnaire.auth.DTO.MaterielDTO;

/**
 *
 * @author yahya
 */

@RestController
@RequestMapping("/admin/local")
public class LocalController {

    private final RestTemplate restTemplate;

    @Value("${service.image.url}")
    private String imageServiceUrl;

    @Value("${service.local.url}")
    private String localServiceUrl;

    public LocalController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLocal(@ModelAttribute LocalRequest localRequest) throws Exception {
        // Upload multiple images and concatenate URLs
        StringBuilder imageUrls = new StringBuilder();
        List<MultipartFile> images = localRequest.getImages();

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) { 
                System.out.println("rani f for hhh");
                String imageUrl = uploadImage(image);
                if (imageUrls.length() > 0) {
                    imageUrls.append(",");
                }
                imageUrls.append(imageUrl);
            }
        }

        System.out.println("makan walo "+imageUrls.toString());
        
        // Build the DTO with comma-separated image URLs
        LocalDTO localDto = LocalDTO.builder()
            .type(localRequest.getType())
            .capacite(localRequest.getCapacite())
            .disponibilite(localRequest.getDisponibilite())
            .batiment(localRequest.getBatiment())
            .numeroSalle(localRequest.getNumeroSalle())
            .imageLocal(imageUrls.toString())
            .materiels(localRequest.getMateriels())
            .build();

        ResponseEntity<LocalDTO> response = restTemplate.postForEntity(
            localServiceUrl + "/api/local", 
            localDto, 
            LocalDTO.class
        );

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @PostMapping("/{localId}/materiels")
    public ResponseEntity<?> createMateriels(
            @PathVariable Integer localId,
            @RequestBody List<MaterielDTO> materielDtos) {

        List<MaterielDTO> createdMateriels = new ArrayList<>();
        LocalDTO localRef = new LocalDTO();
        localRef.setId(localId);

        try {
            // Create all materiels first
            for (MaterielDTO dto : materielDtos) {
                dto.setLocal(localRef);  // Set full LocalDTO reference

                ResponseEntity<MaterielDTO> response = restTemplate.postForEntity(
                    localServiceUrl + "/api/materiel",
                    dto,
                    MaterielDTO.class
                );

                createdMateriels.add(response.getBody());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(createdMateriels);

        } catch (HttpClientErrorException e) {
            // Rollback on HTTP client errors
            createdMateriels.forEach(created -> 
                restTemplate.delete(localServiceUrl + "/api/materiel/" + created.getId())
            );
            return ResponseEntity.status(e.getStatusCode())
                .body("Equipment service error: " + e.getResponseBodyAsString());

        } catch (RestClientException e) {
            // Rollback on general errors
            createdMateriels.forEach(created -> 
                restTemplate.delete(localServiceUrl + "/api/materiel/" + created.getId())
            );
            return ResponseEntity.internalServerError()
                .body("Error creating equipment: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}/materiels")
    public ResponseEntity<?> deleteMateriels(@PathVariable Integer id) {
        try {
            restTemplate.delete(localServiceUrl + "/api/materiel/" + id);
            return ResponseEntity.ok("Local deleted successfully");
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RestClientException e) {
            return ResponseEntity.internalServerError().body("Error deleting local");
        }
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

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateLocal(
            @PathVariable Integer id,
            @RequestPart("local") LocalDTO localDto,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            // Récupération du local existant
            LocalDTO existingLocal = restTemplate.getForObject(
                localServiceUrl + "/api/local/" + id, 
                LocalDTO.class
            );

            if (existingLocal == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Local non trouvé");
            }

            String newImageUrl = existingLocal.getImageLocal();

            // Gestion de la nouvelle image
            if (file != null && !file.isEmpty()) {
                try {
                    // Upload de la nouvelle image
                    newImageUrl = uploadImage(file);

                    // Suppression de l'ancienne image si elle existe
                    if (existingLocal.getImageLocal() != null) {
                        deleteImage(existingLocal.getImageLocal());
                    }
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Échec de la gestion de l'image : " + e.getMessage());
                }
            }

            // Construction du DTO mis à jour
            LocalDTO updatedDto = LocalDTO.builder()
                .id(id)
                .type(localDto.getType())
                .capacite(localDto.getCapacite())
                .disponibilite(localDto.getDisponibilite())
                .batiment(localDto.getBatiment())
                .numeroSalle(localDto.getNumeroSalle())
                .imageLocal(newImageUrl)
                .materiels(localDto.getMateriels())
                .build();

            // Mise à jour dans le service local
            restTemplate.put(
                localServiceUrl + "/api/local/" + id,
                updatedDto
            );

            return ResponseEntity.ok(updatedDto);

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur interne : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLocal(@PathVariable Integer id) {
        try {
            // Get local to find image URL
            LocalDTO local = restTemplate.getForObject(
                localServiceUrl + "/api/local/" + id, 
                LocalDTO.class
            );

            // Delete image
            if (local.getImageLocal() != null) {
                deleteImage(local.getImageLocal());
            }

            // Delete local
            restTemplate.delete(localServiceUrl + "/api/local/" + id);

            return ResponseEntity.ok("Local deleted successfully");
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RestClientException e) {
            return ResponseEntity.internalServerError().body("Error deleting local");
        }
    }

    private String uploadImage(MultipartFile image) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", image.getResource());

        ResponseEntity<String> response = restTemplate.postForEntity(
            imageServiceUrl + "/cdn/upload",
            new HttpEntity<>(body, headers),
            String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Image upload failed");
        }
        return response.getBody();
    }

    private void deleteImage(String imageUrl) {
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        restTemplate.delete(imageServiceUrl + "/cdn/images/" + filename);
    }
}