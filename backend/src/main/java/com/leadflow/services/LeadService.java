package com.leadflow.services;

import com.leadflow.entities.Lead;
import com.leadflow.entities.Discussion;
import com.leadflow.repositories.LeadRepository;
import com.leadflow.repositories.DiscussionRepository;
import com.leadflow.dtos.*;
import com.leadflow.exceptions.ResourceNotFoundException;
import com.leadflow.utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final DiscussionRepository discussionRepository;

    public List<LeadResponseDTO> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public LeadDetailsDTO fetchDetails(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));

        List<DiscussionResponseDTO> discussions = discussionRepository.findByLeadIdOrderByCreatedAtDesc(id).stream()
                .map(d -> new DiscussionResponseDTO(d.getId(), d.getContent(), d.getCreatedAt()))
                .collect(Collectors.toList());

        return new LeadDetailsDTO(
                lead.getId(),
                lead.getFullName(),
                lead.getCompany(),
                lead.getPhoneNumber(),
                lead.getStatus(),
                lead.getFollowUpAt(),
                discussions
        );
    }

    @Transactional
    public LeadResponseDTO create(CreateLeadRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Lead name is required.");
        }
        Lead lead = new Lead();
        lead.setFullName(request.getFullName().trim());
        lead.setCompany(request.getCompany() != null ? request.getCompany().trim() : null);
        lead.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        lead.setStatus(request.getStatus() != null ? request.getStatus() : Status.NEW);
        
        Lead saved = leadRepository.save(lead);
        return convertToResponseDTO(saved);
    }

    @Transactional
    public LeadDetailsDTO addDiscussion(Long leadId, AddDiscussionRequest request) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Discussion content cannot be empty.");
        }

        // Create and save new discussion
        Discussion discussion = new Discussion();
        discussion.setContent(request.getContent().trim());
        discussion.setLead(lead);
        discussionRepository.save(discussion);

        // Update lead properties: follow-up datetime
        lead.setFollowUpAt(request.getFollowUpAt());

        // Update lead status if provided in request
        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }

        leadRepository.save(lead);

        // Return updated lead details with the reverse-chronological discussions
        return fetchDetails(leadId);
    }

    private LeadResponseDTO convertToResponseDTO(Lead lead) {
        // Find latest discussion by sorting
        Discussion latest = null;
        if (lead.getDiscussionList() != null && !lead.getDiscussionList().isEmpty()) {
            latest = lead.getDiscussionList().stream()
                    .max(Comparator.comparing(Discussion::getCreatedAt))
                    .orElse(null);
        }

        return new LeadResponseDTO(
                lead.getId(),
                lead.getFullName(),
                lead.getCompany(),
                lead.getPhoneNumber(),
                lead.getStatus(),
                lead.getFollowUpAt(),
                latest != null ? latest.getContent() : null,
                latest != null ? latest.getCreatedAt() : null
        );
    }
}
