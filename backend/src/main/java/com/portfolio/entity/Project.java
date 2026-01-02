package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String client;
    private String service;
    private String year;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String image;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
