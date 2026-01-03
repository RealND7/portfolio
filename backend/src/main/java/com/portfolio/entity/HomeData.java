package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "home_data")
public class HomeData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String heroTitle;
    private String heroSubtitle;

    // Profile Section
    @Column(columnDefinition = "TEXT")
    private String profileImage; // Base64 or URL
    
    private String nameKr;
    private String nameEn;
    private String email;
    private String phone;

    // About Me Section
    private String aboutMeTitle;
    
    @Column(columnDefinition = "TEXT")
    private String aboutMeContent;

    // Career Section
    private String careerTitle;
    
    @Column(columnDefinition = "TEXT")
    private String careerContent;

    // Project Section (Summary)
    private String projectTitle;
    
    @Column(columnDefinition = "TEXT")
    private String projectContent;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
