/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ump.gestionnaire.cdn.Controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author yahya
 */

@RestController
@RequestMapping("/cdn")
public class ImageController {

    private static final String UPLOAD_DIR = "uploads/";

    // Initialize upload directory
    public ImageController() {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    // Upload an image
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Check if file is empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Validate content type
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                return ResponseEntity.badRequest().body("Invalid file name");
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Generate a unique numeric filename with the extension
            String fileName = System.currentTimeMillis() + extension;
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // Save the file
            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok("/cdn/images/" + fileName); // Return public URL
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }

    // Serve images
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, filename);

            // Check if file exists
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource fileResource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                    .body(fileResource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete an image
    @DeleteMapping("/images/{filename}")
    public ResponseEntity<String> deleteImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, filename);

            // Check if file exists
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Files.delete(filePath);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete image");
        }
    }
}


