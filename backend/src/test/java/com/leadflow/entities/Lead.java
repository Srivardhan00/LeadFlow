package com.leadflow.entities;

import jakarta.persistence.Entity;
import com.leadflow.utils.Status;

import java.time.LocalDateTime;

@Entity
public class Lead {
    private Long id;
    private String fullName;
    private String company;
    private String phoneNumber;
    private Status status;
    private LocalDateTime followUpAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
