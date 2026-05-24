package com.leadflow.controllers;

import com.leadflow.dtos.*;
import com.leadflow.services.LeadService;
import com.leadflow.utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<LeadResponseDTO>> fetchAll() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadDetailsDTO> fetchDetails(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.fetchDetails(id));
    }

    @PostMapping
    public ResponseEntity<LeadResponseDTO> create(@RequestBody CreateLeadRequest request) {
        LeadResponseDTO created = leadService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/discussions")
    public ResponseEntity<LeadDetailsDTO> addDiscussion(
            @PathVariable Long id, 
            @RequestBody AddDiscussionRequest request) {
        LeadDetailsDTO updatedDetails = leadService.addDiscussion(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedDetails);
    }

}