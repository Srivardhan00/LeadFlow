package com.leadflow.repositories;


import com.leadflow.entities.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByLeadIdOrderByCreatedAtDesc(Long leadId);
}