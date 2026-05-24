package com.leadflow.entities;

import jakarta.persistence.*;
import com.leadflow.utils.Status;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String company;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Status status = Status.NEW;

    private LocalDateTime followUpAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "lead")
    private List<Discussion> discussionList;
}
