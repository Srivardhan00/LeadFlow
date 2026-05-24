package com.leadflow.controllers;

import com.leadflow.entities.Lead;
import com.leadflow.services.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LeadController {

    @Autowired
    private final LeadService leadService;

    @GetMapping("/api/leads")
    public List<Lead> fetchAll() {
        return leadService.fetchAll();
    }
}