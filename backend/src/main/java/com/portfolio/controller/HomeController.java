package com.portfolio.controller;

import com.portfolio.entity.HomeData;
import com.portfolio.repository.HomeDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeDataRepository homeDataRepository;
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @GetMapping
    public ResponseEntity<HomeData> getHomeData() {
        return homeDataRepository.findAll().stream().findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public HomeData updateHomeData(@RequestBody HomeData homeData) {
        // Singleton pattern: update existing or create new if none exists
        return homeDataRepository.findAll().stream().findFirst()
                .map(existing -> {
                    homeData.setId(existing.getId());
                    return homeDataRepository.save(homeData);
                })
                .orElseGet(() -> homeDataRepository.save(homeData));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile file) {
        try {
            if (Files.notExists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok().body("{\"imageUrl\": \"" + fileUrl + "\"}");
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body("Could not upload file: " + ex.getMessage());
        }
    }
}
