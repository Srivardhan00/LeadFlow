package com.leadflow.entities;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class Discussion {
    private Long id;
    private String content;
    private LocalDateTime createdAt;

    private Long leadId;
}
